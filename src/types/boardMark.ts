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
  nationalIdLast3?: string; // optional until provided securely
  signedAt?: string; // ISO timestamp
  signatureHash?: string; // proof of signature
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
}

export interface SignRequest {
  resolutionId: string;
  signatoryId: string;
  otp?: string;
}


