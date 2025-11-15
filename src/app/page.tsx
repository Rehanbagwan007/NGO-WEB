

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Calendar, MapPin } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { Event } from '@/lib/types';
import { createClient } from '@/lib/supabase/server';
import { HeroCarousel } from '@/app/components/landing/hero-carousel';


async function getUpcomingEvents(): Promise<Event[]> {
  const supabase = createClient();
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set to the beginning of the day
  
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('status', 'Published')
    .gte('date', today.toISOString())
    .order('date', { ascending: true })
    .limit(3);

    console.log(data)

  if (error) {
    console.error('Error fetching upcoming events:', error);
    return [];
  }
  return data;
}

const EventCard = ({ event }: { event: Event }) => (
    <Card className="flex flex-col overflow-hidden">
      <CardHeader className="p-0 relative aspect-video w-full">
        <Image
          src={event.bannerimage}
          alt={event.title}
          fill
          className="object-cover"
          data-ai-hint={event.imagehint}
        />
      </CardHeader>
      <CardContent className="flex flex-1 flex-col p-6">
        <CardTitle className="mb-2 font-headline text-xl">
          {event.title}
        </CardTitle>
        <div className="mb-4 flex flex-col gap-2 text-sm text-muted-foreground">
          <div className="flex items-center">
            <Calendar className="mr-2 h-4 w-4" />
            <span>{new Date(event.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
          <div className="flex items-center">
            <MapPin className="mr-2 h-4 w-4" />
            <span>{event.location}</span>
          </div>
        </div>
        <p className="flex-1 text-muted-foreground line-clamp-3">{event.description}</p>
      </CardContent>
      <CardFooter>
        <Button asChild variant="secondary" className="w-full">
          <Link href={`/events/${event.id}`}>
            View Details <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
);

export default async function LandingPage() {
    const upcomingEvents = await getUpcomingEvents();

  return (
    <div className="flex-1 bg-background">
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden bg-background pt-8 md:pt-16 -mt-24">
        <div className="container mx-auto px-4 py-20 lg:py-32">
          <div className="space-y-6 text-left mb-12">
            <h1 className="text-5xl lg:text-8xl font-headline font-black leading-none tracking-tighter">
              Empowering Change,
              <br />
              Inspiring H
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                className="inline-block h-16 w-16 lg:h-24 lg:w-24 -mb-4 text-primary"
              >
                <path d="M12.83,4.64a5,5,0,0,0-7.07,0,5,5,0,0,0,0,7.07l7.07,7.07,7.07-7.07a5,5,0,0,0,0-7.07,5,5,0,0,0-7.07,0Z" />
              </svg>
              pe.
            </h1>
          </div>
          <HeroCarousel />
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
                <Link href="/about">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
       <section className="py-16 lg:py-24">
        <div className="container">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold font-headline">Upcoming Events</h2>
             <Button asChild variant="outline">
              <Link href="/events">
                View All Events <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          {upcomingEvents.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {upcomingEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="flex h-40 items-center justify-center rounded-lg border-2 border-dashed bg-muted/50">
              <p className="text-muted-foreground">No upcoming events scheduled. Please check back soon!</p>
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
