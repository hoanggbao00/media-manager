'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';
import { authenticateUser, updateUserStatus } from '@/services/auth';
import { Input } from '../ui/input';
import { PasswordInput } from '../ui/password-input';
import { Button } from '../ui/button';
import { Loader2 } from 'lucide-react';

export function LoginForm() {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const router = useRouter();
	const { setUser, setIsAdmin, setStatus } = useAuthStore();

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();

		setLoading(true);
		try {
			const result = await authenticateUser(username, password);

			if (result) {
				const { user, isAdmin } = result;

				if (isAdmin) {
					setUser(user);
					setIsAdmin(true);
					router.push('/admin');
				} else {
					await updateUserStatus(user.id!, 'playing');
					setStatus('playing');
					setUser(user);
					setIsAdmin(false);
					router.push('/play');
				}
			} else {
				toast.error('Invalid credentials');
			}
		} catch (error) {
			toast.error('Login failed');
			console.error('Login error:', error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<form onSubmit={handleLogin} className='space-y-4'>
			<div>
				<label className='block text-sm font-medium text-gray-700'>
					Username
				</label>
				<Input
					type='text'
					value={username}
					onChange={(e) => setUsername(e.target.value)}
					className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
					required
				/>
			</div>
			<div>
				<label className='block text-sm font-medium text-gray-700'>
					Password
				</label>
				<PasswordInput
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
					required
				/>
			</div>
			<Button type='submit' className='w-full' disabled={loading}>
				{loading && <Loader2 className='size-4 '/>}
				Login
			</Button>
		</form>
	);
}
