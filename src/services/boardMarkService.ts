import axios from "axios";
import { BoardResolution, CreateResolutionInput, SignRequest, Signatory, ResolutionStatus } from "../types/boardMark";
import { notificationService } from "./notificationService";
import { supabase } from "../supabase";

const RAW_API: string | undefined = (import.meta as any).env?.VITE_API_BASE_URL;
const API_BASE = RAW_API || "/api";
// Force mock mode to eliminate 404s immediately. Set to false when backend is ready.
const IS_MOCK = false;
const SUPABASE_URL: string = (import.meta as any).env?.VITE_SUPABASE_URL || "https://demo.supabase.co";
const SUPABASE_KEY: string = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || "demo-anon-key";
//const USE_SUPABASE = SUPABASE_URL !== "https://demo.supabase.co" && SUPABASE_KEY !== "demo-anon-key" && SUPABASE_URL.includes("supabase.co");
const USE_SUPABASE = true;
export class BoardMarkService {
  private static instance: BoardMarkService;
  private readonly STORAGE_KEY = "board_mark_resolutions";

  private constructor() {}

  public static getInstance(): BoardMarkService {
    if (!BoardMarkService.instance) {
      BoardMarkService.instance = new BoardMarkService();
    }
    return BoardMarkService.instance;
  }

  public async createResolution(input: CreateResolutionInput): Promise<BoardResolution> {
    if (USE_SUPABASE) {
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
        dabaja_text_ar: "محضر مجلس الإدارة: بناءً على الصلاحيات المخولة للمجلس ووفقاً للأنظمة واللوائح المعمول بها، تم اتخاذ القرار التالي:",
        dabaja_text_en: "Board Minutes: Under the authority vested in the Board and in accordance with applicable laws and regulations, the following resolution was adopted:",
        preamble_ar: "تمت مناقشة الموضوع واتخاذ القرار التالي:",
        preamble_en: "The matter was discussed and the Board resolved as follows:",
        barcode_data: id,
      } as any;
      const { error } = await supabase.from("board_resolutions").insert(baseRow);
      if (error) throw error;

      const signatories: Signatory[] = [
        { id: `${id}-bm-1`, name: "Board Chairman", email: "board@company.com", jobTitle: "Chairman", nationalIdLast3: "123" },
        { id: `${id}-bm-2`, name: "Chief Executive Officer", email: "ceo@company.com", jobTitle: "CEO", nationalIdLast3: "456" },
        { id: `${id}-bm-3`, name: "Chief Financial Officer", email: "cfo@company.com", jobTitle: "CFO", nationalIdLast3: "789" },
      ];
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
    }
    try {
      const response = await axios.post(`${API_BASE}/board-mark/resolutions`, input);
      const resolution = response.data as BoardResolution;
      notificationService.notifyBoardMeeting(
        `New board resolution awaiting signatures (deadline: ${new Date(resolution.deadlineAt).toLocaleDateString()})`,
        false,
      );
      return resolution;
    } catch {
      // Fallback to localStorage mock
      const now = new Date();
      const id = `RES-${now.getTime()}`;
      const signatories: Signatory[] = [
        { id: `${id}-bm-1`, name: "Board Chairman", email: "board@company.com", jobTitle: "Chairman", nationalIdLast3: "123" },
        { id: `${id}-bm-2`, name: "Chief Executive Officer", email: "ceo@company.com", jobTitle: "CEO", nationalIdLast3: "456" },
        { id: `${id}-bm-3`, name: "Chief Financial Officer", email: "cfo@company.com", jobTitle: "CFO", nationalIdLast3: "789" },
      ];
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
        dabajaTextAr: "محضر مجلس الإدارة: بناءً على الصلاحيات المخولة للمجلس ووفقاً للأنظمة واللوائح المعمول بها، تم اتخاذ القرار التالي:",
        dabajaTextEn: "Board Minutes: Under the authority vested in the Board and in accordance with applicable laws and regulations, the following resolution was adopted:",
        preambleAr: "تمت مناقشة الموضوع واتخاذ القرار التالي:",
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
      const { data, error } = await supabase
        .from("board_resolutions")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) return [];
      const rows = (data || []) as any[];
      return rows.map((r) => ({
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
        signatories: [],
        barcodeData: r.barcode_data,
      }));
    }
    if (IS_MOCK) {
      return this.readLocal();
    }
    try {
      const response = await axios.get(`${API_BASE}/board-mark/resolutions`);
      const data = response.data;
      return Array.isArray(data) ? (data as BoardResolution[]) : [];
    } catch {
      return [];
    }
  }

  public async getResolution(id: string): Promise<BoardResolution> {
    if (USE_SUPABASE) {
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
      const signedAt = new Date().toISOString();
      const signatureHash = cryptoRandom();
      await supabase
        .from("board_signatories")
        .update({ signed_at: signedAt, signature_hash: signatureHash })
        .eq("resolution_id", request.resolutionId)
        .eq("id", request.signatoryId);
      return this.getResolution(request.resolutionId);
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


