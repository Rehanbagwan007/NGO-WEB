
import { createClient } from '@/lib/supabase/server';
import type { Event } from '@/lib/types';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { EventForm } from '../../components/event-form';

async function getEvent(id: string): Promise<Event | null> {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    const { data, error } = await supabase.from('events').select('*').eq('id', id).single();
    if (error) {
        console.error(`Error fetching event ${id}:`, error);
        return null;
    }
    return data;
}

export default async function EditEventPage({ params }: { params: { id: string } }) {
    const event = await getEvent(params.id);

    if (!event) {
        notFound();
    }

    return (
        <>
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold md:text-2xl">Edit Event</h1>
            </div>
            <EventForm event={event} />
        </>
    );
}
