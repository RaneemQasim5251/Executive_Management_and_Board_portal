export type ResolutionStatus =
  | "draft"
  | "awaiting_signatures"
  | "finalized"
  | "expired";

export interface Signatory {
  id: string;
  name: string;
  email: string;
  jobTitle: string;
  nationalIdLast3?: string; // option al until provided securely
  signedAt?: string; // ISO timestamp
  signatureHash?: string; // proof of signature
  // Optional visual signature representation
  signatureImageUrl?: string; // remote URL to a signature image (PNG/JPG/SVG)
  signatureImageDataUrl?: string; // preloaded data URL (base64) for reliable embedding
}

export interface BoardResolution {
  id: string;
  createdAt: string;
  updatedAt: string;
  meetingDate: string; // ISO date
  agreementDetails: string; // secretary input
  status: ResolutionStatus;
  deadlineAt: string; // ISO date
  dabajaTextAr: string; // static intro (Arabic)
  dabajaTextEn: string; // static intro (English)
  preambleAr: string;   // static preamble (Arabic)
  preambleEn: string;   // static preamble (English)
  signatories: Signatory[];
  finalizedPdfUrl?: string;
  barcodeData?: string; // encoded payload
}

export interface CreateResolutionInput {
  meetingDate: string;
  agreementDetails: string;
  deadlineDays?: number;
  // Optional placeholder inputs from secretary
  meetingLocation?: string; // [المكان/المدينة]
  presidentName?: string;   // [اسم الرئيس]
  attendees?: string;       // [الأسماء]
  absentees?: string;       // [الأسماء إن وُجدت]
  // Optional overrides for auto fields
  sessionNumberOverride?: string; // [رقم الجلسة]
  fiscalYearOverride?: string;    // [السنة المالية]
  gregOverride?: string;          // [التاريخ الميلادي]
  hijriOverride?: string;         // [التاريخ الهجري]
  timeOverride?: string;          // [الوقت]
  // Previous session context
  previousSessionNumber?: string; // [رقم الجلسة السابقة]
  previousSessionDate?: string;   // [تاريخه]
  // Agenda and responsibilities
  agendaItems?: string;           // secretary-written agenda items (optional)
  committee?: string;             // [الإدارة/اللجنة]
  tasksResponsibilities?: string; // replaces long placeholder text for tasks
}

export interface SignRequest {
  resolutionId: string;
  signatoryId: string;
  otp?: string;
}


