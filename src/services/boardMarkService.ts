import axios from "axios";
import { BoardResolution, CreateResolutionInput, SignRequest, Signatory, ResolutionStatus } from "../types/boardMark";
import { notificationService } from "./notificationService";
import { supabase } from "../supabase";

const RAW_API: string | undefined = (import.meta as any).env?.VITE_API_BASE_URL;
const API_BASE = RAW_API || "/api";
// Force mock mode to eliminate 404s immediately. Set to false when backend is ready.
const IS_MOCK = false;
// const SUPABASE_URL: string | undefined = (import.meta as any).env?.VITE_SUPABASE_URL;
// const SUPABASE_KEY: string | undefined = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY;
// Temporarily disable Supabase to avoid DNS errors and force local fallback
const USE_SUPABASE = false;
export class BoardMarkService {
  private static instance: BoardMarkService;
  private readonly STORAGE_KEY = "board_mark_resolutions";
  private readonly SESSION_SEQ_KEY = "board_mark_session_seq";

  private constructor() {}

  public static getInstance(): BoardMarkService {
    if (!BoardMarkService.instance) {
      BoardMarkService.instance = new BoardMarkService();
    }
    return BoardMarkService.instance;
  }

  public async createResolution(input: CreateResolutionInput): Promise<BoardResolution> {
    // Helpers for auto placeholders
    const formatTwo = (n: number) => (n < 10 ? `0${n}` : `${n}`);
    const getNextSessionNumber = (): string => {
      try {
        const raw = localStorage.getItem(this.SESSION_SEQ_KEY);
        const next = (raw ? parseInt(raw, 10) : 0) + 1;
        localStorage.setItem(this.SESSION_SEQ_KEY, `${next}`);
        // Zero-pad to at least 2 digits: 01, 02, ... 10, 11, ...
        return `${next}`.padStart(2, '0');
      } catch {
        // Fallback: start from 01 when storage not available
        return '01';
      }
    };
    const buildAutoContext = (meetingDateIso: string, overrides?: Partial<CreateResolutionInput>) => {
      const d = new Date(meetingDateIso);
      const fiscalYear = overrides?.fiscalYearOverride || d.getFullYear().toString();
      const dayName = new Intl.DateTimeFormat('ar-SA', { weekday: 'long' }).format(d);
      const gregDate = overrides?.gregOverride || new Intl.DateTimeFormat('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' }).format(d);
      const hijriDate = overrides?.hijriOverride || new Intl.DateTimeFormat('ar-SA-u-ca-islamic', { year: 'numeric', month: 'long', day: 'numeric' }).format(d);
      const time = overrides?.timeOverride || `${formatTwo(d.getHours())}:${formatTwo(d.getMinutes())}`;
      const sessionNumber = overrides?.sessionNumberOverride || getNextSessionNumber();
      return { fiscalYear, dayName, gregDate, hijriDate, time, sessionNumber };
    };
    const applyAutoPlaceholders = (template: string, meetingDateIso: string, manual?: Partial<CreateResolutionInput>): string => {
      const ctx = buildAutoContext(meetingDateIso, manual);
      let out = template
        .replaceAll('[رقم الجلسة]', ctx.sessionNumber)
        .replaceAll('[السنة المالية]', ctx.fiscalYear)
        .replaceAll('[اليوم]', ctx.dayName)
        .replaceAll('[التاريخ الميلادي]', ctx.gregDate)
        .replaceAll('[التاريخ الهجري]', ctx.hijriDate)
        .replaceAll('[الوقت]', ctx.time)
        .replaceAll('[التاريخ]', ctx.gregDate);
      // Secretary-provided placeholders
      if (manual?.meetingLocation) out = out.replaceAll('[المكان/المدينة]', manual.meetingLocation);
      if (manual?.presidentName) out = out.replaceAll('[اسم الرئيس]', manual.presidentName);
      if (manual?.attendees) out = out.replaceAll('[الأسماء]', manual.attendees);
      if (manual?.absentees) out = out.replaceAll('[الأسماء إن وُجدت]', manual.absentees);
      if (manual?.previousSessionNumber) out = out.replaceAll('[رقم الجلسة السابقة]', manual.previousSessionNumber);
      if (manual?.previousSessionDate) out = out.replaceAll('[تاريخه]', manual.previousSessionDate);
      if (manual?.agendaItems) out = out.replaceAll('بعد ذلك استعرض المجلس جدول الأعمال على النحو الآتي:', manual.agendaItems);
      if (Array.isArray(manual?.agendaItemsList) && manual!.agendaItemsList!.length > 0) {
        const items = manual!.agendaItemsList!.map((it, idx) => `• ${it}`).join('\n');
        // Replace numbered placeholders if present
        out = out
          .replaceAll('[البند الأول]', manual!.agendaItemsList![0] || '[البند الأول]')
          .replaceAll('[البند الثاني]', manual!.agendaItemsList![1] || '[البند الثاني]');
        // Append remaining items after the agenda line if more than two
        if (manual!.agendaItemsList!.length > 2) {
          out = out.replace('بعد ذلك استعرض المجلس جدول الأعمال على النحو الآتي:', `بعد ذلك استعرض المجلس جدول الأعمال على النحو الآتي:\n${items}`);
        }
      }
      if (manual?.committee || manual?.tasksResponsibilities) {
        out = out.replace(
          /وكُلِّفت \[الإدارة\/اللجنة\] بما يأتي: \[المهام والمسؤوليات، مع تحديد الجهة والمسؤول والمدة الزمنية ومؤشرات الأداء\]/g,
          `وكُلِّفت ${manual?.committee || '[الإدارة/اللجنة]'} بما يأتي: ${manual?.tasksResponsibilities || '[المهام والمسؤوليات، مع تحديد الجهة والمسؤول والمدة الزمنية ومؤشرات الأداء]'}`
        );
      }
      // Voting outcome and notes
      const vote = manual?.voteOutcome || 'بالإجماع';
      const notesPresence = (manual?.notesText && manual.notesText.trim().length > 0) ? 'مع' : (manual?.notesChoice || 'دون');
      out = out.replaceAll('[بالإجماع/بالأغلبية]', vote);
      out = out.replaceAll('[بالإجماع/بالأغلبية] ', `${vote} `);
      out = out.replaceAll('[مع/دون]', notesPresence);
      // If notes text exists, append it right after the placeholder phrase
      if (notesPresence === 'مع' && manual?.notesText) {
        out = out.replace('ملاحظات،', `ملاحظات: ${manual.notesText}،`);
      }
      return out;
    };

    // Default demo signatories (meeting attendees)
    const demoSignatories: Signatory[] = [
      { id: `SIG-${Date.now()}-1`, name: "Nader Al-Nasser", email: "gceo@aljeri.com", jobTitle: "GCEO" },
      { id: `SIG-${Date.now()}-2`, name: "Khalid Hezam Al-Qahtani", email: "vicechair@aljeri.com", jobTitle: "Vice Chairman" },
      { id: `SIG-${Date.now()}-3`, name: "Hezam Z. Al-Qahtani", email: "chairman@aljeri.com", jobTitle: "Chairman" },
    ];
    if (USE_SUPABASE) {
      try {
      // Create in Supabase (real mode)
      const now = new Date();
      const id = `RES-${now.getTime()}`;
      const deadline = new Date(input.meetingDate);
      deadline.setDate(deadline.getDate() + (input.deadlineDays ?? 7));
      const baseRow = {
        id,
        created_at: now.toISOString(),
        updated_at: now.toISOString(),
        meeting_date: input.meetingDate,
        agreement_details: input.agreementDetails,
        status: "awaiting_signatures" as ResolutionStatus,
        deadline_at: deadline.toISOString(),
        dabaja_text_ar: applyAutoPlaceholders(`محضر اجتماع مجلس الإدارة رقم [رقم الجلسة]/[السنة المالية]

انعقد، بعون الله وتوفيقه، مجلسُ إدارة شركة الجري للاستثمار في يوم [اليوم] [التاريخ الميلادي] الموافق [التاريخ الهجري]، في تمام الساعة [الوقت]، بمقر الشركة الكائن في [المكان/المدينة]، برئاسة [اسم الرئيس]، وحضور السادة أعضاء المجلس: [الأسماء]، واعتذار/غياب [الأسماء إن وُجدت].

وقد تَحقق النصابُ النظامي للاجتماع وفق اللوائح المعتمدة، فافتتح الرئيسُ الجلسةَ مُثنيًا على ما أُسند إلى المجلس من مسؤولية الإدارة والإشراف على شؤون الشركة، مؤكِّدًا أن المصلحة العامة للشركة واستدامة نموِّها هي البوصلة التي لا تحيد.

ثم تلي محضرُ الجلسة السابقة رقم [رقم الجلسة السابقة] المؤرخ في [تاريخه]، وبعد المداولة أُقِرَّ [بالإجماع/بالأغلبية] [مع/دون] ملاحظات.

بعد ذلك استعرض المجلس جدول الأعمال على النحو الآتي:`, input.meetingDate, input),
        dabaja_text_en: "Board Minutes: Under the authority vested in the Board and in accordance with applicable laws and regulations, the following resolution was adopted:",
        preamble_ar: applyAutoPlaceholders(`[البند الأول]،

[البند الثاني]،

…،

وشرع في مناقشة كل بندٍ على حدة، مُستنيرًا بالبيانات والتقارير، ومستحضرًا موجبات الحوكمة الرشيدة والالتزام بالقوانين واللوائح ذات الصلة.

وبعد استيفاء النقاش في سائر البنود، توصل المجلس إلى القرارات والتوصيات المبيّنة أعلاه، وكُلِّفت [الإدارة/اللجنة] بما يأتي: [المهام والمسؤوليات، مع تحديد الجهة والمسؤول والمدة الزمنية ومؤشرات الأداء]، على أن تُرفع تقاريرُ المتابعة في موعد أقصاه [التاريخ].

وتُدوَّن هذه القرارات في سجل قرارات المجلس، وتُبلَّغ الجهاتُ المختصة للتنفيذ، مع التأكيد على التقيد التام بالأنظمة والتعليمات ذات الصلة.

اعتمد الحاضرون محتوى هذا المحضر ووقَّعوا عليه توقيعًا إلكترونيًا موثَّقًا عبر بوابة مجلس الإدارة بتاريخ [التاريخ]، الساعة [الوقت]،

وتُعد هذه النسخة الإلكترونية الموقَّعة النسخة الأصلية الملزمة نظامًا، وأي نسخة مطبوعة عنها تُعد صورة لا تُغني عن الأصل.`, input.meetingDate, input),
        preamble_en: "The matter was discussed and the Board resolved as follows:",
        barcode_data: id,
      } as any;
      const { error } = await supabase.from("board_resolutions").insert(baseRow);
      if (error) throw error;

      const signatories: Signatory[] = demoSignatories.map((s, idx) => ({ ...s, id: `${id}-bm-${idx+1}` }));
      const { error: sErr } = await supabase.from("board_signatories").insert(
        signatories.map((s) => ({
          id: s.id,
          resolution_id: id,
          name: s.name,
          email: s.email,
          job_title: s.jobTitle,
          national_id_last3: s.nationalIdLast3,
        }))
      );
      if (sErr) throw sErr;

      const resolution: BoardResolution = {
        id,
        createdAt: baseRow.created_at,
        updatedAt: baseRow.updated_at,
        meetingDate: baseRow.meeting_date,
        agreementDetails: baseRow.agreement_details,
        status: baseRow.status,
        deadlineAt: baseRow.deadline_at,
        dabajaTextAr: baseRow.dabaja_text_ar,
        dabajaTextEn: baseRow.dabaja_text_en,
        preambleAr: baseRow.preamble_ar,
        preambleEn: baseRow.preamble_en,
        signatories,
        barcodeData: id,
      };
      notificationService.notifyBoardMeeting(
        `New board resolution awaiting signatures (deadline: ${deadline.toLocaleDateString()})`,
        false,
      );
      return resolution;
      } catch {
        // Fallback to local storage when Supabase is unreachable
      }
    }
    if (RAW_API) {
      try {
        const response = await axios.post(`${API_BASE}/board-mark/resolutions`, input);
        const resolution = response.data as BoardResolution;
        notificationService.notifyBoardMeeting(
          `New board resolution awaiting signatures (deadline: ${new Date(resolution.deadlineAt).toLocaleDateString()})`,
          false,
        );
        return resolution;
      } catch {
        // fall through to local storage
      }
    }
    {
      // Fallback to localStorage mock
      const now = new Date();
      const id = `RES-${now.getTime()}`;
      const signatories: Signatory[] = demoSignatories.map((s, idx) => ({ ...s, id: `${id}-bm-${idx+1}` }));
      const deadline = new Date(input.meetingDate);
      const addDays = input.deadlineDays ?? 7;
      deadline.setDate(deadline.getDate() + addDays);
      const mock: BoardResolution = {
        id,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
        meetingDate: input.meetingDate,
        agreementDetails: input.agreementDetails,
        status: "awaiting_signatures" as ResolutionStatus,
        deadlineAt: deadline.toISOString(),
        dabajaTextAr: applyAutoPlaceholders(`محضر اجتماع مجلس الإدارة رقم [رقم الجلسة]/[السنة المالية]

انعقد، بعون الله وتوفيقه، مجلسُ إدارة شركة الجري للاستثمار في يوم [اليوم] [التاريخ الميلادي] الموافق [التاريخ الهجري]، في تمام الساعة [الوقت]، بمقر الشركة الكائن في [المكان/المدينة]، برئاسة [اسم الرئيس]، وحضور السادة أعضاء المجلس: [الأسماء]، واعتذار/غياب [الأسماء إن وُجدت].

وقد تَحقق النصابُ النظامي للاجتماع وفق اللوائح المعتمدة، فافتتح الرئيسُ الجلسةَ مُثنيًا على ما أُسند إلى المجلس من مسؤولية الإدارة والإشراف على شؤون الشركة، مؤكِّدًا أن المصلحة العامة للشركة واستدامة نموِّها هي البوصلة التي لا تحيد.

ثم تلي محضرُ الجلسة السابقة رقم [رقم الجلسة السابقة] المؤرخ في [تاريخه]، وبعد المداولة أُقِرَّ [بالإجماع/بالأغلبية] [مع/دون] ملاحظات.

بعد ذلك استعرض المجلس جدول الأعمال على النحو الآتي:`, input.meetingDate, input),
        dabajaTextEn: "Board Minutes: Under the authority vested in the Board and in accordance with applicable laws and regulations, the following resolution was adopted:",
        preambleAr: applyAutoPlaceholders(`[البند الأول]،

[البند الثاني]،

…،

وشرع في مناقشة كل بندٍ على حدة، مُستنيرًا بالبيانات والتقارير، ومستحضرًا موجبات الحوكمة الرشيدة والالتزام بالقوانين واللوائح ذات الصلة.

وبعد استيفاء النقاش في سائر البنود، توصل المجلس إلى القرارات والتوصيات المبيّنة أعلاه، وكُلِّفت [الإدارة/اللجنة] بما يأتي: [المهام والمسؤوليات، مع تحديد الجهة والمسؤول والمدة الزمنية ومؤشرات الأداء]، على أن تُرفع تقاريرُ المتابعة في موعد أقصاه [التاريخ].

وتُدوَّن هذه القرارات في سجل قرارات المجلس، وتُبلَّغ الجهاتُ المختصة للتنفيذ، مع التأكيد على التقيد التام بالأنظمة والتعليمات ذات الصلة.

اعتمد الحاضرون محتوى هذا المحضر ووقَّعوا عليه توقيعًا إلكترونيًا موثَّقًا عبر بوابة مجلس الإدارة بتاريخ [التاريخ]، الساعة [الوقت]،

وتُعد هذه النسخة الإلكترونية الموقَّعة النسخة الأصلية الملزمة نظامًا، وأي نسخة مطبوعة عنها تُعد صورة لا تُغني عن الأصل.`, input.meetingDate, input),
        preambleEn: "The matter was discussed and the Board resolved as follows:",
        signatories,
        barcodeData: id,
      };
      const list = this.readLocal();
      list.unshift(mock);
      this.writeLocal(list);
      notificationService.notifyBoardMeeting(
        `New board resolution awaiting signatures (deadline: ${deadline.toLocaleDateString()})`,
        false,
      );
      return mock;
    }
  }

  public async listResolutions(): Promise<BoardResolution[]> {
    if (USE_SUPABASE) {
      try {
      const { data, error } = await supabase
        .from("board_resolutions")
        .select("*")
        .order("created_at", { ascending: false });
        if (error) throw error;
      const rows = (data || []) as any[];
        // Also fetch signatories to enrich preview/PDF
        const resolutions: BoardResolution[] = [];
        for (const r of rows) {
          let signatories: Signatory[] = [];
          try {
            const { data: sigs } = await supabase
              .from("board_signatories")
              .select("*")
              .eq("resolution_id", r.id);
            signatories = (sigs || []).map((s: any) => ({
              id: s.id,
              name: s.name,
              email: s.email,
              jobTitle: s.job_title,
              nationalIdLast3: s.national_id_last3,
              signedAt: s.signed_at || undefined,
              signatureHash: s.signature_hash || undefined,
            }));
          } catch { /* ignore */ }
          resolutions.push({
        id: r.id,
        createdAt: r.created_at,
        updatedAt: r.updated_at,
        meetingDate: r.meeting_date,
        agreementDetails: r.agreement_details,
        status: r.status,
        deadlineAt: r.deadline_at,
        dabajaTextAr: r.dabaja_text_ar,
        dabajaTextEn: r.dabaja_text_en,
        preambleAr: r.preamble_ar,
        preambleEn: r.preamble_en,
            signatories,
        barcodeData: r.barcode_data,
          });
        }
        return resolutions;
      } catch {
        // fallback below
      }
    }
    if (IS_MOCK) {
      const list = this.readLocal();
      if (list.length > 0) return list;
      // seed a demo resolution when empty
      const now = new Date();
      const id = `RES-${now.getTime()}`;
      const seed: BoardResolution = {
        id,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
        meetingDate: now.toISOString(),
        agreementDetails: 'Demo: Approval of Q4 Financial Report and 2025 Strategy.',
        status: 'awaiting_signatures',
        deadlineAt: new Date(now.getTime() + 7*24*60*60*1000).toISOString(),
        dabajaTextAr: 'محضر مجلس الإدارة: ...',
        dabajaTextEn: 'Board Minutes: ...',
        preambleAr: 'تمت مناقشة الموضوع واتخاذ القرار التالي:',
        preambleEn: 'The matter was discussed and the Board resolved as follows:',
        signatories: [
          { id: `${id}-bm-1`, name: 'Board Chairman', email: 'board@company.com', jobTitle: 'Chairman' },
          { id: `${id}-bm-2`, name: 'Chief Executive Officer', email: 'ceo@company.com', jobTitle: 'CEO' },
        ],
        barcodeData: id,
      };
      const seeded = [seed, ...list];
      this.writeLocal(seeded);
      return seeded;
    }
    try {
      const response = await axios.get(`${API_BASE}/board-mark/resolutions`);
      const data = response.data;
      let list = Array.isArray(data) ? (data as BoardResolution[]) : [];
      // if API empty, fallback to local
      if (!list.length) {
        const local = this.readLocal();
        if (local.length) return local;
        // seed when totally empty
        const now = new Date();
        const id = `RES-${now.getTime()}`;
        const seed: BoardResolution = {
          id,
          createdAt: now.toISOString(),
          updatedAt: now.toISOString(),
          meetingDate: now.toISOString(),
          agreementDetails: 'Demo: Approval of Q4 Financial Report and 2025 Strategy.',
          status: 'awaiting_signatures',
          deadlineAt: new Date(now.getTime() + 7*24*60*60*1000).toISOString(),
          dabajaTextAr: 'محضر مجلس الإدارة: ...',
          dabajaTextEn: 'Board Minutes: ...',
          preambleAr: 'تمت مناقشة الموضوع واتخاذ القرار التالي:',
          preambleEn: 'The matter was discussed and the Board resolved as follows:',
          signatories: [
            { id: `${id}-bm-1`, name: 'Board Chairman', email: 'board@company.com', jobTitle: 'Chairman' },
            { id: `${id}-bm-2`, name: 'Chief Executive Officer', email: 'ceo@company.com', jobTitle: 'CEO' },
          ],
          barcodeData: id,
        };
        const seeded = [seed];
        this.writeLocal(seeded);
        return seeded;
      }
      return list;
    } catch {
      const local = this.readLocal();
      if (local.length) return local;
      // seed when totally empty
      const now = new Date();
      const id = `RES-${now.getTime()}`;
      const seed: BoardResolution = {
        id,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
        meetingDate: now.toISOString(),
        agreementDetails: 'Demo: Approval of Q4 Financial Report and 2025 Strategy.',
        status: 'awaiting_signatures',
        deadlineAt: new Date(now.getTime() + 7*24*60*60*1000).toISOString(),
        dabajaTextAr: 'محضر مجلس الإدارة: ...',
        dabajaTextEn: 'Board Minutes: ...',
        preambleAr: 'تمت مناقشة الموضوع واتخاذ القرار التالي:',
        preambleEn: 'The matter was discussed and the Board resolved as follows:',
        signatories: [
          { id: `${id}-bm-1`, name: 'Board Chairman', email: 'board@company.com', jobTitle: 'Chairman' },
          { id: `${id}-bm-2`, name: 'Chief Executive Officer', email: 'ceo@company.com', jobTitle: 'CEO' },
        ],
        barcodeData: id,
      };
      const seeded = [seed];
      this.writeLocal(seeded);
      return seeded;
    }
  }

  public async getResolution(id: string): Promise<BoardResolution> {
    if (USE_SUPABASE) {
      try {
      const { data, error } = await supabase
        .from("board_resolutions")
        .select("*")
        .eq("id", id)
        .single();
      if (error || !data) throw error || new Error("Resolution not found");
      const { data: sigs } = await supabase
        .from("board_signatories")
        .select("*")
        .eq("resolution_id", id);
      const signatories: Signatory[] = (sigs || []).map((s: any) => ({
        id: s.id,
        name: s.name,
        email: s.email,
        jobTitle: s.job_title,
        nationalIdLast3: s.national_id_last3,
        signedAt: s.signed_at || undefined,
        signatureHash: s.signature_hash || undefined,
      }));
      return {
        id: data.id,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        meetingDate: data.meeting_date,
        agreementDetails: data.agreement_details,
        status: data.status,
        deadlineAt: data.deadline_at,
        dabajaTextAr: data.dabaja_text_ar,
        dabajaTextEn: data.dabaja_text_en,
        preambleAr: data.preamble_ar,
        preambleEn: data.preamble_en,
        signatories,
        barcodeData: data.barcode_data,
      };
      } catch {
        // fallback below
      }
    }
    if (IS_MOCK) {
      const found = this.readLocal().find(r => r.id === id);
      if (!found) throw new Error("Resolution not found");
      return found;
    }
    try {
      const response = await axios.get(`${API_BASE}/board-mark/resolutions/${id}`);
      return response.data as BoardResolution;
    } catch {
      const found = this.readLocal().find(r => r.id === id);
      if (!found) throw new Error("Resolution not found");
      return found;
    }
  }

  public async requestSignatures(id: string): Promise<void> {
    if (IS_MOCK) {
      // mock: no-op
      return;
    }
    try {
      await axios.post(`${API_BASE}/board-mark/resolutions/${id}/request-signatures`);
    } catch {
      // mock: no-op
    }
  }

  public async sign(request: SignRequest): Promise<BoardResolution> {
    if (USE_SUPABASE) {
      try {
      const signedAt = new Date().toISOString();
      const signatureHash = cryptoRandom();
      await supabase
        .from("board_signatories")
        .update({ signed_at: signedAt, signature_hash: signatureHash })
        .eq("resolution_id", request.resolutionId)
        .eq("id", request.signatoryId);
      return this.getResolution(request.resolutionId);
      } catch {
        // fallback below
      }
    }
    if (IS_MOCK) {
      const list = this.readLocal();
      const i = list.findIndex(r => r.id === request.resolutionId);
      if (i === -1) throw new Error("Resolution not found");
      const res = { ...list[i] };
      res.signatories = res.signatories.map(s => s.id === request.signatoryId ? ({ ...s, signedAt: new Date().toISOString(), signatureHash: cryptoRandom() }) : s);
      res.updatedAt = new Date().toISOString();
      list[i] = res;
      this.writeLocal(list);
      return res;
    }
    try {
      const response = await axios.post(`${API_BASE}/board-mark/resolutions/${request.resolutionId}/sign`, request);
      return response.data as BoardResolution;
    } catch {
      const list = this.readLocal();
      const i = list.findIndex(r => r.id === request.resolutionId);
      if (i === -1) throw new Error("Resolution not found");
      const res = { ...list[i] };
      res.signatories = res.signatories.map(s => s.id === request.signatoryId ? ({ ...s, signedAt: new Date().toISOString(), signatureHash: cryptoRandom() }) : s);
      res.updatedAt = new Date().toISOString();
      list[i] = res;
      this.writeLocal(list);
      return res;
    }
  }

  public async finalize(id: string): Promise<BoardResolution> {
    if (USE_SUPABASE) {
      try {
      await supabase
        .from("board_resolutions")
        .update({ status: "finalized" as ResolutionStatus, updated_at: new Date().toISOString() })
        .eq("id", id);
      const resolution = await this.getResolution(id);
      notificationService.notifyExecutive(
        `Resolution ${resolution.id} finalized and archived`,
        'success',
        false
      );
      return resolution;
      } catch {
        // fallback below
      }
    }
    if (IS_MOCK) {
      const list = this.readLocal();
      const i = list.findIndex(r => r.id === id);
      if (i === -1) throw new Error("Resolution not found");
      const res: BoardResolution = { ...list[i], status: "finalized" as ResolutionStatus, updatedAt: new Date().toISOString(), barcodeData: list[i].id };
      list[i] = res;
      this.writeLocal(list);
      notificationService.notifyExecutive(
        `Resolution ${res.id} finalized and archived`,
        'success',
        false
      );
      return res;
    }
    try {
      const response = await axios.post(`${API_BASE}/board-mark/resolutions/${id}/finalize`);
      const resolution = response.data as BoardResolution;
      notificationService.notifyExecutive(
        `Resolution ${resolution.id} finalized and archived`,
        'success',
        false
      );
      return resolution;
    } catch {
      const list = this.readLocal();
      const i = list.findIndex(r => r.id === id);
      if (i === -1) throw new Error("Resolution not found");
      const res: BoardResolution = { ...list[i], status: "finalized" as ResolutionStatus, updatedAt: new Date().toISOString(), barcodeData: list[i].id };
      list[i] = res;
      this.writeLocal(list);
      notificationService.notifyExecutive(
        `Resolution ${res.id} finalized and archived`,
        'success',
        false
      );
      return res;
    }
  }

  public async markExpired(id: string): Promise<void> {
    if (IS_MOCK) {
      const list = this.readLocal();
      const i = list.findIndex(r => r.id === id);
      if (i !== -1) {
        list[i] = { ...list[i], status: "expired" as ResolutionStatus, updatedAt: new Date().toISOString() };
        this.writeLocal(list);
      }
      notificationService.notifyExecutive(
        `Resolution ${id} marked as Time Limit Exceeded`,
        'warning',
        true
      );
      return;
    }
    try {
      await axios.post(`${API_BASE}/board-mark/resolutions/${id}/expire`);
      notificationService.notifyExecutive(`Resolution ${id} marked as Time Limit Exceeded`, 'warning', true);
    } catch {
      const list = this.readLocal();
      const i = list.findIndex(r => r.id === id);
      if (i !== -1) {
        list[i] = { ...list[i], status: "expired" as ResolutionStatus, updatedAt: new Date().toISOString() };
        this.writeLocal(list);
      }
      notificationService.notifyExecutive(
        `Resolution ${id} marked as Time Limit Exceeded`,
        'warning',
        true
      );
    }
  }

  // Local storage helpers
  private readLocal(): BoardResolution[] {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  private writeLocal(list: BoardResolution[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(list));
    } catch {
      // ignore
    }
  }
}

export const boardMarkService = BoardMarkService.getInstance();

function cryptoRandom(): string {
  try {
    const arr = new Uint32Array(4);
    crypto.getRandomValues(arr);
    return Array.from(arr).map(n => n.toString(16)).join("");
  } catch {
    return Math.random().toString(36).slice(2);
  }
}


