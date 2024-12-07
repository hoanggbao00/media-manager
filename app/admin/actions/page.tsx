'use client';

import CardCarousel from '@/components/admin/actions/CardCarousel';
import LightBoxImage from '@/components/admin/light-box/LightBox';
import LightBoxListImage from '@/components/admin/light-box/LightBoxListImage';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { useFirebaseMedia } from '@/hooks/useFirebaseMedia';
import { useFirebaseUsers } from '@/hooks/useFirebaseUsers';
import { cn } from '@/lib/utils';
import { User, UserMedia } from '@/types';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

export default function Page() {
	const { users, loading, error, updateUser } = useFirebaseUsers();
	const { media: medias, loading: mediaLoading } = useFirebaseMedia();
	const [userSelected, setUserSelected] = useState<User | null>(null);
	const [mediaSelected, setMediaSelected] = useState<UserMedia[]>([]);
	const [lightBox, setLightBox] = useState<UserMedia>();
	const [isSubmitting, setSubmitting] = useState(false);
	const [listLightBoxOpen, setListLightBoxOpen] = useState<UserMedia[]>([]);

	if (loading) return <div>Loading...</div>;
	if (error) return <div>Error: {error}</div>;

	const handleDeactivate = async (userId: string) => {
		await updateUser(userId, { status: 'disconnect', mediaPlaying: [] });
	};

	const handleSubmit = async () => {
		if (!userSelected) return;
		setSubmitting(true);
		try {
			await updateUser(userSelected.id!, {
				mediaPlaying: mediaSelected.map((media) => ({
					type: media.type,
					url: media.url,
				})),
				status: mediaSelected.length > 0 ? 'playing' : 'disconnect',
			});
			setUserSelected(null);
			setMediaSelected([]);
		} catch (error) {
			console.log(error);
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<div className='space-y-4'>
			<h1 className='text-2xl font-bold'>Media Management</h1>
			<Dialog
				open={!!userSelected && !lightBox}
				onOpenChange={(open) => {
					if (!open) {
						setUserSelected(null);
						setMediaSelected([]);
					}
				}}
			>
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
					{users.map((user) => (
						<Card key={user.id}>
							<CardContent className='p-4 space-y-2'>
								<div
									className='w-full aspect-video'
									onClick={() => {
										if (user.mediaPlaying) {
											if (user.mediaPlaying.length > 0) {
												setListLightBoxOpen(user.mediaPlaying);
											}
										}
									}}
								>
									{user.mediaPlaying && (
										<CardCarousel urls={user.mediaPlaying ?? []} />
									)}
									{!user.mediaPlaying && (
										<div className='w-full aspect-video grid place-items-center'>
											<img
												src='/images/no-image.png'
												alt='No Image'
												className='w-full aspect-video object-cover object-center'
											/>
										</div>
									)}
								</div>
								<h3 className='font-semibold'>{user.username}</h3>
								<Badge
									className={cn({
										'bg-green-300 text-green-800 hover:bg-green-300': user.status === 'playing',
										'bg-red-300 text-red-800 hover:bg-red-300': user.status !== 'playing',
									})}
								>
									{user.status === 'playing' ? 'Online' : 'Offline'}
								</Badge>
							</CardContent>
							<CardFooter className='px-4 flex justify-end gap-2'>
								{user.status === 'playing' && (
									<Button
										variant='outline'
										className='hover:bg-destructive hover:text-destructive-foreground'
										onClick={() => handleDeactivate(user.id!)}
									>
										Deactivate
									</Button>
								)}
								<DialogTrigger asChild>
									<Button
										onClick={() => {
											setUserSelected(user);
											setMediaSelected(user.mediaPlaying ?? []);
										}}
									>
										Assign
									</Button>
								</DialogTrigger>
							</CardFooter>
						</Card>
					))}
				</div>
				<DialogContent className='md:min-w-[70vw]'>
					<DialogHeader>
						<DialogTitle>Assign Media for {userSelected?.username}</DialogTitle>
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
										onClick={() =>
											setMediaSelected((prev) =>
												prev.some((item) => item.url === media.url)
													? prev.filter((item) => item.url !== media.url)
													: [...prev, media]
											)
										}
									>
										<CardContent className='p-4 w-full '>
											<div className='w-full aspect-video relative overflow-hidden'>
												{media.type === 'image' ? (
													<img
														src={media.url}
														alt={media.name}
														className='w-full h-full object-cover mb-2 rounded-md'
														onClick={() => setLightBox(media)}
													/>
												) : (
													<video
														src={media.url}
														className='absolute inset-0 object-cover mb-2'
														onClick={() => setLightBox(media)}
													/>
												)}
											</div>
											<h3 className='font-semibold'>{media.name}</h3>
										</CardContent>
									</Card>
								))}
						</div>
					</div>
					<DialogFooter>
						<Button
							variant={'outline'}
							onClick={() => {
								setUserSelected(null);
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
			</Dialog>
			{lightBox && (
				<LightBoxImage {...lightBox} onClose={() => setLightBox(undefined)} />
			)}
			{listLightBoxOpen.length > 0 && (
				<LightBoxListImage
					medias={listLightBoxOpen}
					onClose={() => setListLightBoxOpen([])}
				/>
			)}
		</div>
	);
}
