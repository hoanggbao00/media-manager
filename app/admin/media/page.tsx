'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFirebaseMedia } from '@/hooks/useFirebaseMedia';
import { mediaSchema } from '@/lib/schemas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
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
import { z } from 'zod';
import { Loader2, Pencil, Plus, Trash } from 'lucide-react';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { UserMedia } from '@/types';
import LightBoxImage from '@/components/admin/light-box/LightBox';
import { getYoutubeID } from '@/lib/utils';
import YoutubeEmbed from '@/components/admin/light-box/YoutubeEmbed';
import { Uploader, UploadResult } from '@/components/ui/Uploader';
import toast from 'react-hot-toast';
import { CloudinaryUploadWidgetResults } from 'next-cloudinary';
import MediaTag from '@/components/admin/media/media-tag';

type MediaFormData = z.infer<typeof mediaSchema>;

export default function MediaManagement() {
	const { media, loading, error, addMedia, updateMedia, deleteMedia } =
		useFirebaseMedia();
	const [editingMedia, setEditingMedia] = useState<MediaFormData | null>(null);
	const [isAdding, setIsAdding] = useState(false);
	const [deletingMedia, setDeletingMedia] = useState<string | null>(null);
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [lightBox, setLightBox] = useState<UserMedia>();

	const form = useForm<MediaFormData>({
		resolver: zodResolver(mediaSchema),
		defaultValues: {
			name: '',
			url: '',
			type: 'image',
		},
	});

	if (loading) return <div>Loading...</div>;
	if (error) return <div>Error: {error}</div>;

	const handleUpload = async (
		result: CloudinaryUploadWidgetResults,
		wget: any
	) => {
		if (!result.info) return;
		const info = result.info as unknown as UploadResult;

		const data: MediaFormData = {
			name: info.display_name,
			type: info.resource_type as 'image' | 'video',
			url: info.secure_url,
		};

		try {
			await addMedia(data);
			toast.success('Media uploaded successfully');
			wget.close();
		} catch (error) {
			console.log(error);
			toast.error('Failed to upload media');
		}
	};

	const onSubmit = async (data: MediaFormData) => {
		setIsSubmitting(true);
		try {
			if (editingMedia) {
				await updateMedia(editingMedia.id!, { ...data });
				setEditingMedia(null);
			} else {
				await addMedia({ ...data });
				setIsAdding(false);
			}
			form.reset();
			setPreviewUrl(null);
		} catch (error) {
			console.log(error);
			toast.error(`Failed to ${editingMedia ? 'update' : 'add'} media`);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleEdit = (item: MediaFormData) => {
		setEditingMedia(item);
		form.reset(item);
		setPreviewUrl(item.url);
	};

	const handleDelete = (mediaId: string) => {
		setDeletingMedia(mediaId);
	};

	const confirmDelete = async () => {
		if (deletingMedia) {
			try {
				await deleteMedia(deletingMedia);
				toast.success('Media deleted successfully');
				setDeletingMedia(null);
			} catch (error) {
				console.log(error);
				toast.error('Failed to delete media');
			}
		}
	};

	return (
		<div className='space-y-4'>
			<h1 className='text-2xl font-bold'>Media Management</h1>

			<Dialog
				open={isAdding || !!editingMedia}
				onOpenChange={(open) => {
					if (!open) {
						setEditingMedia(null);
						setIsAdding(false);
					}
				}}
			>
				<div className='flex justify-end'>
					<DialogTrigger asChild>
						<Button
							onClick={() => {
								setIsAdding(true);
							}}
						>
							<Plus /> Add
						</Button>
					</DialogTrigger>
				</div>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>
							{editingMedia ? 'Edit Media' : 'Add New Media'}
						</DialogTitle>
						<DialogDescription></DialogDescription>
					</DialogHeader>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className='space-y-4 max-h-[80vh] overflow-auto px-0.5'
						>
							<FormField
								control={form.control}
								name='name'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Name</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name='type'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Type</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder='Select type' />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value='image'>Image</SelectItem>
												<SelectItem value='video'>Video</SelectItem>
												<SelectItem value='youtube'>Youtube</SelectItem>
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='url'
								render={({ field }) => (
									<FormItem>
										<FormLabel>URL</FormLabel>
										<FormControl>
											<Input
												{...field}
												onChange={(e) => {
													field.onChange(e.target.value);
													if (!e.target.value) return setPreviewUrl(null);

													if (form.getValues().type === 'youtube') {
														const url = getYoutubeID(e.target.value);
														if (url) {
															setPreviewUrl(url);
														} else {
															setPreviewUrl(e.target.value);
														}
													} else {
														setPreviewUrl(e.target.value);
													}
												}}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<Label>Preview</Label>
							{previewUrl && (
								<div className='mt-4'>
									{form.getValues('type') === 'image' ? (
										<img
											src={previewUrl}
											alt='Preview'
											className='max-w-full h-auto'
										/>
									) : form.getValues('type') === 'video' ? (
										<video
											src={previewUrl}
											controls
											className='max-w-full h-auto'
										/>
									) : (
										getYoutubeID(form.getValues('url')) && (
											<YoutubeEmbed
												autoPlay={false}
												url={getYoutubeID(form.getValues('url'))!}
											/>
										)
									)}
								</div>
							)}
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
							{editingMedia ? 'Update Media' : 'Add Media'}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			<AlertDialog
				open={!!deletingMedia}
				onOpenChange={(open) => !open && setDeletingMedia(null)}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							Are you sure you want to delete this media?
						</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone. This will permanently delete the
							media item.
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

			{/* Table */}
			<div>
				<Uploader onUpload={handleUpload} />
			</div>

			<Tabs defaultValue='detailList'>
				<TabsList>
					<TabsTrigger value='detailList'>Detail List</TabsTrigger>
					<TabsTrigger value='cardList'>Card List</TabsTrigger>
				</TabsList>
				<TabsContent value='detailList'>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className='text-center w-[50px]'>#</TableHead>
								<TableHead className='text-center'>Preview</TableHead>
								<TableHead className='text-center'>Name</TableHead>
								<TableHead className='text-center'>Type</TableHead>
								<TableHead className='text-center'>URL</TableHead>
								<TableHead className='text-end'>Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{media.map((item, index) => (
								<TableRow key={item.id}>
									<TableCell className='text-center'>{index + 1}</TableCell>
									<TableCell
										onClick={() => {
											setLightBox({
												type: item.type,
												url: item.url,
											});
										}}
										className='hover:cursor-pointer'
									>
										{item.type === 'image' ? (
											<img
												src={item.url}
												alt={item.name}
												className=' size-20 object-cover'
											/>
										) : item.type === 'video' ? (
											<video
												src={item.url}
												className='w-20 h-20 object-cover'
											/>
										) : (
											getYoutubeID(item.url) && (
												<YoutubeEmbed
													autoPlay={false}
													url={getYoutubeID(item.url)!}
													className='w-20 h-20 object-cover'
													onClick={() => {}}
												/>
											)
										)}
									</TableCell>
									<TableCell className='text-ellipsis'>{item.name}</TableCell>
									<TableCell className='text-center'><MediaTag tag={item.type} /></TableCell>
									<TableCell>
										<a
											href={item.url}
											target='_blank'
											rel='noreferrer'
											className='hover:underline text-sky-500 line-clamp-1'
										>
											{item.url}
										</a>
									</TableCell>
									<TableCell>
										<div className='flex space-x-1'>
											<Button
												variant='ghost'
												size='icon'
												onClick={() => handleEdit(item)}
											>
												<Pencil className='w-4 h-4' />
											</Button>
											<Button
												variant='ghost'
												size='icon'
												onClick={() => handleDelete(item.id)}
											>
												<Trash className='w-4 h-4' />
											</Button>
										</div>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TabsContent>
				<TabsContent value='cardList'>
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
						{media.map((item) => (
							<Card key={item.id}>
								<CardContent className='p-4'>
									{item.type === 'image' ? (
										<img
											src={item.url}
											alt={item.name}
											className='w-full h-48 object-cover mb-2'
										/>
									) : item.type === 'video' ? (
										<video
											src={item.url}
											className='w-full h-48 object-cover mb-2'
											controls
										/>
									) : (
										getYoutubeID(form.getValues('url')) && (
											<YoutubeEmbed
												className='w-full h-48 object-cover mb-2'
												autoPlay={false}
												url={getYoutubeID(form.getValues('url'))!}
											/>
										)
									)}
									<h3 className='font-semibold line-clamp-2'>{item.name}</h3>
									<p className='text-sm text-gray-500'>{item.type}</p>
									<div className='mt-2 flex justify-between'>
										<Button variant='outline' onClick={() => handleEdit(item)}>
											Edit
										</Button>
										<Button
											variant='destructive'
											onClick={() => handleDelete(item.id)}
										>
											Delete
										</Button>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				</TabsContent>
			</Tabs>
			{lightBox && (
				<LightBoxImage {...lightBox} onClose={() => setLightBox(undefined)} />
			)}
		</div>
	);
}
