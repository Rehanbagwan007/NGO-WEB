
'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { TeamMember } from '@/lib/types';
import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

async function getTeamData(): Promise<{ members: TeamMember[], advisors: TeamMember[] }> {
    const supabase = createClient();
    const { data, error } = await supabase.from('team_members').select('*').order('display_order', { ascending: true });
    if (error) {
        console.error("Error fetching team members:", error);
        return { members: [], advisors: [] };
    }
    const members = data.filter(m => m.type === 'member');
    const advisors = data.filter(m => m.type === 'advisor');
    return { members, advisors };
}

const containerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
        },
    },
};

const TeamMemberCard = ({ name, role, avatar_url }: TeamMember) => (
    <motion.div variants={itemVariants}>
        <Card className="text-center h-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <CardHeader className="p-0">
                <div className="relative aspect-square w-full bg-muted">
                    <Image 
                        src={avatar_url || `https://picsum.photos/seed/${name.replace(/\s+/g, '-')}/400/400`}
                        alt={name}
                        fill
                        className="object-cover"
                        data-ai-hint="person portrait"
                    />
                </div>
            </CardHeader>
            <CardContent className="p-4">
                <h3 className="font-bold text-lg">{name}</h3>
                <p className="text-sm text-primary">{role}</p>
            </CardContent>
        </Card>
    </motion.div>
);

const TeamSkeleton = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
        {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="h-full">
                <Skeleton className="w-full aspect-square" />
                <CardContent className="p-4 space-y-2">
                    <Skeleton className="h-5 w-3/4 mx-auto" />
                    <Skeleton className="h-4 w-1/2 mx-auto" />
                </CardContent>
            </Card>
        ))}
    </div>
)

export function TeamSection() {
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
    const [advisors, setAdvisors] = useState<TeamMember[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const { members, advisors } = await getTeamData();
            setTeamMembers(members);
            setAdvisors(advisors);
            setLoading(false);
        }
        fetchData();
    }, []);

  return (
    <section className="py-16 lg:py-24 bg-background">
      <motion.div 
        className="container mx-auto px-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        <motion.div className="text-center mb-12" variants={itemVariants}>
          <h2 className="text-4xl font-bold font-headline">Meet Our Team</h2>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">The dedicated individuals steering the Sanvedana mission forward.</p>
        </motion.div>

        {loading ? <TeamSkeleton /> : (
            <motion.div
                variants={containerVariants}
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 mb-16"
            >
                {teamMembers.map((member) => (
                    <TeamMemberCard key={member.id} {...member} />
                ))}
            </motion.div>
        )}

        <motion.div className="text-center my-12" variants={itemVariants}>
            <h2 className="text-3xl font-bold font-headline">Our Advisors</h2>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">Guiding our path with their invaluable wisdom and experience.</p>
        </motion.div>

        {loading ? <TeamSkeleton /> : (
            <motion.div
                variants={containerVariants}
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8"
            >
                {advisors.map((advisor) => (
                    <TeamMemberCard key={advisor.id} {...advisor} />
                ))}
            </motion.div>
        )}

      </motion.div>
    </section>
  );
}
