
'use server';

import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { revalidatePath } from 'next/cache';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function createDonationOrder(args: { amount: number }) {
  const options = {
    amount: args.amount * 100, // amount in the smallest currency unit
    currency: 'INR',
    receipt: `receipt_order_${new Date().getTime()}`,
  };

  try {
    const order = await razorpay.orders.create(options);
    return { success: true, order };
  } catch (error) {
    console.error('Razorpay order creation failed:', error);
    return {
      success: false,
      error: 'Could not create payment order. Please try again.',
    };
  }
}

interface VerifyDonationArgs {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    donorName: string;
    donorEmail: string;
    amount: number;
}

export async function verifyDonation(args: VerifyDonationArgs) {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, donorName, donorEmail, amount } = args;

    const body = razorpay_order_id + '|' + razorpay_payment_id;

    try {
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
            .update(body.toString())
            .digest('hex');

        if (expectedSignature !== razorpay_signature) {
             throw new Error('Signature verification failed.');
        }

        // Signature is valid, now save the donation to the database
        const cookieStore = cookies();
        const supabase = createClient(cookieStore);

        const { data, error } = await supabase.from('donations').insert({
            id: razorpay_payment_id,
            donorName: donorName,
            donorEmail: donorEmail,
            amount: amount,
            date: new Date().toISOString(),
            status: 'Completed',
        }).select().single();

        if (error) {
            console.error('Supabase donation insert error:', error);
            // Even if DB insert fails, the payment was successful. Log this for manual reconciliation.
            throw new Error('Payment was successful, but we could not save the record. Please contact support.');
        }
        
        revalidatePath('/donations');
        revalidatePath('/admin/donations');

        return { success: true, donation: data };

    } catch (error) {
         console.error('Donation verification/saving failed:', error);
         return { success: false, error: (error as Error).message };
    }
}
