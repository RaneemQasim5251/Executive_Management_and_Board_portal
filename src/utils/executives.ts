export type ExecutiveRecord = {
	FullName: string; // English/full
	FullArabicName: string; // Arabic display name
	Title?: string;
	Email?: string;
	Phone?: string;
};

const normalizePhone = (input?: string): string => {
	if (!input) return "";
	const digits = input.replace(/[^0-9]/g, "");
	// Normalize KSA numbers: ensure country code 966 present
	if (digits.startsWith("966")) return digits;
	if (digits.startsWith("05")) return `966${digits.slice(1)}`;
	if (digits.startsWith("5")) return `966${digits}`;
	return digits;
};

export const EXECUTIVES: ExecutiveRecord[] = [
	{ FullName: "Hezam Z. Al-Qahtani", FullArabicName: "حزام القحطاني", Title: undefined, Email: "Hezam@aljeri.com", Phone: "+966 50 569 7669" },
	{ FullName: "Khalid Hezam Al-Qahtani", FullArabicName: "خالد القحطاني", Title: undefined, Email: "kqahtani@aljeri.com", Phone: "+966 55 555 5064" },
	{ FullName: "Nader Al-Nasser", FullArabicName: "نادر الناصر", Title: undefined, Email: "nalnasser@aljeri.com", Phone: "+966 50 000 3522" },
	{ FullName: "Saadi Alami", FullArabicName: "صعدي علامي", Title: undefined, Email: "Saadi.Alami@aljeri.com", Phone: "+966 50 421 9934" },
	{ FullName: "Ali Al-Najjar", FullArabicName: "علي النجار", Title: undefined, Email: "anajjar@aljeri.com" },
];

export const findExecutiveByEmailOrPhone = (identifier: string): ExecutiveRecord | undefined => {
	if (!identifier) return undefined;
	const id = identifier.trim().toLowerCase();
	const normalized = normalizePhone(identifier);
	return EXECUTIVES.find((e) => {
		const emailMatch = e.Email?.toLowerCase() === id;
		const phoneMatch = normalizePhone(e.Phone) === normalized && normalized.length > 0;
		return emailMatch || phoneMatch;
	});
};

export const getPoliteTitle = (title?: string): string => {
	return title && title.trim().length > 0 ? title : "الأستاذ";
};


