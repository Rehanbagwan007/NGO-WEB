'use client';

import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import {
  ArrowRight,
  HeartHandshake,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const StatCard = ({
  value,
  label,
  bgColor,
  textColor,
  imageSrc,
  imageAlt,
  imagePosition,
}: {
  value: string;
  label: string;
  bgColor: string;
  textColor: string;
  imageSrc?: string;
  imageAlt?: string;
  imagePosition?: 'top' | 'bottom';
}) => (
  <div className={`relative rounded-3xl overflow-hidden ${bgColor} ${textColor} flex flex-col justify-center items-center text-center p-8`}>
    {imageSrc && imagePosition === 'top' && (
       <div className="w-full h-32 mb-4">
        <Image src={imageSrc} alt={imageAlt!} width={400} height={200} className="w-full h-full object-cover" data-ai-hint={imageAlt} />
       </div>
    )}
    <p className="text-5xl font-bold font-headline">{value}</p>
    <p>{label}</p>
    {imageSrc && imagePosition === 'bottom' && (
      <div className="w-full h-32 mt-4">
       <Image src={imageSrc} alt={imageAlt!} width={400} height={200} className="w-full h-full object-cover" data-ai-hint={imageAlt} />
      </div>
    )}
  </div>
);


export default function LandingPage() {
  const sliderImages = [
    {
      src: 'https://picsum.photos/seed/hero1/800/600',
      alt: 'Child with disability smiling while learning',
      hint: 'smiling disabled child',
    },
    {
      src: 'https://picsum.photos/seed/hero2/800/600',
      alt: 'Therapist assisting a child with special needs',
      hint: 'therapist disabled child',
    },
    {
      src: 'https://picsum.photos/seed/hero3/800/600',
      alt: 'Children with disabilities playing together joyfully',
      hint: 'disabled children playing',
    },
     {
      src: 'https://picsum.photos/seed/hero4/800/600',
      alt: 'Student in a wheelchair working on a computer',
      hint: 'disabled student technology',
    },
     {
      src: 'https://picsum.photos/seed/hero5/800/600',
      alt: 'Children in an art therapy session',
      hint: 'art therapy children',
    },
  ];

  return (
    <div className="flex-1 bg-background">
      {/* Hero Section */}
      <section className="relative bg-primary/10 overflow-hidden">
        <div className="container mx-auto px-4 py-16 lg:py-24">
          <div className="grid lg:grid-cols-1 gap-8 items-center">
            {/* Middle Column */}
            <div className="">
              <h1 className="text-5xl md:text-7xl font-headline font-black mb-6 leading-tight tracking-tighter">
                Empowering Change,
                <br />
                Inspiring H
                <span className="inline-flex items-center align-middle">
                  <HeartHandshake className="size-12 md:size-16 text-primary" />
                </span>
                pe
              </h1>
              <Carousel
                opts={{
                  align: 'start',
                  loop: true,
                }}
                className="w-full"
              >
                <CarouselContent>
                  {sliderImages.map((image, index) => (
                    <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                      <div className="p-1">
                        <Image
                          src={image.src}
                          alt={image.alt}
                          width={800}
                          height={600}
                          className="rounded-3xl object-cover aspect-[16/9]"
                          data-ai-hint={image.hint}
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="ml-16" />
                <CarouselNext className="mr-16"/>
              </Carousel>
            </div>

          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative h-[500px]">
               <Image
                src="https://picsum.photos/seed/about-main/600/700"
                alt="Diverse group of children with special needs in a classroom setting"
                width={600}
                height={700}
                className="rounded-3xl shadow-lg object-cover w-full h-full"
                data-ai-hint="disabled children classroom"
              />
              <div className="absolute -bottom-8 -left-8 bg-primary rounded-full p-4">
                <div className="bg-background rounded-full p-4">
                    <Button asChild size="icon" className="w-16 h-16 rounded-full bg-primary hover:bg-primary/90">
                        <Link href="/about">
                            <ArrowRight className="size-8" />
                        </Link>
                    </Button>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <h2 className="text-5xl font-headline font-black leading-tight tracking-tighter">
                One World,
                <br />
                One Mission
              </h2>
              <p className="text-muted-foreground text-lg">
                "One World, One Mission" encapsulates our commitment to a united, inclusive future. At Sanvedana, we believe that every child deserves the chance to thrive in a healthy, safe, and supportive world. Our mission transcends borders and disabilities, bringing together individuals from all walks of life.
              </p>
              <p className="text-muted-foreground">
                Through collaborative efforts in education, therapy, and community building, we aim to create a world where equality, compassion, and opportunity are accessible to all. Together, we're building a brighter future, one child at a time.
              </p>
            </div>
          </div>
        </div>
      </section>

       {/* Stats Section */}
      <section id="stats" className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                value="500+"
                label="Active Students"
                bgColor="bg-secondary"
                textColor="text-secondary-foreground"
                imageSrc="https://picsum.photos/seed/stat1/400/200"
                imageAlt="students in classroom"
                imagePosition="bottom"
              />
               <StatCard
                value="200+"
                label="Community Projects"
                bgColor="bg-secondary"
                textColor="text-secondary-foreground"
                imageSrc="https://picsum.photos/seed/stat2/400/200"
                imageAlt="community event"
                imagePosition="top"
              />
               <StatCard
                value="100+"
                label="Dedicated Staff"
                bgColor="bg-primary"
                textColor="text-primary-foreground"
                imageSrc="https://picsum.photos/seed/stat3/400/200"
                imageAlt="staff members"
                imagePosition="bottom"
              />
               <StatCard
                value="300+"
                label="Educational Programs"
                bgColor="bg-primary"
                textColor="text-primary-foreground"
                imageSrc="https://picsum.photos/seed/stat4/400/200"
                imageAlt="educational materials"
                imagePosition="top"
              />
           </div>
        </div>
      </section>


      {/* Footer CTA */}
      <section className="py-16 lg:py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-headline font-bold mb-4">
            Join Us in Making a Difference
          </h2>
          <p className="text-lg max-w-2xl mx-auto mb-8">
            Your contribution can change a life. Support our cause and help us
            empower more children.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/donations">Donate Today</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
