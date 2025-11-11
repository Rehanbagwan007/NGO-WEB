
'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, ControllerRenderProps } from 'react-hook-form';
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar as CalendarIcon, Loader2, UploadCloud, X, File as FileIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { createEventAction } from './actions';


const socialPlatforms = [
    { id: 'facebook', label: 'Facebook' },
    { id: 'instagram', label: 'Instagram' },
] as const;

const formSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters.'),
  description: z.string().min(10, 'Description must be at least 10 characters.'),
  date: z.date({
    required_error: 'A date for the event is required.',
  }),
  address: z.string().min(3, 'Address is required.'),
  city: z.string().min(2, 'City is required.'),
  state: z.string().min(2, 'State is required.'),
  zipCode: z.string().min(5, 'Zip code is required.'),
  bannerImage: z.custom<FileList>().refine(files => files?.length > 0, 'Banner image is required.'),
  galleryMedia: z.custom<FileList>().optional(),
  status: z.enum(['Draft', 'Published']),
  socialPlatforms: z.array(z.string()).optional(),
  imageHint: z.string().optional(),
});

type CreateEventFormValues = z.infer<typeof formSchema>;

interface MediaPreview {
    file: File;
    preview: string;
    type: 'image' | 'document';
}

function MediaDropzone({
  field,
  setPreviews,
  multiple,
}: {
  field: Omit<ControllerRenderProps<CreateEventFormValues, any>, 'value'> & { value: FileList | undefined };
  setPreviews: (previews: MediaPreview[] | ((prev: MediaPreview[]) => MediaPreview[])) => void;
  multiple: boolean;
}) {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (files: FileList | null) => {
    if (files && files.length > 0) {
      const newFiles = Array.from(files);
      const newPreviews: MediaPreview[] = [];
      let filesRead = 0;

      newFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newPreviews.push({
            file,
            preview: reader.result as string,
            type: file.type.startsWith('image/') ? 'image' : 'document',
          });
          filesRead++;
          if (filesRead === newFiles.length) {
             if (multiple) {
                setPreviews((prev) => [...(prev || []), ...newPreviews]);
              } else {
                setPreviews(newPreviews);
              }
          }
        };
        reader.readAsDataURL(file);
      });
      
      const dataTransfer = new DataTransfer();
      if (multiple && field.value) {
        Array.from(field.value).forEach(file => dataTransfer.items.add(file));
      }
      newFiles.forEach(file => dataTransfer.items.add(file));
      field.onChange(dataTransfer.files);
    }
  };

  const onDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };
  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault(); 
  };
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileChange(e.dataTransfer.files);
  };

  return (
    <div
      className={cn(
        'flex justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 px-6 py-10 text-center',
        isDragging && 'border-primary bg-primary/10'
      )}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <div className="text-center">
        <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
        <div className="mt-4 flex text-sm leading-6 text-muted-foreground">
          <label
            htmlFor={field.name}
            className="relative cursor-pointer rounded-md font-semibold text-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 hover:text-primary/80"
          >
            <span>Click to upload</span>
            <input
              id={field.name}
              name={field.name}
              type="file"
              className="sr-only"
              multiple={multiple}
              onChange={(e) => handleFileChange(e.target.files)}
              accept="image/*,application/pdf"
            />
          </label>
          <p className="pl-1">or drag and drop</p>
        </div>
        <p className="text-xs leading-5 text-muted-foreground">PNG, JPG, GIF up to 10MB. PDF files also accepted.</p>
      </div>
    </div>
  );
}


export default function NewEventPage() {
  const [loading, setLoading] = useState(false);
  const [bannerPreview, setBannerPreview] = useState<MediaPreview[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<MediaPreview[]>([]);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<CreateEventFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      status: 'Draft',
      socialPlatforms: ['facebook', 'instagram'],
      imageHint: '',
    },
  });

  const removePreview = (list: MediaPreview[], setList: (list: MediaPreview[]) => void, fileToRemove: File, fieldName: 'bannerImage' | 'galleryMedia') => {
    const newList = list.filter(item => item.file !== fileToRemove);
    setList(newList);
    
    const currentFormValue = form.getValues(fieldName);
    if (currentFormValue) {
        const dataTransfer = new DataTransfer();
        Array.from(currentFormValue).filter(f => f !== fileToRemove).forEach(file => dataTransfer.items.add(file));
        form.setValue(fieldName, dataTransfer.files, { shouldValidate: true });
    }
  };


  async function onSubmit(values: CreateEventFormValues) {
    setLoading(true);
    toast({ title: "Creating event...", description: "Please wait. This is a simulation." });

    try {
        // Simulate file upload delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Since we removed Firebase, we'll use a placeholder URL for the banner
        const bannerImageUrl = bannerPreview[0]?.preview || 'https://picsum.photos/seed/placeholder/1200/400';

        // Prepare data for server action
        const actionArgs = {
            ...values,
            date: values.date.toISOString(),
            location: `${values.address}, ${values.city}, ${values.state} ${values.zipCode}`,
            bannerImage: bannerImageUrl,
            gallery: galleryPreviews.map(p => ({ url: p.preview })),
            socialPlatforms: values.socialPlatforms || [],
        };

        // Call server action
        const result = await createEventAction(actionArgs);
        
        if (result.success) {
            toast({
                title: 'Event Created! (Simulated)',
                description: `${result.title} has been successfully created.`,
            });
            router.push('/admin/events');
        } else {
            throw new Error(result.error || 'Failed to create event.');
        }

    } catch (error) {
        console.error("Error in onSubmit: ", error);
        toast({
            variant: 'destructive',
            title: 'Error Creating Event',
            description: (error as Error).message || 'An unexpected error occurred. Please try again.',
        });
    } finally {
        setLoading(false);
    }
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Create New Event</h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
               <Card>
                <CardHeader>
                    <CardTitle>Event Details</CardTitle>
                    <CardDescription>Provide the core information about the event.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
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
                </CardContent>
               </Card>

              <Card>
                 <CardHeader>
                    <CardTitle>Location</CardTitle>
                 </CardHeader>
                 <CardContent className="space-y-6">
                    <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Address</FormLabel>
                            <FormControl>
                                <Input placeholder="123 Main St" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <FormField
                            control={form.control}
                            name="city"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>City</FormLabel>
                                <FormControl>
                                    <Input placeholder="Metropolis" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="state"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>State</FormLabel>
                                <FormControl>
                                    <Input placeholder="CA" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="zipCode"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Zip Code</FormLabel>
                                <FormControl>
                                    <Input placeholder="90210" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                 </CardContent>
              </Card>

              <Card>
                 <CardHeader>
                    <CardTitle>Media</CardTitle>
                    <CardDescription>Upload a banner image and gallery items for the event.</CardDescription>
                 </CardHeader>
                 <CardContent className="space-y-6">
                    <div>
                        <FormLabel>Banner Image</FormLabel>
                        <FormField
                            control={form.control}
                            name="bannerImage"
                            render={({ field }) => (
                                <FormItem className="mt-2">
                                <FormControl>
                                    <MediaDropzone field={field} setPreviews={setBannerPreview} multiple={false} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        {bannerPreview.length > 0 && (
                             <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {bannerPreview.map((p, index) => (
                                    <div key={index} className="relative group aspect-square">
                                        <Image src={p.preview} alt="Banner preview" fill className="object-cover rounded-md" />
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="icon"
                                            className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={() => removePreview(bannerPreview, setBannerPreview, p.file, 'bannerImage')}
                                        ><X className="h-4 w-4"/></Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <FormField
                        control={form.control}
                        name="imageHint"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Banner Image AI Hint</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g. children playing" {...field} />
                            </FormControl>
                            <FormDescription>A hint for AI to find better stock photos in the future. (e.g., "children disability sports")</FormDescription>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                     <div>
                        <FormLabel>Gallery Images & Documents</FormLabel>
                        <FormField
                            control={form.control}
                            name="galleryMedia"
                            render={({ field }) => (
                                <FormItem className="mt-2">
                                <FormControl>
                                    <MediaDropzone field={field} setPreviews={setGalleryPreviews} multiple={true} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        {galleryPreviews.length > 0 && (
                            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {galleryPreviews.map((p, index) => (
                                    <div key={index} className="relative group aspect-square">
                                        {p.type === 'image' ? (
                                             <Image src={p.preview} alt={`Gallery preview ${index + 1}`} fill className="object-cover rounded-md" />
                                        ) : (
                                            <div className="flex flex-col items-center justify-center bg-muted rounded-md h-full">
                                                <FileIcon className="w-10 h-10 text-muted-foreground"/>
                                                <span className="text-xs text-muted-foreground mt-2 px-2 truncate">{p.file.name}</span>
                                            </div>
                                        )}
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="icon"
                                            className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={() => removePreview(galleryPreviews, setGalleryPreviews, p.file, 'galleryMedia')}
                                        ><X className="h-4 w-4"/></Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                 </CardContent>
              </Card>

            </div>

            {/* Right Column */}
            <div className="lg:col-span-1 space-y-8">
               <Card>
                <CardHeader>
                    <CardTitle>Date & Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
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
                        name="status"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Status</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a status" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                <SelectItem value="Draft">Draft</SelectItem>
                                <SelectItem value="Published">Published</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                </CardContent>
               </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Sharing</CardTitle>
                        <CardDescription>Select where to share this event upon creation.</CardDescription>
                    </CardHeader>
                    <CardContent>
                         <FormField
                            control={form.control}
                            name="socialPlatforms"
                            render={() => (
                                <FormItem>
                                {socialPlatforms.map((item) => (
                                    <FormField
                                    key={item.id}
                                    control={form.control}
                                    name="socialPlatforms"
                                    render={({ field }) => {
                                        return (
                                        <FormItem
                                            key={item.id}
                                            className="flex flex-row items-start space-x-3 space-y-0"
                                        >
                                            <FormControl>
                                            <Checkbox
                                                checked={field.value?.includes(item.id)}
                                                onCheckedChange={(checked) => {
                                                return checked
                                                    ? field.onChange([...(field.value || []), item.id])
                                                    : field.onChange(
                                                        field.value?.filter(
                                                        (value) => value !== item.id
                                                        )
                                                    )
                                                }}
                                            />
                                            </FormControl>
                                            <FormLabel className="font-normal">
                                            {item.label}
                                            </FormLabel>
                                        </FormItem>
                                        )
                                    }}
                                    />
                                ))}
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                    </CardContent>
                </Card>
               <div className="flex justify-end gap-2">
                 <Button type="button" variant="ghost" onClick={() => router.back()} disabled={loading}>Cancel</Button>
                 <Button type="submit" disabled={loading}>
                   {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                   {loading ? 'Creating...' : 'Create Event'}
                 </Button>
               </div>
            </div>
          </div>
        </form>
      </Form>
    </>
  );
}
