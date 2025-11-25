
'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const teamMembers = [
    { name: 'Shailesh Vyas', role: 'President', avatarId: 'vyas-shailesh' },
    { name: 'Mahendra Yargattikar', role: 'Vice President', avatarId: 'yargattikar-mahendra' },
    { name: 'Sau. Anuja Patil', role: 'Secretary', avatarId: 'patil-anuja' },
    { name: 'Sau. Sunita Vasavade', role: 'Treasurer', avatarId: 'vasavade-sunita' },
    { name: 'Dilip Koshti', role: 'Joint Secretary', avatarId: 'koshti-dilip' },
    { name: 'Sau. Sunita Bajaj', role: 'Joint Secretary', avatarId: 'bajaj-sunita' },
    { name: 'Arun Kumbhar', role: 'Member', avatarId: 'kumbhar-arun' },
];

const advisors = [
    { name: 'Sau. Vandana Kelkar', role: 'Advisor', avatarId: 'kelkar-vandana' },
    { name: 'Sau. Archana Chapalgaonkar', role: 'Advisor', avatarId: 'chapalgaonkar-archana' },
    { name: 'Ashif Shaikh', role: 'Advisor', avatarId: 'shaikh-ashif' },
    { name: 'Shri. Ramesh Magdum', role: 'Advisor', avatarId: 'magdum-ramesh' },
    { name: 'Sanjay Bhoje', role: 'Advisor', avatarId: 'bhoje-sanjay' },
    { name: 'Jitendra Shah', role: 'Advisor', avatarId: 'shah-jitendra' },
    { name: 'Vijay Bajaj', role: 'Advisor', avatarId: 'bajaj-vijay' },
    { name: 'Avinash Patil', role: 'Advisor', avatarId: 'patil-avinash' },
]

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

const TeamMemberCard = ({ name, role, avatarId }: { name: string, role: string, avatarId: string }) => (
    <motion.div variants={itemVariants}>
        <Card className="text-center h-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <CardHeader className="p-0">
                <div className="relative aspect-square w-full bg-muted">
                    <Image 
                        src={`https://picsum.photos/seed/${avatarId}/400/400`}
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

export function TeamSection() {
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

        <motion.div
            variants={containerVariants}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 mb-16"
        >
            {teamMembers.map((member) => (
                <TeamMemberCard key={member.name} {...member} />
            ))}
        </motion.div>

        <motion.div className="text-center mb-12" variants={itemVariants}>
            <h2 className="text-3xl font-bold font-headline">Our Advisors</h2>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">Guiding our path with their invaluable wisdom and experience.</p>
        </motion.div>

        <motion.div
            variants={containerVariants}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8"
        >
            {advisors.map((advisor) => (
                <TeamMemberCard key={advisor.name} {...advisor} />
            ))}
        </motion.div>

      </motion.div>
    </section>
  );
}
