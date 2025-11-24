
export type UserProfile = {
  id: string;
  email?: string;
  name?: string;
  avatar_url?: string;
};


export type Student = {
  id: string;
  name: string;
  avatar: string;
  email:string;
  status: 'Active' | 'Inactive' | 'On Hold';
  medicalNotes: string;
  dateOfBirth: string;
};

export type Staff = {
  id: string;
  name: string;
  avatar: string;
  email: string;
  role: 'Teacher' | 'Admin' | 'Therapist' | 'Volunteer';
  department: 'Academics' | 'Administration' | 'Therapy' | 'Support';
};

export type Donation = {
  id: string;
  name: string;
  email?: string;
  amount: number;
  date: string;
  status: 'Completed' | 'Pending' | 'Failed';
};

export type Event = {
  id: string;
  title: string;
  date: string; 
  location: string;
  description: string;
  bannerimage: string;
  imagehint?: string;
  gallery?: { url: string; path?: string; hint?: string }[];
  createdAt?: string; 
};

export type WebsiteContent = {
    mission_title: string;
    mission_p1: string;
    mission_p2: string;
    mission_image_url?: string;
    footer_about: string;
    footer_copyright: string;
    social_facebook: string;
    social_instagram: string;
    social_twitter: string;
};
