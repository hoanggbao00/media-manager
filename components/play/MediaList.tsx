import { useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { UserMedia } from '@/types';
import { useAuthStore } from '@/store/authStore';
import MediaViewer from './MediaViewer';
import { Button } from '../ui/button';
import useSWR from 'swr';
import { Loader2 } from 'lucide-react';

export default function MediaList() {
	const { user, logOut, setStatus, status } = useAuthStore();

	const fetchAssignedMedia = async () => {
		if (!user) return;

		try {
			const mediaRef = collection(db, 'users');
			const q = query(mediaRef, where('username', '==', user.username));
			const querySnapshot = await getDocs(q);

			if (querySnapshot.empty) {
				return [];
			}

			if (status !== querySnapshot.docs[0].data().status)
				setStatus(querySnapshot.docs[0].data().status);

			const mediaData: UserMedia[] = (
				querySnapshot.docs[0].data().mediaPlaying as UserMedia[]
			).map((item) => ({
				type: item.type,
				url: item.url,
			}));

			return mediaData ?? [];
		} catch (error) {
			console.error('Error fetching media:', error);
			return [];
		}
	};

	const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
	const { data: media, isLoading } = useSWR<UserMedia[] | undefined>(
		'/play',
		() => fetchAssignedMedia(),
		{
			refreshInterval: 5000,
		}
	);

	const handleNext = () => {
		if (!media) return;
		setCurrentMediaIndex((prevIndex) =>
			prevIndex === media.length - 1 ? 0 : prevIndex + 1
		);
	};

	if (isLoading)
		return (
			<div className='flex flex-col items-center justify-center h-screen gap-2'>
				<Loader2 size={64} className='animate-spin text-primary' />
				Đang lấy dữ liệu, vui lòng đợi...
			</div>
		);

	if (status === 'disconnect') {
		return (
			<div className='flex flex-col items-center justify-center h-screen gap-2'>
				<p className='text-xl text-gray-500'>This session has been disconnected by an Admin</p>
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

	if (media?.length === 0) {
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

	return (
		media && (
			<MediaViewer media={media[currentMediaIndex]} handleNext={handleNext} />
		)
	);
}
