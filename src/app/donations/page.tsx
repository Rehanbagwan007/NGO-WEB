
'use client';

import { DonationForm } from './components/donation-form';

export default function DonationsPage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-8 p-4 lg:gap-6 lg:p-6 container mx-auto mt-12">
      <div className="w-full max-w-lg">
         <DonationForm />
      </div>
    </main>
  );
}
