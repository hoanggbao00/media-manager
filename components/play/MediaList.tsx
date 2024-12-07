import { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { UserMedia } from '@/types';
import { useAuthStore } from '@/store/authStore';
import MediaViewer from './MediaViewer';
import { Button } from '../ui/button';

export default function MediaList() {
	const [media, setMedia] = useState<UserMedia[]>([]);
	const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
	const { user, logOut } = useAuthStore();

	useEffect(() => {
		if (user) {
			fetchAssignedMedia();
		}
	}, [user]);

	const fetchAssignedMedia = async () => {
		if (!user) return;

		try {
			const mediaRef = collection(db, 'users');
			const q = query(mediaRef, where('username', '==', user.username));
			const querySnapshot = await getDocs(q);

			const mediaData: UserMedia[] = (
				querySnapshot.docs[0].data().mediaPlaying as UserMedia[]
			).map((item) => ({
				type: item.type,
				url: item.url,
			}));

			setMedia(mediaData ?? []);
		} catch (error) {
			console.error('Error fetching media:', error);
		}
	};

	// useEffect(() => {
	// 	if (media.length === 0) {
	// 		return;
	// 	}
	// 	const mediaLength = media.length;

	// 	const interval = setInterval(() => {
	// 		setCurrentMediaIndex((prevIndex) =>
	// 			prevIndex === mediaLength - 1 ? 0 : prevIndex + 1
	// 		);
	// 	}, 5000);

	// 	return () => clearInterval(interval);
	// }, [media]);

	const handleNext = () => {
		setCurrentMediaIndex((prevIndex) =>
			prevIndex === media.length - 1 ? 0 : prevIndex + 1
		);
	};

	if (media.length === 0) {
		return (
			<div className='flex flex-col items-center justify-center h-screen gap-2'>
				<p className='text-xl text-gray-500'>No media assigned to you</p>
				<Button
					variant='outline'
					className='text-destructive hover:bg-destructive/20'
					onClick={() => logOut()}
				>
					Logout
				</Button>
			</div>
		);
	}

	return <MediaViewer media={media[currentMediaIndex]} handleNext={handleNext}/>;
}
