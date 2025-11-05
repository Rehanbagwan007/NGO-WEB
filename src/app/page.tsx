'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ArrowRight,
  Calendar,
  Heart,
  Target,
  HeartHandshake,
  Briefcase,
  PlayCircle,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { events as allEvents } from '@/lib/data';

export default function LandingPage() {
  const events = allEvents
    .filter((e) => e.status === 'Published' && e.type === 'Upcoming')
    .slice(0, 3);

  return (
    <div className="flex-1">
      {/* Hero Section */}
      <section className="relative bg-background overflow-hidden">
        <div className="container mx-auto px-4 py-20 lg:py-32">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="z-10">
              <p className="text-primary font-semibold mb-2">Change The World</p>
              <h1 className="text-4xl md:text-5xl font-headline font-bold mb-4 leading-tight">
                Need Your Big Hand For{' '}
                <span className="text-primary">Change</span> The World.
              </h1>
              <p className="text-muted-foreground text-lg mb-8">
                Sanvedana is dedicated to providing education, therapy, and
                support for children with special needs, helping them build a
                brighter future.
              </p>
              <div className="flex items-center gap-4">
                <Button size="lg" asChild>
                  <Link href="/donations">Donate Now</Link>
                </Button>
                <Button variant="link" asChild className="text-foreground">
                  <Link href="#">
                    <PlayCircle className="mr-2" /> Watch Video
                  </Link>
                </Button>
              </div>
            </div>
            <div className="relative h-96 md:h-auto">
                {/* Abstract shapes */}
                <div className="absolute -top-16 -right-16 w-72 h-72 bg-accent/20 rounded-full blur-2xl"></div>
                <div className="absolute -bottom-16 -left-16 w-72 h-72 bg-primary/10 rounded-full blur-2xl"></div>
                
                <div className="relative w-full h-full flex items-center justify-center">
                    <Image
                        src="https://picsum.photos/seed/hero-main/500/500"
                        alt="Smiling children"
                        width={450}
                        height={450}
                        className="rounded-full object-cover z-10 aspect-square"
                        data-ai-hint="smiling children"
                    />
                     <div className="absolute bottom-8 -left-8 z-20 bg-white p-4 rounded-full shadow-lg">
                        <div className="w-48 h-48 rounded-full bg-primary text-primary-foreground flex flex-col items-center justify-center text-center p-4">
                            <p className="font-headline text-4xl font-bold">₹8.6Cr</p>
                            <p className="text-sm">Total Raised</p>
                        </div>
                    </div>
                    <div className="absolute top-0 right-0 w-20 h-20 bg-primary/80 rounded-full z-0"></div>
                     <div className="absolute bottom-1/4 -right-4 w-12 h-12 bg-accent/50 rounded-full z-0"></div>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-16 lg:py-24 bg-muted/40">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="space-y-4">
              <h2 className="text-3xl font-headline font-bold">About Sanvedana</h2>
              <p className="text-muted-foreground text-lg">
                Sanvedana is a non-profit organization committed to the
                well-being and development of specially-abled children. We
                believe every child deserves a chance to reach their full
                potential, regardless of their challenges.
              </p>
              <p className="text-muted-foreground">
                Our comprehensive approach combines specialized education,
                therapeutic interventions, and vocational training to foster
                independence and integrate our children into mainstream society.
              </p>
              <Button variant="outline" asChild>
                <Link href="/about">
                  Learn More <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
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
      <section id="focus" className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-headline font-bold mb-2">Our Focus</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-12">
            We concentrate on key areas to provide holistic development for our
            children.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader className="items-center">
                <div className="p-4 bg-primary/10 rounded-full">
                  <Target className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="font-headline mt-4">
                  Specialized Education
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Tailored academic programs designed to meet the unique
                  learning needs of each child.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="items-center">
                <div className="p-4 bg-primary/10 rounded-full">
                  <HeartHandshake className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="font-headline mt-4">
                  Therapy & Rehabilitation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Offering speech therapy, occupational therapy, and
                  physiotherapy to improve life skills.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="items-center">
                <div className="p-4 bg-primary/10 rounded-full">
                  <Briefcase className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="font-headline mt-4">
                  Vocational Training
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Equipping students with practical skills for future
                  employment and independence.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section id="events" className="py-16 lg:py-24 bg-muted/40">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-headline font-bold text-center mb-12">
            Upcoming Events
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <Card key={event.title} className="flex flex-col">
                <CardHeader className="p-0">
                  <Image
                    src={event.bannerImage}
                    alt={event.title}
                    width={400}
                    height={250}
                    className="rounded-t-lg object-cover aspect-[16/10]"
                    data-ai-hint={event.imageHint}
                  />
                </CardHeader>
                <CardContent className="flex-1 pt-6">
                  <CardTitle className="font-headline text-xl mb-2">
                    {event.title}
                  </CardTitle>
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
                  <Button variant="link" className="p-0" asChild>
                    <Link href={`/events`}>
                      Learn More <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          {events.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              No upcoming events. Please check back later.
            </div>
          )}
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
