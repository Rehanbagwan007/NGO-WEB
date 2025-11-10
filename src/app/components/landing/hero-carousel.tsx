
'use client';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Image from 'next/image';
import Autoplay from 'embla-carousel-autoplay';

const heroImages = [
  {
    src: 'https://picsum.photos/seed/hero1/1200/800',
    alt: 'A beautiful landscape',
    hint: 'landscape mountain',
  },
  {
    src: 'https://picsum.photos/seed/hero2/1200/800',
    alt: 'A city street at sunset',
    hint: 'city sunset',
  },
  {
    src: 'https://picsum.photos/seed/hero3/1200/800',
    alt: 'A highland cow on a beach',
    hint: 'highland cow',
  },
  {
    src: 'https://picsum.photos/seed/hero4/1200/800',
    alt: 'A child painting',
    hint: 'child painting',
  },
  {
    src: 'https://picsum.photos/seed/hero5/1200/800',
    alt: 'A helping hand',
    hint: 'helping hand',
  },
];

export function HeroCarousel() {
  return (
    <Carousel
      opts={{
        align: 'start',
        loop: true,
      }}
      plugins={[
        Autoplay({
          delay: 4000,
        }),
      ]}
      className="w-full"
    >
      <CarouselContent>
        {heroImages.map((image, index) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <div className="relative overflow-hidden rounded-2xl h-[80vh]">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover w-full h-full rounded-2xl"
                  data-ai-hint={image.hint}
                />
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10" />
      <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10" />
    </Carousel>
  );
}
