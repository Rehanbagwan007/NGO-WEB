
import { createClient } from '@/lib/supabase/server';
import type { Event } from '@/lib/types';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Calendar, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

async function getEventById(id: string): Promise<Event | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching event by ID:', error);
    return null;
  }

  return data;
}

export default async function EventDetailPage({ params }: { params: { id: string } }) {
  const event = await getEventById(params.id);

  if (!event) {
    notFound();
  }

  return (
    <div className="bg-background">
      <section className="relative h-[50vh] w-full">
        {event.bannerimage ? (
          <Image
            src={event.bannerimage}
            alt={event.title}
            fill
            className="object-cover"
            priority
            data-ai-hint={event.imagehint}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted">
            <p className="text-muted-foreground">No banner image</p>
          </div>
        )}
        <div className="absolute inset-0 bg-black/50" />
        <div className="container relative z-10 flex h-full flex-col items-center justify-center text-center text-primary-foreground">
          <h1 className="text-4xl font-bold font-headline md:text-6xl">{event.title}</h1>
        </div>
      </section>
      
      <section className="py-12 md:py-16">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-2xl font-bold mb-4 font-headline">About the Event</h2>
                  <p className="whitespace-pre-wrap text-muted-foreground">{event.description}</p>
                </CardContent>
              </Card>

              {event.gallery && event.gallery.length > 0 && (
                <Card>
                  <CardContent className="pt-6">
                    <h2 className="text-2xl font-bold mb-4 font-headline">Gallery</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {event.gallery.map((item, index) => (
                        <div key={index} className="relative aspect-square overflow-hidden rounded-lg">
                           {item.url ? (
                                <Image 
                                    src={item.url} 
                                    alt={`Gallery image ${index + 1}`} 
                                    fill 
                                    className="object-cover transition-transform duration-300 hover:scale-105"
                                    data-ai-hint={item.hint}
                                />
                           ) : (
                                <div className="flex h-full w-full items-center justify-center bg-muted">
                                    <p className="text-xs text-muted-foreground">No image</p>
                                </div>
                           )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar with Details */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardContent className="pt-6 space-y-4">
                    <h3 className="text-xl font-bold font-headline">Event Details</h3>
                    <div className="flex items-start space-x-3">
                        <Calendar className="h-5 w-5 mt-1 text-primary" />
                        <div>
                            <p className="font-semibold">Date</p>
                            <p className="text-muted-foreground">{new Date(event.date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        </div>
                    </div>
                    <div className="flex items-start space-x-3">
                        <MapPin className="h-5 w-5 mt-1 text-primary" />
                        <div>
                            <p className="font-semibold">Location</p>
                            <p className="text-muted-foreground">{event.location}</p>
                        </div>
                    </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
