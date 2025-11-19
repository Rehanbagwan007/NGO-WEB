
'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import type { WebsiteContent } from '@/lib/types';
import { SupabaseClient } from '@supabase/supabase-js';

export function MissionSection({ content }: { content: WebsiteContent }) {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
      },
    },
  };
  
  const imageVariants = {
      hidden: { opacity: 0, x: -50 },
      visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.5,
        }
      }
  }

  const missionImageUrl = content.mission_image_url || "https://picsum.photos/seed/about-main/600/700";

  return (
    <section id="about" className="py-16 lg:py-24 bg-muted/20 overflow-hidden">
      <motion.div 
        className="container mx-auto px-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        transition={{ staggerChildren: 0.3 }}
      >
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div 
            className="relative h-[500px]"
            variants={imageVariants}
          >
            <Image
              src={missionImageUrl}
              alt="Diverse group of children with special needs in a classroom setting"
              width={600}
              height={700}
              className="rounded-3xl shadow-lg object-cover w-full h-full"
              data-ai-hint="disabled children classroom"
            />
          </motion.div>
          <motion.div 
            className="space-y-6"
            variants={containerVariants}
          >
            <motion.h2 
              className="text-5xl font-headline font-black leading-tight tracking-tighter"
              variants={itemVariants}
            >
              {content.mission_title || 'Our Mission'}
            </motion.h2>
            <motion.p 
              className="text-muted-foreground text-lg"
              variants={itemVariants}
            >
              {content.mission_p1}
            </motion.p>
            <motion.p 
              className="text-muted-foreground"
              variants={itemVariants}
            >
              {content.mission_p2}
            </motion.p>
            <motion.div variants={itemVariants}>
              <Button asChild size="lg">
                <Link href="/about">Learn More</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
