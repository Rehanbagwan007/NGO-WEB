
'use client';

import { useState } from 'react';
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
import { addHeroBannerAction, deleteHeroBannerAction } from './actions';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';

type HeroBanner = {
    id: string;
    image_url: string;
    alt_text: string | null;
};

const formSchema = z.object({
    image: z.custom<FileList>().refine(files => files?.length === 1, 'An image is required.'),
    altText: z.string().min(1, 'Alt text is required.'),
});

type FormValues = z.infer<typeof formSchema>;

async function getHeroBanners(): Promise<HeroBanner[]> {
    const supabase = createClient();
    const { data, error } = await supabase.from('hero_banners').select('*').order('created_at', { ascending: false });
    if (error) {
        console.error("Error fetching hero banners:", error);
        return [];
    }
    return data;
}

export default function WebsiteSettingsPage() {
    const [banners, setBanners] = useState<HeroBanner[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const { toast } = useToast();

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            altText: '',
        },
    });

    const fetchBanners = async () => {
        setLoading(true);
        const fetchedBanners = await getHeroBanners();
        setBanners(fetchedBanners);
        setLoading(false);
    };

    useState(() => {
        fetchBanners();
    });

    const onSubmit: SubmitHandler<FormValues> = async (values) => {
        setIsSubmitting(true);
        const formData = new FormData();
        formData.append('image', values.image[0]);
        formData.append('altText', values.altText);

        const result = await addHeroBannerAction(formData);

        if (result.success) {
            toast({ title: 'Success', description: 'Hero banner added successfully.' });
            form.reset();
            setPreview(null);
            fetchBanners();
        } else {
            toast({ variant: 'destructive', title: 'Error', description: result.error });
        }
        setIsSubmitting(false);
    };

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
    
     const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            form.setValue('image', e.target.files as FileList);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-lg font-semibold md:text-2xl">Website Settings</h1>

            <Card>
                <CardHeader>
                    <CardTitle>Hero Section Banners</CardTitle>
                    <CardDescription>
                        Manage the images that appear in the auto-scrolling hero carousel on the homepage.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-4 border rounded-lg">
                             <FormField
                                control={form.control}
                                name="image"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>New Banner Image</FormLabel>
                                        <FormControl>
                                            <div className="flex justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 px-6 py-10 text-center">
                                                <div className="text-center">
                                                {preview ? (
                                                    <div className="relative w-48 h-24 mx-auto">
                                                        <Image src={preview} alt="Preview" fill className="object-contain rounded-md" />
                                                         <Button
                                                            type="button" variant="destructive" size="icon"
                                                            className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                                                            onClick={() => {
                                                                setPreview(null);
                                                                form.resetField("image");
                                                            }}
                                                        ><X className="h-4 w-4"/></Button>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
                                                        <div className="mt-4 flex text-sm leading-6 text-muted-foreground">
                                                            <label htmlFor="image-upload" className="relative cursor-pointer rounded-md font-semibold text-primary focus-within:outline-none hover:text-primary/80">
                                                                <span>Click to upload</span>
                                                                <input id="image-upload" type="file" className="sr-only" accept="image/*" onChange={handleFileChange} />
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
                            
                            <FormField
                                control={form.control}
                                name="altText"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Image Description (Alt Text)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., Children learning in a sunlit classroom" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            Important for accessibility and SEO.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Add Banner
                            </Button>
                        </form>
                    </Form>

                    <div>
                        <h3 className="text-md font-medium mb-4">Current Banners</h3>
                        {loading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div className="aspect-video bg-muted rounded-lg animate-pulse"></div>
                                <div className="aspect-video bg-muted rounded-lg animate-pulse"></div>
                                <div className="aspect-video bg-muted rounded-lg animate-pulse"></div>
                            </div>
                        ) : banners.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {banners.map((banner) => (
                                    <div key={banner.id} className="relative group">
                                        <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                                            <Image src={banner.image_url} alt={banner.alt_text || ''} fill className="object-cover" />
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-1 truncate" title={banner.alt_text || ''}>{banner.alt_text}</p>
                                        <Button
                                            variant="destructive"
                                            size="icon"
                                            className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={() => handleDelete(banner.id)}
                                        >
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
        </div>
    );
}
