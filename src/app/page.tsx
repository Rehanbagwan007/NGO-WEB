
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Calendar, MapPin } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { Event, WebsiteContent } from '@/lib/types';
import { createClient } from '@/lib/supabase/server';
import { HeroCarousel } from '@/app/components/landing/hero-carousel';
import { MissionSection } from '@/app/components/landing/mission-section';
import { cookies } from 'next/headers';
import SmoothScroll from '@/components/smooth-scroll';

async function getPageData() {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const eventsPromise = supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true })
        .limit(3);

    const contentPromise = supabase.from('website_content').select('*');

    const [{ data: events, error: eventsError }, { data: content, error: contentError }] = await Promise.all([
        eventsPromise,
        contentPromise,
    ]);

    if (eventsError) console.error('Error fetching upcoming events:', eventsError);
    if (contentError) console.error('Error fetching website content:', contentError);

    const contentAsObject = content?.reduce((acc, item) => {
        acc[item.id as keyof WebsiteContent] = item.content || '';
        return acc;
    }, {} as WebsiteContent) || ({} as WebsiteContent);
    
    return {
        upcomingEvents: events || [],
        content: contentAsObject,
    };
}


const EventCard = ({ event }: { event: Event }) => (
    <Card className="flex flex-col overflow-hidden">
      <CardHeader className="p-0 relative aspect-video w-full">
        {event.bannerimage ? (
            <Image
              src={event.bannerimage}
              alt={event.title}
              fill
              className="object-cover"
              data-ai-hint={event.imagehint}
            />
        ) : (
            <div className="aspect-video w-full bg-muted flex items-center justify-center">
              <p className="text-muted-foreground">No Image</p>
            </div>
        )}
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

// Force the page to be dynamic and not cached
export const revalidate = 0;

export default async function LandingPage() {
    const { upcomingEvents, content } = await getPageData();

  return (
    <SmoothScroll>
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden bg-background pt-6 md:pt-14 md:-mt-24 mt-4">
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
      <MissionSection content={content} />

      {/* Events Section */}
       <section className="py-16 lg:py-24">
        <div className="container">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold font-headline">Events</h2>
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
              <p className="text-muted-foreground">No events scheduled. Please check back soon!</p>
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
    </SmoothScroll>
  );
}
