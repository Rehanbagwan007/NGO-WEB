

import Image from 'next/image';
import { TeamSection } from './components/team-section';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import type { WebsiteContent } from '@/lib/types';
import { MissionSection } from '@/components/landing/mission-section';
import SmoothScroll from '@/components/smooth-scroll';

async function getPageData() {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    const { data: content, error: contentError } = await supabase.from('website_content').select('*');

    if (contentError) console.error('Error fetching website content:', contentError);

    const contentAsObject = content?.reduce((acc, item) => {
        acc[item.id as keyof WebsiteContent] = item.content || '';
        return acc;
    }, {} as WebsiteContent) || ({} as WebsiteContent);
    
    return {
        content: contentAsObject,
    };
}


export default async function AboutPage() {
  const { content } = await getPageData();
  
  return (
    <SmoothScroll>
      <div className="bg-background">
        <section className="bg-primary/10 py-20 text-center relative overflow-hidden">
             <div
                className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[10px_10px] [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0))]"></div>
            <div className="container relative">
                <h1 className="text-4xl md:text-6xl font-bold font-headline">About Sanvedana</h1>
                <p className="mx-auto mt-4 max-w-2xl text-2xl text-muted-foreground font-light">
                   &quot;नको सहानुभूती हवी समान संधी&quot;
                </p>
                <p className="mx-auto mt-2 max-w-2xl text-muted-foreground">
                    &quot;Don&apos;t want sympathy, want equal opportunity&quot;
                </p>
            </div>
        </section>

        <MissionSection content={content} />

        <TeamSection />
      </div>
    </SmoothScroll>
  );
}
