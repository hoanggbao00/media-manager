'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { useFirebaseMedia } from '@/hooks/useFirebaseMedia';
import { cn, getYoutubeID } from '@/lib/utils';
import { User, UserMedia } from '@/types';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import YoutubeEmbed from '../light-box/YoutubeEmbed';

interface Props {
	user: User | null;
	onClose: () => void;
	onSubmit: (medias: UserMedia[]) => Promise<void>;
	setLightBox: (media: UserMedia) => void;
}

export default function AssignDialog(props: Props) {
	const { media: medias, loading: mediaLoading } = useFirebaseMedia();
	const [mediaSelected, setMediaSelected] = useState<UserMedia[]>([]);
	const [isSubmitting, setSubmitting] = useState(false);

	const handleSubmit = async () => {
		try {
			setSubmitting(true);
			await props.onSubmit(mediaSelected);
			props.onClose();
		} catch (error) {
			console.log(error);
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<DialogContent className='md:min-w-[70vw]'>
			<DialogHeader>
				<DialogTitle>
					Assign Media for {props.user?.username ?? 'All user'}
				</DialogTitle>
				<DialogDescription></DialogDescription>
			</DialogHeader>
			<div className='p-1'>
				<p>Selected: {mediaSelected?.length ?? 0}</p>
				<div className='max-h-[80vh] overflow-auto gap-2 grid md:grid-cols-2 lg:grid-cols-3'>
					{mediaLoading && <p>Loading...</p>}
					{!mediaLoading &&
						medias.map((media) => (
							<Card
								key={media.id}
								className={cn(
									'hover:cursor-pointer hover:border-green-400 hover:bg-green-300/20 transition-colors',
									{
										'border-green-400 bg-green-300/20': mediaSelected.some(
											(item) => item.url === media.url
										),
									}
								)}
								onClick={() => {
									if (media.type === 'youtube') {
										if (mediaSelected[0]?.type === 'youtube') {
											return setMediaSelected([]);
										} else {
											return setMediaSelected([media]);
										}
									}

									const newMedia = mediaSelected.filter(
										(item) => item.type !== 'youtube'
									);

									setMediaSelected(
										newMedia.some((item) => item.url === media.url)
											? newMedia.filter(
													(item) =>
														item.url !== media.url && item.type !== 'youtube'
											  )
											: [...newMedia, media]
									);
								}}
							>
								<CardContent className='p-4 w-full '>
									<div className='w-full aspect-video relative overflow-hidden'>
										{media.type === 'image' ? (
											<img
												key={`dialog-${media.id}`}
												src={media.url}
												alt={media.name}
												className='w-full h-full object-cover mb-2 rounded-md'
												onClick={() => props.setLightBox(media)}
											/>
										) : media.type === 'video' ? (
											<video
												key={`dialog-${media.id}`}
												src={media.url}
												className='absolute inset-0 object-cover mb-2'
												onClick={() => props.setLightBox(media)}
											/>
										) : (
											getYoutubeID(media.url) && (
												<YoutubeEmbed
													url={getYoutubeID(media.url)!}
													className='absolute inset-0 object-cover mb-2'
													key={`dialog-${media.id}`}
													autoPlay={false}
													onClick={() => props.setLightBox(media)}
												/>
											)
										)}
									</div>
									<h3 className='font-semibold w-full line-clamp-2'>
										{media.name}
									</h3>
								</CardContent>
							</Card>
						))}
				</div>
			</div>
			<DialogFooter>
				<Button
					variant={'outline'}
					onClick={() => {
						props.onClose();
						setMediaSelected([]);
					}}
				>
					Close
				</Button>
				<Button onClick={handleSubmit} disabled={isSubmitting}>
					{isSubmitting && <Loader2 className='mr-2 size-4 animate-spin' />}
					Update
				</Button>
			</DialogFooter>
		</DialogContent>
	);
}
