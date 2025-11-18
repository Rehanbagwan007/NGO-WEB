
'use client';

import { useState, useEffect, useTransition } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, Trash2, UploadCloud, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { addHeroBannerAction, deleteHeroBannerAction, updateWebsiteContentAction, updateMissionImageAction } from './actions';
import { createClient } from '@/lib/supabase/client';
import type { WebsiteContent } from '@/lib/types';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';

type HeroBanner = {
    id: string;
    image_url: string;
    alt_text: string | null;
};

const heroFormSchema = z.object({
    image: z.custom<FileList>().refine(files => files?.length === 1, 'An image is required.'),
    altText: z.string().min(1, 'Alt text is required.'),
});

const missionImageSchema = z.object({
    image: z.custom<FileList>().refine(files => files?.length === 1, 'An image is required.'),
});

type HeroFormValues = z.infer<typeof heroFormSchema>;
type MissionImageFormValues = z.infer<typeof missionImageSchema>;

const contentFormSchema = z.object({
  mission_title: z.string().min(3, 'Title is required.'),
  mission_p1: z.string().min(10, 'Paragraph 1 is required.'),
  mission_p2: z.string().min(10, 'Paragraph 2 is required.'),
  mission_image_url: z.string().optional(),
  footer_about: z.string().min(10, 'Footer about text is required.'),
  footer_copyright: z.string().min(5, 'Copyright text is required.'),
  social_facebook: z.string().url().or(z.literal('')),
  social_instagram: z.string().url().or(z.literal('')),
  social_twitter: z.string().url().or(z.literal('')),
});

type ContentFormValues = z.infer<typeof contentFormSchema>;


async function getSupabaseData() {
    const supabase = createClient();
    const { data: banners, error: bannersError } = await supabase.from('hero_banners').select('*').order('created_at', { ascending: false });
    if (bannersError) console.error("Error fetching hero banners:", bannersError);

    const { data: content, error: contentError } = await supabase.from('website_content').select('*');
    if (contentError) console.error("Error fetching website content:", contentError);

    const contentAsObject = content?.reduce((acc, item) => {
        acc[item.id as keyof WebsiteContent] = item.content || '';
        return acc;
    }, {} as WebsiteContent) || {};

    return { banners: banners || [], content: contentAsObject };
}


export default function WebsiteSettingsPage() {
    const [banners, setBanners] = useState<HeroBanner[]>([]);
    const [loading, setLoading] = useState(true);
    const [isHeroSubmitting, setIsHeroSubmitting] = useState(false);
    const [isContentSubmitting, setIsContentSubmitting] = useState(false);
    const [isMissionImageSubmitting, setIsMissionImageSubmitting] = useState(false);
    const [heroPreview, setHeroPreview] = useState<string | null>(null);
    const [missionImagePreview, setMissionImagePreview] = useState<string | null>(null);
    const { toast } = useToast();

    const heroForm = useForm<HeroFormValues>({
        resolver: zodResolver(heroFormSchema),
        defaultValues: { altText: '' },
    });
    
    const missionImageForm = useForm<MissionImageFormValues>({
        resolver: zodResolver(missionImageSchema),
    });

    const contentForm = useForm<ContentFormValues>({
        resolver: zodResolver(contentFormSchema),
    });

    const fetchAndSetData = async () => {
        setLoading(true);
        const { banners, content } = await getSupabaseData();
        setBanners(banners);
        contentForm.reset(content);
        setMissionImagePreview(content.mission_image_url || null);
        setLoading(false);
    };

    useEffect(() => {
        fetchAndSetData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    const onHeroSubmit: SubmitHandler<HeroFormValues> = async (values) => {
        setIsHeroSubmitting(true);
        const formData = new FormData();
        formData.append('image', values.image[0]);
        formData.append('altText', values.altText);

        const result = await addHeroBannerAction(formData);

        if (result.success) {
            toast({ title: 'Success', description: 'Hero banner added successfully.' });
            heroForm.reset();
            setHeroPreview(null);
            fetchAndSetData();
        } else {
            toast({ variant: 'destructive', title: 'Error', description: result.error });
        }
        setIsHeroSubmitting(false);
    };
    
    const onMissionImageSubmit: SubmitHandler<MissionImageFormValues> = async (values) => {
        setIsMissionImageSubmitting(true);
        const formData = new FormData();
        formData.append('image', values.image[0]);

        const result = await updateMissionImageAction(formData);
        if (result.success) {
            toast({ title: 'Success', description: 'Mission image updated.' });
             fetchAndSetData(); // Refetch data to show new image
        } else {
            toast({ variant: 'destructive', title: 'Error', description: result.error });
        }
        setIsMissionImageSubmitting(false);
    };

    const onContentSubmit: SubmitHandler<ContentFormValues> = async (values) => {
        setIsContentSubmitting(true);
        const result = await updateWebsiteContentAction(values);
        if (result.success) {
            toast({ title: 'Success', description: 'Website content updated successfully.' });
        } else {
            toast({ variant: 'destructive', title: 'Error', description: result.error });
        }
        setIsContentSubmitting(false);
    }

    const handleDelete = async (id: string) => {
        const originalBanners = [...banners];
        setBanners(banners.filter(b => b.id !== id));
        const result = await deleteHeroBannerAction(id);
        if (result.success) {
            toast({ title: 'Success', description: 'Hero banner deleted.' });
        } else {
            toast({ variant: 'destructive', title: 'Error', description: result.error });
            setBanners(originalBanners);
        }
    };
    
     const handleHeroFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            heroForm.setValue('image', e.target.files as FileList);
            const reader = new FileReader();
            reader.onloadend = () => setHeroPreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };
    
    const handleMissionImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            missionImageForm.setValue('image', e.target.files as FileList);
            const reader = new FileReader();
            reader.onloadend = () => setMissionImagePreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-lg font-semibold md:text-2xl">Website Settings</h1>

            {loading ? (
                <div className="space-y-6">
                    <Card><CardHeader><Skeleton className="h-6 w-1/4" /></CardHeader><CardContent><Skeleton className="h-40 w-full" /></CardContent></Card>
                    <Card><CardHeader><Skeleton className="h-6 w-1/4" /></CardHeader><CardContent><Skeleton className="h-40 w-full" /></CardContent></Card>
                    <Card><CardHeader><Skeleton className="h-6 w-1/4" /></CardHeader><CardContent><Skeleton className="h-40 w-full" /></CardContent></Card>
                </div>
            ) : (
             <>
                <Card>
                    <CardHeader>
                        <CardTitle>Homepage Content</CardTitle>
                        <CardDescription>Edit the text content and images for the homepage sections.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...contentForm}>
                            <form onSubmit={contentForm.handleSubmit(onContentSubmit)} className="space-y-8">
                                <h3 className="text-lg font-medium border-b pb-2">Our Mission Section</h3>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <FormField control={contentForm.control} name="mission_title" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Title</FormLabel>
                                                <FormControl><Input {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}/>
                                        <FormField control={contentForm.control} name="mission_p1" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Paragraph 1</FormLabel>
                                                <FormControl><Textarea {...field} className="min-h-24" /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}/>
                                         <FormField control={contentForm.control} name="mission_p2" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Paragraph 2</FormLabel>
                                                <FormControl><Textarea {...field} className="min-h-24" /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}/>
                                    </div>
                                    <div className="space-y-2">
                                        <FormLabel>Mission Section Image</FormLabel>
                                        {missionImagePreview && (
                                            <div className="relative w-full aspect-video rounded-md overflow-hidden">
                                                <Image src={missionImagePreview} alt="Mission section preview" fill className="object-cover" />
                                            </div>
                                        )}
                                        <Form {...missionImageForm}>
                                            <form onSubmit={missionImageForm.handleSubmit(onMissionImageSubmit)} className="space-y-4">
                                                <FormField control={missionImageForm.control} name="image" render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl><Input type="file" className="text-sm" accept="image/*" onChange={handleMissionImageFileChange} /></FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}/>
                                                <Button size="sm" type="submit" disabled={isMissionImageSubmitting}>
                                                    {isMissionImageSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                                    Update Image
                                                </Button>
                                            </form>
                                        </Form>
                                    </div>
                                </div>
                                
                                <h3 className="text-lg font-medium border-b pb-2 pt-4">Footer Content</h3>
                                <FormField control={contentForm.control} name="footer_about" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Footer "About" Text</FormLabel>
                                        <FormControl><Input {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}/>
                                 <FormField control={contentForm.control} name="footer_copyright" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Copyright Text</FormLabel>
                                        <FormControl><Input {...field} /></FormControl>
                                        <FormDescription>Use `{'{year}'}` to automatically insert the current year.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}/>
                                 <FormField control={contentForm.control} name="social_facebook" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Facebook URL</FormLabel>
                                        <FormControl><Input placeholder="https://facebook.com/your-page" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}/>
                                 <FormField control={contentForm.control} name="social_instagram" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Instagram URL</FormLabel>
                                        <FormControl><Input placeholder="https://instagram.com/your-profile" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}/>
                                 <FormField control={contentForm.control} name="social_twitter" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>X (Twitter) URL</FormLabel>
                                        <FormControl><Input placeholder="https://x.com/your-handle" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}/>

                                <Button type="submit" disabled={isContentSubmitting}>
                                    {isContentSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Save Content Changes
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Hero Section Banners</CardTitle>
                        <CardDescription>Manage the images that appear in the auto-scrolling hero carousel on the homepage.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8">
                        <Form {...heroForm}>
                            <form onSubmit={heroForm.handleSubmit(onHeroSubmit)} className="space-y-4 p-4 border rounded-lg">
                                 <FormField
                                    control={heroForm.control}
                                    name="image"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>New Banner Image</FormLabel>
                                            <FormControl>
                                                <div className="flex justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 px-6 py-10 text-center">
                                                    <div className="text-center">
                                                    {heroPreview ? (
                                                        <div className="relative w-48 h-24 mx-auto">
                                                            <Image src={heroPreview} alt="Preview" fill className="object-contain rounded-md" />
                                                             <Button type="button" variant="destructive" size="icon" className="absolute -top-2 -right-2 h-6 w-6 rounded-full" onClick={() => { setHeroPreview(null); heroForm.resetField("image");}}>
                                                                <X className="h-4 w-4"/>
                                                             </Button>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
                                                            <div className="mt-4 flex text-sm leading-6 text-muted-foreground">
                                                                <label htmlFor="image-upload" className="relative cursor-pointer rounded-md font-semibold text-primary focus-within:outline-none hover:text-primary/80">
                                                                    <span>Click to upload</span>
                                                                    <input id="image-upload" type="file" className="sr-only" accept="image/*" onChange={handleHeroFileChange} />
                                                                </label>
                                                            </div>
                                                            <p className="text-xs leading-5 text-muted-foreground">PNG, JPG, GIF up to 10MB</p>
                                                        </>
                                                    )}
                                                    </div>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                
                                <FormField control={heroForm.control} name="altText" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Image Description (Alt Text)</FormLabel>
                                        <FormControl><Input placeholder="e.g., Children learning in a sunlit classroom" {...field} /></FormControl>
                                        <FormDescription>Important for accessibility and SEO.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}/>

                                <Button type="submit" disabled={isHeroSubmitting}>
                                    {isHeroSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Add Banner
                                </Button>
                            </form>
                        </Form>

                        <div>
                            <h3 className="text-md font-medium mb-4">Current Banners</h3>
                            {banners.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {banners.map((banner) => (
                                        <div key={banner.id} className="relative group">
                                            <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                                                <Image src={banner.image_url} alt={banner.alt_text || ''} fill className="object-cover" />
                                            </div>
                                            <p className="text-xs text-muted-foreground mt-1 truncate" title={banner.alt_text || ''}>{banner.alt_text}</p>
                                            <Button variant="destructive" size="icon" className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handleDelete(banner.id)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center text-muted-foreground py-8">No banners have been added yet.</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </>
            )}
        </div>
    );
}
