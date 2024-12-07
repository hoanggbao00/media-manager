import {
	collection,
	query,
	where,
	getDocs,
	doc,
	updateDoc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { User, Admin } from '@/types';

export async function authenticateUser(
	username: string,
	password: string
): Promise<{
	user: User | Admin;
	isAdmin: boolean;
} | null> {
	// Check admin collection
	const adminQuery = query(
		collection(db, 'admins'),
		where('username', '==', username),
		where('password', '==', password)
	);
	const adminSnapshot = await getDocs(adminQuery);

	if (!adminSnapshot.empty) {
		const adminDoc = adminSnapshot.docs[0];
		return {
			user: { id: adminDoc.id, ...adminDoc.data() } as Admin,
			isAdmin: true,
		};
	}

	// Check users collection
	const userQuery = query(
		collection(db, 'users'),
		where('username', '==', username),
		where('password', '==', password)
	);
	const userSnapshot = await getDocs(userQuery);

	if (!userSnapshot.empty) {
		const userDoc = userSnapshot.docs[0];
		return {
			user: { id: userDoc.id, ...userDoc.data() } as User,
			isAdmin: false,
		};
	}

	return null;
}

export async function updateUserStatus(userId: string, status: User['status']) {
	await updateDoc(doc(db, 'users', userId), {
		status,
	});
}
