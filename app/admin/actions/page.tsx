'use client';

import AssignDialog from '@/components/admin/actions/AssignDialog';
import CardCarousel from '@/components/admin/actions/CardCarousel';
import LightBoxImage from '@/components/admin/light-box/LightBox';
import LightBoxListImage from '@/components/admin/light-box/LightBoxListImage';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { useFirebaseUsers } from '@/hooks/useFirebaseUsers';
import { cn } from '@/lib/utils';
import { User, UserMedia } from '@/types';
import { useState } from 'react';
import toast from 'react-hot-toast';
import useSWR from 'swr';

export default function Page() {
	const { error, updateUser, mutateUSer } = useFirebaseUsers();
	const [userSelected, setUserSelected] = useState<User | null>(null);
	const [lightBox, setLightBox] = useState<UserMedia>();
	const [listLightBoxOpen, setListLightBoxOpen] = useState<UserMedia[]>([]);
	const [isSelectAll, setIsSelectAll] = useState(false);

	const { data: users, isLoading } = useSWR<User[]>(
		'users',
		() => mutateUSer(),
		{
			refreshInterval: 5000,
		}
	);

	if (isLoading) return <div>Loading...</div>;
	if (error) return <div>Error: {error}</div>;
	if (!users) return <div>Loading...</div>;

	const handleUpdateStatus = async (userId: string, status: User['status']) => {
		await updateUser(userId, { status });
		toast.success('User status successfully!');
	};

	const handleCloseModal = () => {
		setUserSelected(null);
		setIsSelectAll(false);
	};

	const handleSubmit = async (mediaSelected: UserMedia[]) => {
		try {
			if (userSelected) {
				await updateUser(userSelected.id!, {
					mediaPlaying: mediaSelected,
				});
			} else {
				if (isSelectAll) {
					await Promise.all(
						users.map(async (user) => {
							await updateUser(user.id!, {
								mediaPlaying: mediaSelected,
							});
						})
					);
				}
			}
			await mutateUSer();
			toast.success('Media assigned successfully!');
			handleCloseModal();
		} catch (error) {
			console.log(error);
			toast.error('Failed to update user');
		}
	};

	return (
		<div className='space-y-4'>
			<h1 className='text-2xl font-bold'>Actions</h1>
			<Dialog
				open={(!!userSelected && !lightBox) || (!!isSelectAll && !lightBox)}
				onOpenChange={(open) => {
					if (!open) handleCloseModal();
				}}
			>
				<div>
					<Button
						onClick={() => {
							setIsSelectAll(true);
						}}
					>
						Assign for all user
					</Button>
				</div>
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
										<CardCarousel
											key={user.id}
											urls={user.mediaPlaying ?? []}
										/>
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
										'bg-green-300 text-green-800 hover:bg-green-300':
											user.status === 'playing',
										'bg-red-300 text-red-800 hover:bg-red-300':
											user.status !== 'playing',
									})}
								>
									{user.status === 'playing' ? 'Online' : 'Offline'}
								</Badge>
							</CardContent>
							<CardFooter className='px-4 flex justify-end gap-2'>
								{user.status === 'playing' ? (
									<Button
										variant='outline'
										className='hover:bg-destructive hover:text-destructive-foreground'
										onClick={() => handleUpdateStatus(user.id!, 'disconnect')}
									>
										Deactivate
									</Button>
								) : (
									<Button
										variant='outline'
										className='hover:bg-primary/20 hover:text-primary-foreground'
										onClick={() => handleUpdateStatus(user.id!, 'playing')}
									>
										Active
									</Button>
								)}
								<DialogTrigger asChild>
									<Button
										onClick={() => {
											setUserSelected(user);
										}}
									>
										Assign
									</Button>
								</DialogTrigger>
							</CardFooter>
						</Card>
					))}
				</div>
				{(userSelected || isSelectAll) && (
					<AssignDialog
						onClose={handleCloseModal}
						onSubmit={handleSubmit}
						user={userSelected}
						setLightBox={setLightBox}
					/>
				)}
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
