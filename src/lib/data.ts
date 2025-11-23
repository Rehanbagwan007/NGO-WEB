
import type { Student, Staff, Donation, Event } from './types';

export const students: Student[] = [
  {
    id: 'STU001',
    name: 'Rohan Sharma',
    avatar: 'https://picsum.photos/seed/STU001/100/100',
    email: 'rohan.sharma@example.com',
    status: 'Active',
    medicalNotes: 'Mild autism spectrum disorder. Benefits from visual aids and a structured routine.',
    dateOfBirth: '2010-05-15',
  },
  {
    id: 'STU002',
    name: 'Priya Patel',
    avatar: 'https://picsum.photos/seed/STU002/100/100',
    email: 'priya.patel@example.com',
    status: 'Active',
    medicalNotes: 'Down syndrome. Requires one-on-one attention for learning new tasks. Excels in music therapy.',
    dateOfBirth: '2012-02-20',
  },
  {
    id: 'STU003',
    name: 'Amit Singh',
    avatar: 'https://picsum.photos/seed/STU003/100/100',
    email: 'amit.singh@example.com',
    status: 'On Hold',
    medicalNotes: 'Cerebral palsy. Uses a wheelchair and a communication device. Currently on medical leave.',
    dateOfBirth: '2009-11-30',
  },
  {
    id: 'STU004',
    name: 'Sneha Gupta',
    avatar: 'https://picsum.photos/seed/STU004/100/100',
    email: 'sneha.gupta@example.com',
    status: 'Inactive',
    medicalNotes: 'ADHD. Has moved to a different city and discontinued the program.',
    dateOfBirth: '2011-08-12',
  },
  {
    id: 'STU005',
    name: 'Vikram Kumar',
    avatar: 'https://picsum.photos/seed/STU005/100/100',
    email: 'vikram.kumar@example.com',
    status: 'Active',
    medicalNotes: 'Dyslexia. Shows great improvement with specialized reading software and patient guidance.',
    dateOfBirth: '2013-03-25',
  },
];

export const staff: Staff[] = [
  {
    id: 'STF001',
    name: 'Anjali Verma',
    avatar: 'https://picsum.photos/seed/STF001/100/100',
    email: 'anjali.verma@sanvedana.org',
    role: 'Special Educator',
    department: 'Academics',
  },
  {
    id: 'STF002',
    name: 'Rajesh Kumar',
    avatar: 'https://picsum.photos/seed/STF002/100/100',
    email: 'rajesh.kumar@sanvedana.org',
    role: 'Admin Manager',
    department: 'Administration',
  },
  {
    id: 'STF003',
    name: 'Dr. Meena Desai',
    avatar: 'https://picsum.photos/seed/STF003/100/100',
    email: 'meena.desai@sanvedana.org',
    role: 'Occupational Therapist',
    department: 'Therapy',
  },
  {
    id: 'STF004',
    name: 'Suresh Iyer',
    avatar: 'https://picsum.photos/seed/STF004/100/100',
    email: 'suresh.iyer@sanvedana.org',
    role: 'Volunteer Coordinator',
    department: 'Support',
  },
];

export const donations: Donation[] = [];

export const events: Event[] = [
  {
    id: 'EVT001',
    title: 'Annual Sports Day 2024',
    date: '2024-10-26',
    location: 'City Sports Ground',
    description: 'A day of inclusive sports and games celebrating the abilities and spirit of our wonderful students. All are welcome!',
    bannerimage: 'https://blog.letsendorse.com/wp-content/uploads/2018/08/Sports-Day-Blog-cover-1.jpg',
    imagehint: 'children with disabilities sports',
    gallery: [
      { url: 'https://picsum.photos/seed/sports1/600/400', hint: 'wheelchair race' },
      { url: 'https://picsum.photos/seed/sports2/600/400', hint: 'children cheering' },
    ],
    createdAt: '2024-07-28T10:00:00Z',
  },
  {
    id: 'EVT002',
    title: 'World Autism Awareness Day',
    date: '2024-11-15',
    location: 'Sanvedana Center Auditorium',
    description: 'Join us for an informative session with experts and parents to foster understanding and acceptance for individuals with autism.',
    bannerimage: 'https://www.tammana.org.in/wp-content/uploads/IMG_0143.jpg',
    imagehint: 'autism awareness event',
    gallery: [],
    createdAt: '2024-07-27T10:00:00Z',
  },
  {
    id: 'EVT003',
    title: 'ArtAbility: Student Art Exhibition',
    date: '2024-12-05',
    location: 'City Art Gallery',
    description: 'An exhibition showcasing breathtaking artwork created by our talented students. All proceeds support our art therapy program.',
    bannerimage: 'https://www.tammana.org.in/wp-content/uploads/Event133.jpg',
    imagehint: 'childrens art exhibition',
    gallery: [],
    createdAt: '2024-07-26T10:00:00Z',
  },
  {
    id: 'EVT004',
    title: 'Vocational Training ',
    date: '2025-01-20',
    location: 'Community Hall',
    description: 'Our older students will showcase products they have created as part of their vocational training. Come support their journey to independence.',
    bannerimage: 'https://lh3.googleusercontent.com/proxy/XWsVC5AKs3-CofrH_wOTIrvsnsuPBIUQ_7OBvgsyLPXzcZqQWBxOQW3pJiBIY6PlUaNDWrV042dPS2Yc2rUsKY_6L9DrP-ud6bzo',
    imagehint: 'vocational training fair',
    gallery: [],
    createdAt: '2024-07-25T10:00:00Z',
  },
  {
    id: 'EVT005',
    title: 'International Day of Persons with Disabilities',
    date: '2023-12-03',
    location: 'Sanvedana Campus',
    description: 'We celebrated the day with special performances by our students, guest speakers, and an inclusive carnival for all.',
    bannerimage: 'https://picsum.photos/seed/eventDisabilityDay/1200/400',
    imagehint: 'disability day celebration',
    gallery: [
       { url: 'https://picsum.photos/seed/disability1/600/400', hint: 'children performing music' },
       { url: 'https://picsum.photos/seed/disability2/600/400', hint: 'motivational speaker' },
    ],
    createdAt: '2023-11-20T10:00:00Z',
  },
  {
    id: 'EVT006',
    title: 'Sensory-Friendly Diwali Celebration 2023',
    date: '2023-10-28',
    location: 'Sanvedana Campus Grounds',
    description: 'A special Diwali mela with reduced noise and lights, featuring stalls with handmade crafts by our students.',
    bannerimage: 'https://picsum.photos/seed/eventDiwali/1200/400',
    imagehint: 'Diwali celebration disabled children',
    gallery: [],
    createdAt: '2023-10-15T10:00:00Z',
  },
];


export const dashboardMetrics = {
  totalStudents: 78,
  activeStudents: 65,
  totalStaff: 25,
  donationsThisMonth: 150000,
  socialMediaFollowers: {
    facebook: 12045,
    instagram: 8032,
    twitter: 4500,
  },
  donationHistory: [
    { month: 'Jan', total: 82000 },
    { month: 'Feb', total: 95000 },
    { month: 'Mar', total: 78000 },
    { month: 'Apr', total: 110000 },
    { month: 'May', total: 98000 },
    { month: 'Jun', total: 125000 },
    { month: 'Jul', total: 150000 },
  ],
};

export const recentStudents = students.slice(0, 3);
export const recentDonations = donations.slice(0, 3);
