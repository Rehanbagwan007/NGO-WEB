'use client';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const heroImages = [
  {
    src: 'https://picsum.photos/seed/hero1/800/600',
    alt: 'A beautiful landscape',
    hint: 'landscape mountain',
  },
  {
    src: 'https://picsum.photos/seed/hero2/800/600',
    alt: 'A city street at sunset',
    hint: 'city sunset',
  },
  {
    src: 'https://picsum.photos/seed/hero3/800/600',
    alt: 'A highland cow on a beach',
    hint: 'highland cow',
  },
  {
    src: 'https://picsum.photos/seed/hero4/800/600',
    alt: 'A child painting',
    hint: 'child painting',
  },
   {
    src: 'https://picsum.photos/seed/hero5/800/600',
    alt: 'A helping hand',
    hint: 'helping hand',
  },
];


export default function LandingPage() {
  return (
    <div className="flex-1 bg-background">
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden bg-background">
        <div className="container mx-auto px-4 py-20 lg:py-32">
            <div className="space-y-6 text-left mb-12">
              <h1 className="text-4xl lg:text-7xl font-headline font-black leading-tight tracking-tighter">
                Empowering Change,
                <br />
                Inspiring H<HeartIcon className="inline-block h-12 w-12 lg:h-20 lg:w-20 -mb-2 text-primary" />pe.
              </h1>
            </div>
            <Carousel
                opts={{
                  align: 'start',
                  loop: true,
                }}
                className="w-full"
              >
                <CarouselContent>
                  {heroImages.map((image, index) => (
                    <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                      <div className="p-1">
                        <div className="relative overflow-hidden rounded-2xl">
                          <Image
                            src={image.src}
                            alt={image.alt}
                            width={800}
                            height={600}
                            className="object-cover w-full h-full aspect-[4/3] rounded-2xl"
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
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-16 lg:py-24 bg-muted/20">
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
            </div>
            <div className="space-y-6">
              <h2 className="text-5xl font-headline font-black leading-tight tracking-tighter">
                Our Mission
              </h2>
              <p className="text-muted-foreground text-lg">
                At Sanvedana, we believe that every child deserves the chance
                to thrive in a healthy, safe, and supportive world. Our mission
                transcends borders and disabilities, bringing together
                individuals from all walks of life.
              </p>
              <p className="text-muted-foreground">
                Through collaborative efforts in education, therapy, and
                community building, we aim to create a world where equality,
                compassion, and opportunity are accessible to all. Together,
                we're building a brighter future, one child at a time.
              </p>
               <Button asChild size="lg">
                    <Link href="/about">
                       Learn More
                    </Link>
                </Button>
            </div>
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


function HeartIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
    >
      <path d="M12.83,4.64a5,5,0,0,0-7.07,0,5,5,0,0,0,0,7.07l7.07,7.07,7.07-7.07a5,5,0,0,0,0-7.07,5,5,0,0,0-7.07,0Z" />
    </svg>
  );
}
