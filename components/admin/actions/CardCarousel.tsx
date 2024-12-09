'use client';
import {
	Carousel,
	CarouselContent,
	CarouselItem,
} from '@/components/ui/carousel';
import { getYoutubeID } from '@/lib/utils';
import { UserMedia } from '@/types';
import Autoplay from 'embla-carousel-autoplay';
import YoutubeEmbed from '../light-box/YoutubeEmbed';

interface Props {
	urls: UserMedia[];
}

export default function CardCarousel({ urls}: Props) {
	return (
		<Carousel
			plugins={[Autoplay()]}
			className='w-full aspect-video hover:scale-105 transition-all hover:border-2 hover:border-green-400 rounded-md hover:p-2 hover:bg-green-200/20'
		>
			<CarouselContent className='size-full ml-0'>
				{urls.map((url) => (
					<CarouselItem key={url.url} className='size-full aspect-video pl-0'>
						{url.type === 'image' ? (
							<img
								key={`carousel-${url.url}`}
								src={url.url}
								alt={url.url}
								className='rounded-md size-full object-cover'
							/>
						) : url.type === 'video' ? (
							<video
								key={`carousel-${url.url}`}
								src={url.url}
								className='rounded-md size-full object-cover'
							/>
						) : (
							getYoutubeID(url.url) && (
								<YoutubeEmbed
									url={getYoutubeID(url.url)!}
									className='rounded-md size-full object-cover'
									key={`carousel-${url.url}`}
									onClick={() => {}}
								/>
							)
						)}
					</CarouselItem>
				))}
			</CarouselContent>
		</Carousel>
	);
}
