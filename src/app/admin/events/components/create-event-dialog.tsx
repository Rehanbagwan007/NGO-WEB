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
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Calendar as CalendarIcon, Loader2 } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import type { Event } from '@/lib/types';
import Image from 'next/image';

const formSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters.'),
  description: z.string().min(10, 'Description must be at least 10 characters.'),
  date: z.date({
    required_error: 'A date for the event is required.',
  }),
  location: z.string().min(3, 'Location is required.'),
  bannerImage: z.any().refine(files => files?.length > 0, 'Banner image is required.'),
  galleryImages: z.any().optional(),
  status: z.enum(['Draft', 'Published']),
  type: z.enum(['Upcoming', 'Past']),
});

type CreateEventFormValues = z.infer<typeof formSchema>;

interface CreateEventDialogProps {
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEventCreated: (event: CreateEventFormValues) => void;
}

export function CreateEventDialog({
  children,
  open,
  onOpenChange,
  onEventCreated,
}: CreateEventDialogProps) {
  const [loading, setLoading] = useState(false);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);

  const form = useForm<CreateEventFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      location: '',
      status: 'Draft',
      type: 'Upcoming',
    },
  });
  
  const handleBannerImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setBannerPreview(null);
    }
  };

  const handleGalleryImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newPreviews: string[] = [];
      const fileList = Array.from(files);
      
      let filesRead = 0;
      fileList.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
            newPreviews.push(reader.result as string);
            filesRead++;
            // This check ensures we only update state once all files are read
            if (filesRead === fileList.length) {
                setGalleryPreviews(newPreviews);
            }
        };
        reader.readAsDataURL(file);
      });
    } else {
      setGalleryPreviews([]);
    }
  };


  const resetFormState = () => {
    form.reset();
    setBannerPreview(null);
    setGalleryPreviews([]);
  }

  async function onSubmit(values: CreateEventFormValues) {
    setLoading(true);
    // In a real app, you'd upload the file and then save the form
    console.log('Form Submitted', values);
    const eventData = {
        ...values,
        bannerImage: values.bannerImage[0].name, // a real app would have the URL after upload
        galleryImages: values.galleryImages ? Array.from(values.galleryImages).map((file: any) => file.name) : [],
    };
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network request
    onEventCreated(eventData as any); // Casting as we are not uploading files
    setLoading(false);
    resetFormState();
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
        if (!isOpen) {
            resetFormState();
        }
        onOpenChange(isOpen);
    }}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Event</DialogTitle>
          <DialogDescription>
            Fill out the details for the new event. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 px-1">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Annual Charity Gala" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the event, its purpose, and what attendees can expect."
                      className="min-h-32"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                    <FormItem className="flex flex-col">
                    <FormLabel>Event Date</FormLabel>
                    <Popover>
                        <PopoverTrigger asChild>
                        <FormControl>
                            <Button
                            variant={'outline'}
                            className={cn(
                                'pl-3 text-left font-normal',
                                !field.value && 'text-muted-foreground'
                            )}
                            >
                            {field.value ? (
                                format(field.value, 'PPP')
                            ) : (
                                <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                        </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                                date < new Date(new Date().setHours(0,0,0,0))
                            }
                            initialFocus
                        />
                        </PopoverContent>
                    </Popover>
                    <FormMessage />
                    </FormItem>
                )}
                />
                 <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g., Grand Hyatt Ballroom" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
            </div>

            <FormField
              control={form.control}
              name="bannerImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Banner Image</FormLabel>
                  <FormControl>
                     <Input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => {
                            field.onChange(e.target.files);
                            handleBannerImageChange(e);
                        }}
                     />
                  </FormControl>
                   <FormDescription>
                    The main image for the event page.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {bannerPreview && (
                <div className="relative w-full h-64 rounded-md overflow-hidden border">
                    <Image src={bannerPreview} alt="Banner preview" fill style={{ objectFit: 'cover' }} />
                </div>
            )}
            
            <FormField
              control={form.control}
              name="galleryImages"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gallery Images</FormLabel>
                  <FormControl>
                     <Input 
                        type="file" 
                        accept="image/*"
                        multiple
                        onChange={(e) => {
                            field.onChange(e.target.files);
                            handleGalleryImagesChange(e);
                        }}
                     />
                  </FormControl>
                   <FormDescription>
                    Upload multiple images for the event gallery.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {galleryPreviews.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {galleryPreviews.map((src, index) => (
                        <div key={index} className="relative w-full h-32 rounded-md overflow-hidden border">
                            <Image src={src} alt={`Gallery preview ${index + 1}`} fill style={{ objectFit: 'cover' }} />
                        </div>
                    ))}
                </div>
            )}


            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                    <FormItem className="space-y-3">
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                        <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex space-x-4"
                        >
                        <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                            <RadioGroupItem value="Draft" />
                            </FormControl>
                            <FormLabel className="font-normal">Draft</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                            <RadioGroupItem value="Published" />
                            </FormControl>
                            <FormLabel className="font-normal">Published</FormLabel>
                        </FormItem>
                        </RadioGroup>
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                 <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                    <FormItem className="space-y-3">
                    <FormLabel>Type</FormLabel>
                    <FormControl>
                        <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex space-x-4"
                        >
                        <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                            <RadioGroupItem value="Upcoming" />
                            </FormControl>
                            <FormLabel className="font-normal">Upcoming</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                            <RadioGroupItem value="Past" />
                            </FormControl>
                            <FormLabel className="font-normal">Past</FormLabel>
                        </FormItem>
                        </RadioGroup>
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
            
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Event
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

    