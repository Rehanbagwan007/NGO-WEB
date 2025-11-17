
import { EventForm } from '../components/event-form';

export default function NewEventPage() {
  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Create New Event</h1>
      </div>
      <EventForm />
    </>
  );
}
