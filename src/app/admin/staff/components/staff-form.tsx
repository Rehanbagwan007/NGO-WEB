
'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, UploadCloud, X } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import type { TeamMember } from '@/lib/types';
import { updateStaffMemberAction } from '../actions';
import { cn } from '@/lib/utils';


const formSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters.'),
  role: z.string().min(3, 'Role must be at least 3 characters.'),
  avatar: z.custom<FileList>().optional(),
});

type StaffFormValues = z.infer<typeof formSchema>;


export function StaffForm({ member }: { member: TeamMember }) {
  const [loading, setLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(member.avatar_url);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<StaffFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: member.name || '',
      role: member.role || '',
    },
  });
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue('avatar', e.target.files as FileList);
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  async function onSubmit(values: StaffFormValues) {
    setLoading(true);
    toast({ title: "Updating staff member...", description: "Please wait." });
    
    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('role', values.role);
    if (values.avatar && values.avatar.length > 0) {
        formData.append('avatar', values.avatar[0]);
    }

    try {
        const result = await updateStaffMemberAction(member.id, formData);
        
        if (result.success) {
            toast({
                title: `Member Updated!`,
                description: `${values.name} has been successfully saved.`,
            });
            router.push('/admin/staff');
            router.refresh();
        } else {
            throw new Error(result.error || `Failed to update member.`);
        }

    } catch (error) {
        toast({
            variant: 'destructive',
            title: `Error Updating Member`,
            description: (error as Error).message || 'An unexpected error occurred. Please try again.',
        });
    } finally {
        setLoading(false);
    }
  }

  return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4">
             <Card>
                <CardHeader>
                    <CardTitle>Member Details</CardTitle>
                    <CardDescription>Update the name, role, and photo for this team member.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <FormField control={form.control} name="name" render={({ field }) => ( <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="e.g., Shailesh Vyas" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="role" render={({ field }) => ( <FormItem><FormLabel>Role</FormLabel><FormControl><Input placeholder="e.g., President" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField
                        control={form.control}
                        name="avatar"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Profile Photo</FormLabel>
                                <div className="flex items-center gap-4">
                                    {avatarPreview ? (
                                        <Image src={avatarPreview} alt="Avatar preview" width={80} height={80} className="rounded-full aspect-square object-cover" />
                                    ) : (
                                        <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                                            <span>No Image</span>
                                        </div>
                                    )}
                                    <FormControl>
                                        <Input 
                                            type="file" 
                                            className="text-sm max-w-xs" 
                                            accept="image/*" 
                                            onChange={handleFileChange}
                                        />
                                    </FormControl>
                                </div>
                                <FormDescription>Upload a new square photo for the team member. It will be stored securely.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                     <div className="flex justify-end gap-2 pt-4">
                      <Button type="button" variant="ghost" onClick={() => router.back()} disabled={loading}>Cancel</Button>
                      <Button type="submit" disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {loading ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </div>
                </CardContent>
             </Card>
        </form>
      </Form>
  );
}

