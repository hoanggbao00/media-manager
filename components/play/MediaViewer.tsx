'use client';
import { useAuthStore } from '@/store/authStore';
import { useMouseIdle } from '@/hooks/useMouseIdle';
import { UserMedia } from '@/types';
import { useEffect } from 'react';
import { Button } from '../ui/button';
import YoutubeEmbed from '../admin/light-box/YoutubeEmbed';
import { getYoutubeID } from '@/lib/utils';

// see https://stackoverflow.com/questions/3354239/hiding-the-mouse-cursor-when-idle-using-javascript
// if want to hide cursor when idle

export default function MediaViewer({
	media,
	handleNext,
}: {
	media: UserMedia;
	handleNext: () => void;
}) {
	const { logOut } = useAuthStore();
	const isIdle = useMouseIdle(2000); // 2 seconds before controls hide

	useEffect(() => {
		let timeOut;
		if (media.type === 'video' || media.type === 'youtube') return clearTimeout(timeOut);

		timeOut = setTimeout(() => {
			handleNext();
		}, 5000);

		return () => clearTimeout(timeOut);
	}, [media]);

	return (
		<div className='fixed inset-0 bg-black'>
			<div
				className={`absolute top-0 right-0 z-[99] p-4 transition-opacity duration-300 ${
					isIdle ? 'opacity-0' : 'opacity-100'
				}`}
			>
				<Button onClick={logOut} variant='destructive'>
					Logout
				</Button>
			</div>

			{media.type === 'image' ? (
				<>
					<img
						src={media.url}
						alt={media.url}
						className='w-full h-full object-cover'
					/>
				</>
			) : media.type === 'video' ? (
				<video
					src={media.url}
					className='w-full h-full object-cover'
					autoPlay
					controls={process.env.NODE_ENV === 'development'}
					onEnded={handleNext}
				/>
			) : (
				getYoutubeID(media.url) && (
					<YoutubeEmbed
						url={getYoutubeID(media.url)!}
						autoPlay
						className='w-full h-full object-cover'
					/>
				)
			)}
		</div>
	);
}
