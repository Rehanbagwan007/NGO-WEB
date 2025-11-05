import Image from 'next/image';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Facebook, Instagram, Twitter } from 'lucide-react';

export default function SocialMediaPage() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'social-hero');

  return (
    <main className="flex flex-1 flex-col">
      <div className="relative h-48 w-full">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            fill
            className="object-cover"
            data-ai-hint={heroImage.imageHint}
          />
        )}
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <h1 className="text-4xl font-headline font-bold text-white">
            Social Media Center
          </h1>
        </div>
      </div>

      <div className="flex-1 p-4 lg:p-6">
        <Tabs defaultValue="compose">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="compose">Compose</TabsTrigger>
            <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
            <TabsTrigger value="published">Published</TabsTrigger>
          </TabsList>
          <TabsContent value="compose" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Create a new post</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid w-full gap-2">
                  <Label htmlFor="post-content">Post Content</Label>
                  <Textarea
                    id="post-content"
                    placeholder="What's on your mind? Share an update with your followers..."
                    className="min-h-[150px]"
                  />
                </div>
                <div className="space-y-4">
                  <Label>Platforms</Label>
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="facebook" />
                      <Label
                        htmlFor="facebook"
                        className="flex items-center gap-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-facebook"
                      >
                        <Facebook className="h-5 w-5" /> Facebook
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="instagram" />
                      <Label
                        htmlFor="instagram"
                        className="flex items-center gap-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                         <span className="p-1 rounded-md instagram-gradient text-white"><Instagram className="h-3 w-3" /></span>
                         Instagram
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="twitter" />
                       <Label
                        htmlFor="twitter"
                        className="flex items-center gap-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-[#1DA1F2]"
                      >
                        <Twitter className="h-5 w-5" /> Twitter
                      </Label>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline">Schedule Post</Button>
                  <Button>Post Now</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="scheduled">
            <Card>
              <CardHeader>
                <CardTitle>Scheduled Posts</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center h-64 text-center">
                 <p className="text-muted-foreground">No posts scheduled.</p>
                 <Button variant="link" className="mt-2">Schedule one now</Button>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="published">
             <Card>
              <CardHeader>
                <CardTitle>Published Posts</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center h-64 text-center">
                 <p className="text-muted-foreground">No posts published yet.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
