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
  donorName: string;
  amount: number;
  date: string;
  status: 'Completed' | 'Pending' | 'Failed';
};

export type Event = {
  id: string;
  title: string;
  date: string; 
  location: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  description: string;
  bannerimage: string;
  storagePath?: string;
  imagehint: string;
  gallery: { url: string; path?: string; hint?: string }[];
  status: 'Draft' | 'Published';
  createdAt?: string; 
  type?: 'Upcoming' | 'Past';
};
