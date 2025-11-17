

import Image from 'next/image';
import { ArrowRight, Calendar, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';
import type { Event } from '@/lib/types';
import { createClient } from '@/lib/supabase/server';


async function getEvents(): Promise<Event[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('date', { ascending: true });

  if (error) {
    console.error('Error fetching published events:', error);
    return [];
  }
  return data;
}

const EventCard = ({ event }: { event: Event }) => (
  <Card className="flex flex-col overflow-hidden">
    <CardHeader className="p-0">
      {event.bannerimage ? (
        <div className="relative aspect-video w-full">
          <Image
            src={event.bannerimage}
            alt={event.title}
            fill
            className="object-cover"
            data-ai-hint={event.imagehint}
          />
        </div>
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

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <div className="bg-background">
      <section className="bg-primary/10 py-16 text-center">
        <div className="container">
          <h1 className="text-4xl font-bold font-headline">Events</h1>
          <p className="mx-auto mt-2 max-w-2xl text-muted-foreground">
            Join our events to support our cause, learn more about our work, and celebrate our community.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container">
          {events.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
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
    </div>
  );
}
