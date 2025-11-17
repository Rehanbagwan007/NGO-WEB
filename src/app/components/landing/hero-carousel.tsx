
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
import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';

type HeroBanner = {
  id: string;
  image_url: string;
  alt_text: string | null;
};

async function getHeroBanners(): Promise<HeroBanner[]> {
    const supabase = createClient();
    const { data, error } = await supabase.from('hero_banners').select('*').order('created_at', { ascending: false });
    if (error) {
        console.error("Error fetching hero banners:", error);
        return [];
    }
    return data;
}

export function HeroCarousel() {
  const [banners, setBanners] = useState<HeroBanner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      const data = await getHeroBanners();
      setBanners(data);
      setLoading(false);
    };
    fetchBanners();
  }, []);

  if (loading) {
    return (
        <div className="p-1">
            <div className="relative overflow-hidden rounded-2xl h-[80vh] bg-muted animate-pulse"></div>
        </div>
    )
  }

  if (banners.length === 0) {
      return (
          <div className="p-1">
             <div className="relative flex items-center justify-center overflow-hidden rounded-2xl h-[80vh] bg-muted">
                <p className="text-muted-foreground">No hero images configured.</p>
             </div>
          </div>
      )
  }

  return (
    <Carousel
      opts={{
        align: 'start',
        loop: true,
      }}
      plugins={[
        Autoplay({
          delay: 5000,
        }),
      ]}
      className="w-full"
    >
      <CarouselContent>
        {banners.map((image, index) => (
          <CarouselItem key={image.id}>
            <div className="p-1">
              <div className="relative overflow-hidden rounded-2xl h-[80vh]">
                <Image
                  src={image.image_url}
                  alt={image.alt_text || 'Sanvedana hero image'}
                  fill
                  priority={index === 0}
                  className="object-cover w-full h-full rounded-2xl"
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
