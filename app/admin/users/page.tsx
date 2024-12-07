'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFirebaseUsers } from '@/hooks/useFirebaseUsers';
import { userSchema } from '@/lib/schemas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';

import PasswordColumn from '@/components/admin/PasswordColumn';
import { Loader2, Pencil, Plus, Trash } from 'lucide-react';
import { z } from 'zod';
import { PasswordInput } from '@/components/ui/password-input';
import toast from 'react-hot-toast';

type UserFormData = z.infer<typeof userSchema>;

export default function UserManagement() {
	const { users, loading, error, addUser, updateUser, deleteUser } =
		useFirebaseUsers();
	const [isAddUserOpen, setIsAddUserOpen] = useState(false);
	const [editingUser, setEditingUser] = useState<Partial<UserFormData> | null>(
		null
	);
	const [deletingUser, setDeletingUser] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const form = useForm<UserFormData>({
		resolver: zodResolver(userSchema),
		defaultValues: {
			username: '',
			password: '',
		},
	});

	if (loading) return <div>Loading...</div>;
	if (error) return <div>Error: {error}</div>;

	const onSubmit = async (data: UserFormData) => {
		setIsSubmitting(true);
		try {
			if (editingUser) {
				await updateUser(editingUser.id!, data);
				setEditingUser(null);
			} else {
				await addUser({
					username: data.username,
					password: data.password,
				});
				setIsAddUserOpen(false);
				form.reset();
			}
		} catch (error) {
			console.error(error);
			toast.error('Failed to update user');
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleEdit = (user: Partial<UserFormData>) => {
		setEditingUser(user);
		form.reset(user);
	};

	const confirmDelete = () => {
		if (deletingUser) {
			deleteUser(deletingUser);
			setDeletingUser(null);
		}
	};

	return (
		<div className='space-y-4'>
			<h1 className='text-2xl font-bold'>User Management</h1>

			<Dialog
				open={isAddUserOpen || !!editingUser}
				onOpenChange={(open) => {
					setIsAddUserOpen(open);
					if (!open) setEditingUser(null);
				}}
			>
				<div className='flex justify-end'>
					<DialogTrigger asChild>
						<Button>
							<Plus className='size-4' />
							Add User
						</Button>
					</DialogTrigger>
				</div>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>
							{editingUser ? 'Edit User' : 'Add New User'}
						</DialogTitle>
					</DialogHeader>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
							<FormField
								control={form.control}
								name='username'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Username</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='password'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Password</FormLabel>
										<FormControl>
											<PasswordInput {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</form>
					</Form>
					<DialogFooter>
						<Button
							type='submit'
							onClick={form.handleSubmit(onSubmit)}
							disabled={isSubmitting}
						>
							{isSubmitting && (
								<Loader2 className='mr-2 h-4 w-4 animate-spin' />
							)}
							{editingUser ? 'Update User' : 'Add User'}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			<AlertDialog
				open={!!deletingUser}
				onOpenChange={(open) => !open && setDeletingUser(null)}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							Are you sure you want to delete this user?
						</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone. This will permanently delete the
							user account.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction onClick={confirmDelete}>
							Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className='w-[50px] text-center'>#</TableHead>
						<TableHead className='text-center'>Username</TableHead>
						<TableHead className='text-center'>Password</TableHead>
						<TableHead className='w-[100px] text-center'>Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{users.map((user, index) => (
						<TableRow key={user.id}>
							<TableCell className='text-center'>{index + 1}</TableCell>
							<TableCell className='text-center'>{user.username}</TableCell>
							<TableCell className='flex justify-center items-center'>
								<PasswordColumn text={user.password!} />
							</TableCell>
							<TableCell>
								<div className='flex space-x-2'>
									<Button
										variant='ghost'
										size='icon'
										onClick={() => handleEdit(user)}
									>
										<Pencil className='size -4' />
									</Button>
									<Button
										variant='ghost'
										size='icon'
										onClick={() => deleteUser(user.id!)}
									>
										<Trash className='size -4' />
									</Button>
								</div>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
