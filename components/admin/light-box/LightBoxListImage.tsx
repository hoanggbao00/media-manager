import { Button } from '@/components/ui/button';
import { UserMedia } from '@/types';
import { X } from 'lucide-react';
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { getYoutubeID } from '@/lib/utils';
import YoutubeEmbed from './YoutubeEmbed';
interface Props {
	medias: UserMedia[];
	onClose: () => void;
}

export default function LightBoxListImage({ medias, onClose }: Props) {
	return (
		<div className='fixed inset-0 z-[9999] flex items-center justify-center !mt-0'>
			<div className='bg-gray-400/50 absolute inset-0' onClick={onClose} />
			<Button
				variant='ghost'
				onClick={onClose}
				className='absolute z-10 top-4 right-4 text-white hover:text-gray-400'
			>
				<X size={48} />
			</Button>
			<div className='absolute z-10 w-full aspect-video md:w-2/3 bg-white rounded-md'>
				<Carousel plugins={[Autoplay()]} className='w-full aspect-video'>
					<CarouselContent className='size-full ml-0'>
						{medias.map((url) => (
							<CarouselItem
								key={url.url}
								className='size-full aspect-video pl-0'
							>
								{url.type === 'image' ? (
									<img
										src={url.url}
										alt={url.url}
										className='rounded-md size-full object-cover'
									/>
								) : url.type === 'video' ? (
									<video
										src={url.url}
										className='rounded-md size-full object-cover'
									/>
								) : (
									getYoutubeID(url.url) && (
										<YoutubeEmbed
											url={getYoutubeID(url.url)!}
											className='rounded-md size-full object-cover'
										/>
									)
								)}
							</CarouselItem>
						))}
					</CarouselContent>
					<CarouselPrevious />
					<CarouselNext />
				</Carousel>
			</div>
		</div>
	);
}
