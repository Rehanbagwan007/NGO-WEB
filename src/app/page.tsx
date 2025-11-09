'use client';

import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="flex-1 bg-background">
      {/* Hero Section */}
      <section className="relative h-screen w-full overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover"
          poster="https://picsum.photos/seed/hero-poster/1920/1080"
        >
          {/* Using a placeholder video */}
          <source
            src="https://firebasestorage.googleapis.com/v0/b/builder-29b56.appspot.com/o/assets%2Fkimia-zarifi-DLIETO3o8hA-unsplash.mp4?alt=media&token=8669d3c3-b44c-4491-a912-32a8a816e87f"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 flex h-full items-center justify-center">
          <Button
            variant="default"
            className="h-24 w-24 rounded-full bg-black/80 text-white backdrop-blur-sm hover:bg-black"
          >
            <Play className="h-10 w-10 fill-white" />
          </Button>
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
