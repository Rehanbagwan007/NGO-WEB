
import { createClient } from '@/lib/supabase/server';
import type { TeamMember } from '@/lib/types';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { StaffForm } from '../../components/staff-form';

async function getTeamMember(id: string): Promise<TeamMember | null> {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    const { data, error } = await supabase.from('team_members').select('*').eq('id', id).single();
    if (error) {
        console.error(`Error fetching team member ${id}:`, error);
        return null;
    }
    return data;
}

export default async function EditStaffPage({ params }: { params: { id: string } }) {
    const member = await getTeamMember(params.id);

    if (!member) {
        notFound();
    }

    return (
        <>
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold md:text-2xl">Edit Staff Member</h1>
            </div>
            <StaffForm member={member} />
        </>
    );
}
