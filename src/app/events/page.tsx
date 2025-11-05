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
import { events } from '@/lib/data';
import type { Event } from '@/lib/types';
import Link from 'next/link';

export default function EventsPage() {
  const upcomingEvents = events.filter((e) => e.type === 'Upcoming' && e.status === 'Published');
  const pastEvents = events.filter((e) => e.type === 'Past' && e.status === 'Published');

  const EventCard = ({ event }: { event: Event }) => (
    <Card className="flex flex-col overflow-hidden">
      <CardHeader className="p-0">
        <Image
          src={event.bannerImage}
          alt={event.title}
          width={600}
          height={320}
          className="object-cover"
          data-ai-hint={event.imageHint}
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
        <p className="flex-1 text-muted-foreground">{event.description}</p>
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
          <h2 className="mb-8 text-3xl font-bold font-headline">Upcoming Events</h2>
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

      <section className="bg-muted/50 py-16">
        <div className="container">
          <h2 className="mb-8 text-3xl font-bold font-headline">Past Events</h2>
           {pastEvents.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {pastEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="flex h-40 items-center justify-center rounded-lg border-2 border-dashed bg-muted/50">
                <p className="text-muted-foreground">No past events to show.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
