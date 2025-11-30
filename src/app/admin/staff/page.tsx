
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { createClient } from '@/lib/supabase/server';
import type { TeamMember } from '@/lib/types';
import { cookies } from 'next/headers';
import Image from 'next/image';
import Link from 'next/link';

async function getTeamData(): Promise<{
  members: TeamMember[];
  advisors: TeamMember[];
}> {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data, error } = await supabase
    .from('team_members')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching team members:', error);
    return { members: [], advisors: [] };
  }
  const members = data.filter((m) => m.type === 'member');
  const advisors = data.filter((m) => m.type === 'advisor');
  return { members, advisors };
}

const TeamTable = ({ title, members }: { title: string; members: TeamMember[] }) => (
    <Card>
        <CardHeader>
            <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className='w-[80px]'>Avatar</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead><span className="sr-only">Actions</span></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {members.length > 0 ? (
                        members.map(member => (
                            <TableRow key={member.id}>
                                <TableCell>
                                    <Image 
                                        src={member.avatar_url || `https://picsum.photos/seed/${member.id}/100/100`}
                                        alt={member.name}
                                        width={40}
                                        height={40}
                                        className="rounded-full"
                                    />
                                </TableCell>
                                <TableCell className="font-medium">{member.name}</TableCell>
                                <TableCell>{member.role}</TableCell>
                                <TableCell className="text-right">
                                    <Button asChild variant="outline" size="sm">
                                        <Link href={`/admin/staff/${member.id}/edit`}>Edit</Link>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={4} className="h-24 text-center">
                                No members found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </CardContent>
    </Card>
);

export default async function StaffPage() {
  const { members, advisors } = await getTeamData();

  return (
    <div className="space-y-6">
      <h1 className="text-lg font-semibold md:text-2xl">Staff Manager</h1>
      <TeamTable title="Core Team Members" members={members} />
      <TeamTable title="Advisors" members={advisors} />
    </div>
  );
}
