import { useState, useEffect } from 'react';
import {
	collection,
	addDoc,
	updateDoc,
	deleteDoc,
	doc,
	getDocs,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { User } from '@/types';

export function useFirebaseUsers() {
	const [users, setUsers] = useState<User[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchUsers = async () => {
		try {
			const usersCollection = collection(db, 'users');
			const usersSnapshot = await getDocs(usersCollection);
			const usersList = usersSnapshot.docs.map(
				(doc) => ({ id: doc.id, ...doc.data() } as User)
			);
			setUsers(usersList);
			setLoading(false);
		} catch (err) {
			console.log(err);
			setError('Failed to fetch users');
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchUsers();
	}, []);

	const addUser = async (user: { username: string; password: string }) => {
		try {
			const docRef = await addDoc(collection(db, 'users'), user);
			setUsers([
				...users,
				{ ...user, status: 'disconnect', mediaPlaying: [], id: docRef.id },
			]);
		} catch (err) {
			console.log(err);

			setError('Failed to add user');
		}
	};

	const updateUser = async (id: string, data: Partial<User>) => {
		try {
			await updateDoc(doc(db, 'users', id), data);
			setUsers(
				users.map((user) => (user.id === id ? { ...user, ...data } : user))
			);
		} catch (err) {
			console.log(err);
			setError('Failed to update user');
		}
	};

	const deleteUser = async (id: string) => {
		try {
			await deleteDoc(doc(db, 'users', id));
			setUsers(users.filter((user) => user.id !== id));
		} catch (err) {
			console.log(err);
			setError('Failed to delete user');
		}
	};

	return { users, loading, error, addUser, updateUser, deleteUser };
}
