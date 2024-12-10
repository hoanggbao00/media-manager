'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useFirebaseMedia } from '@/hooks/useFirebaseMedia';
import { useFirebaseUsers } from '@/hooks/useFirebaseUsers';
import { Loader2 } from 'lucide-react';

export default function Page() {
	const { media, loading: mediaLoading } = useFirebaseMedia();
	const { users, loading: userLoading } = useFirebaseUsers();

	return (
		<div className='space-y-4'>
			<h1 className='text-2xl font-bold'>Admin Dashboard</h1>
			<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
				<Card>
					<CardHeader>
						<CardTitle>Total Users</CardTitle>
					</CardHeader>
					<CardContent>
						{userLoading && <Loader2 className='animate-spin' />}
						{!userLoading && (
							<p className='text-2xl font-semibold'>{users?.length || 0}</p>
						)}
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>Total Media</CardTitle>
					</CardHeader>
					<CardContent>
						{mediaLoading && <Loader2 className='animate-spin' />}
						{!mediaLoading && (
							<p className='text-2xl font-semibold'>{media?.length || 0}</p>
						)}
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>Active Sessions</CardTitle>
					</CardHeader>
					<CardContent>
						{userLoading && <Loader2 className='animate-spin' />}
						{!userLoading && users && (
							<p className='text-2xl font-semibold'>
								{users.filter((user) => user.status === 'playing').length}
							</p>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
