import { create } from 'zustand';
import { User, Admin } from '@/types';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface AuthState {
	user: (User | Admin) | null;
	status: 'playing' | 'disconnect';
	isAdmin: boolean;
	setUser: (user: User | Admin | null) => void;
	setIsAdmin: (isAdmin: boolean) => void;
	logOut: () => Promise<void>;
	setStatus: (status: 'playing' | 'disconnect') => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
	user: null,
	isAdmin: false,
	status: 'disconnect',
	setUser: (user) => set({ user }),
	setIsAdmin: (isAdmin) => set({ isAdmin }),
	setStatus: (status) => set({ status }),
	logOut: async () => {
		const userId = get().user?.id;
		if (!userId) return;
		if (!get().isAdmin) {
			await updateDoc(doc(db, 'users', userId), {
				status: 'disconnect',
			});
		}
		set({ user: null });
	},
}));
