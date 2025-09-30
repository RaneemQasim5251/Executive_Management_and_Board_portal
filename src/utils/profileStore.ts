export type UserProfile = {
	email: string;
	name: string;
	avatarUrl?: string;
};

const STORAGE_KEY = 'profile-store-v1';

const loadStore = (): Record<string, UserProfile> => {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		return raw ? JSON.parse(raw) : {};
	} catch {
		return {};
	}
};

const saveStore = (store: Record<string, UserProfile>) => {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
};

export const getProfileByEmail = (email?: string): UserProfile | undefined => {
	if (!email) return undefined;
	const store = loadStore();
	return store[email.toLowerCase()];
};

export const upsertProfile = (profile: UserProfile) => {
	const store = loadStore();
	store[profile.email.toLowerCase()] = profile;
	saveStore(store);
};


