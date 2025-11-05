'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ArrowRight, Calendar, Heart, Target, HeartHandshake, Briefcase } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function LandingPage() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'social-hero');

  const events = [
    {
      title: 'Annual Charity Gala',
      date: '2024-10-26',
      description: 'Join us for a night of celebration and fundraising to support our programs.',
      imageUrl: 'https://picsum.photos/seed/event1/400/250',
      imageHint: 'gala event'
    },
    {
      title: 'Community Sensitization Workshop',
      date: '2024-11-15',
      description: 'An interactive workshop to raise awareness about the needs of specially-abled children.',
      imageUrl: 'https://picsum.photos/seed/event2/400/250',
      imageHint: 'community workshop'
    },
    {
      title: 'Art for a Cause Exhibition',
      date: '2024-12-05',
      description: 'An exhibition showcasing artwork created by our talented students.',
      imageUrl: 'https://picsum.photos/seed/event3/400/250',
      imageHint: 'art exhibition'
    },
  ];

  return (
    <div className="flex-1">
      {/* Hero Section */}
      <section className="relative h-[60vh] w-full flex items-center justify-center text-center text-white">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            fill
            className="object-cover"
            data-ai-hint={heroImage.imageHint}
          />
        )}
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 p-4">
          <h1 className="text-4xl md:text-6xl font-headline font-bold mb-4">
            Empowering Special Needs Children
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8">
            Sanvedana is dedicated to providing education, therapy, and support for children with special needs, helping them build a brighter future.
          </p>
          <Button size="lg" asChild>
            <Link href="/donations">
              Donate Now <Heart className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="space-y-4">
              <h2 className="text-3xl font-headline font-bold">About Sanvedana</h2>
              <p className="text-muted-foreground text-lg">
                Sanvedana is a non-profit organization committed to the well-being and development of specially-abled children. We believe every child deserves a chance to reach their full potential, regardless of their challenges.
              </p>
              <p className="text-muted-foreground">
                Our comprehensive approach combines specialized education, therapeutic interventions, and vocational training to foster independence and integrate our children into mainstream society.
              </p>
              <Button variant="outline" asChild>
                <Link href="/about">Learn More <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
            <div>
              <Image
                src="https://picsum.photos/seed/about/600/400"
                alt="Children at Sanvedana"
                width={600}
                height={400}
                className="rounded-lg shadow-lg"
                data-ai-hint="children learning"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Focus Section */}
      <section id="focus" className="py-16 lg:py-24 bg-muted/40">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-headline font-bold mb-2">Our Focus</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-12">
            We concentrate on key areas to provide holistic development for our children.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader className="items-center">
                <div className="p-4 bg-primary/10 rounded-full">
                  <Target className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="font-headline mt-4">Specialized Education</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Tailored academic programs designed to meet the unique learning needs of each child.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="items-center">
                <div className="p-4 bg-primary/10 rounded-full">
                   <HeartHandshake className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="font-headline mt-4">Therapy & Rehabilitation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Offering speech therapy, occupational therapy, and physiotherapy to improve life skills.
                </p>
              </CardContent>
            </Card>
             <Card>
              <CardHeader className="items-center">
                 <div className="p-4 bg-primary/10 rounded-full">
                   <Briefcase className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="font-headline mt-4">Vocational Training</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Equipping students with practical skills for future employment and independence.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section id="events" className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-headline font-bold text-center mb-12">Upcoming Events</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <Card key={event.title} className="flex flex-col">
                <CardHeader className="p-0">
                  <Image
                    src={event.imageUrl}
                    alt={event.title}
                    width={400}
                    height={250}
                    className="rounded-t-lg object-cover"
                    data-ai-hint={event.imageHint}
                  />
                </CardHeader>
                <CardContent className="flex-1 pt-6">
                  <CardTitle className="font-headline text-xl mb-2">{event.title}</CardTitle>
                  <div className="flex items-center text-sm text-muted-foreground mb-4">
                    <Calendar className="h-4 w-4 mr-2" />
                    {new Date(event.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </div>
                  <CardDescription>{event.description}</CardDescription>
                </CardContent>
                <CardFooter>
                   <Button variant="link" className="p-0">
                    Learn More <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
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
            Your contribution can change a life. Support our cause and help us empower more children.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/donations">
              Donate Today
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
