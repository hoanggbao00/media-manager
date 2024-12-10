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

interface Media {
	id: string;
	url: string;
	name: string;
	type: 'image' | 'video' | 'youtube';
}

export function useFirebaseMedia() {
	const [media, setMedia] = useState<Media[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchMedia = async () => {
		try {
			const mediaCollection = collection(db, 'media');
			const mediaSnapshot = await getDocs(mediaCollection);
			const mediaList = mediaSnapshot.docs.map(
				(doc) => ({ id: doc.id, ...doc.data() } as Media)
			);
			setMedia(mediaList);
			setLoading(false);
		} catch (err) {
			console.log(err);
			setError('Failed to fetch media');
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchMedia();
	}, []);

	const addMedia = async (newMedia: Omit<Media, 'id'>) => {
		try {
			const docRef = await addDoc(collection(db, 'media'), newMedia);
			setMedia(prev => [...prev, { ...newMedia, id: docRef.id }]);
		} catch (err) {
			console.log(err);
			setError('Failed to add media');
		}
	};

	const updateMedia = async (id: string, data: Partial<Media>) => {
		try {
			await updateDoc(doc(db, 'media', id), data);
			setMedia((prev) =>
				prev.map((item) => (item.id === id ? { ...item, ...data } : item))
			);
		} catch (err) {
			console.log(err);

			setError('Failed to update media');
		}
	};

	const deleteMedia = async (id: string) => {
		try {
			await deleteDoc(doc(db, 'media', id));
			setMedia((prev) => prev.filter((item) => item.id !== id));
		} catch (err) {
			console.log(err);
			setError('Failed to delete media');
		}
	};

	return { media, loading, error, addMedia, updateMedia, deleteMedia };
}
