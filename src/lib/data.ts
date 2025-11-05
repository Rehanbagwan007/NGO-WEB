import type { Student, Staff, Donation } from './types';

export const students: Student[] = [
  {
    id: 'STU001',
    name: 'Rohan Sharma',
    avatar: 'https://picsum.photos/seed/STU001/100/100',
    email: 'rohan.sharma@example.com',
    status: 'Active',
    medicalNotes: 'Mild autism spectrum disorder. Benefits from visual aids.',
    dateOfBirth: '2010-05-15',
  },
  {
    id: 'STU002',
    name: 'Priya Patel',
    avatar: 'https://picsum.photos/seed/STU002/100/100',
    email: 'priya.patel@example.com',
    status: 'Active',
    medicalNotes: 'Down syndrome. Requires one-on-one attention for certain tasks.',
    dateOfBirth: '2012-02-20',
  },
  {
    id: 'STU003',
    name: 'Amit Singh',
    avatar: 'https://picsum.photos/seed/STU003/100/100',
    email: 'amit.singh@example.com',
    status: 'On Hold',
    medicalNotes: 'Cerebral palsy. Uses a wheelchair.',
    dateOfBirth: '2009-11-30',
  },
  {
    id: 'STU004',
    name: 'Sneha Gupta',
    avatar: 'https://picsum.photos/seed/STU004/100/100',
    email: 'sneha.gupta@example.com',
    status: 'Inactive',
    medicalNotes: 'ADHD. Responds well to structured routines.',
    dateOfBirth: '2011-08-12',
  },
  {
    id: 'STU005',
    name: 'Vikram Kumar',
    avatar: 'https://picsum.photos/seed/STU005/100/100',
    email: 'vikram.kumar@example.com',
    status: 'Active',
    medicalNotes: 'No specific conditions noted. Excels in artistic activities.',
    dateOfBirth: '2013-03-25',
  },
];

export const staff: Staff[] = [
  {
    id: 'STF001',
    name: 'Anjali Verma',
    avatar: 'https://picsum.photos/seed/STF001/100/100',
    email: 'anjali.verma@sanvedana.org',
    role: 'Teacher',
    department: 'Academics',
  },
  {
    id: 'STF002',
    name: 'Rajesh Kumar',
    avatar: 'https://picsum.photos/seed/STF002/100/100',
    email: 'rajesh.kumar@sanvedana.org',
    role: 'Admin',
    department: 'Administration',
  },
  {
    id: 'STF003',
    name: 'Dr. Meena Desai',
    avatar: 'https://picsum.photos/seed/STF003/100/100',
    email: 'meena.desai@sanvedana.org',
    role: 'Therapist',
    department: 'Therapy',
  },
  {
    id: 'STF004',
    name: 'Suresh Iyer',
    avatar: 'https://picsum.photos/seed/STF004/100/100',
    email: 'suresh.iyer@sanvedana.org',
    role: 'Volunteer',
    department: 'Support',
  },
];

export const donations: Donation[] = [
  {
    id: 'DON001',
    donorName: 'Corporate Social Responsibility Inc.',
    amount: 75000,
    date: '2024-07-20',
    status: 'Completed',
  },
  {
    id: 'DON002',
    donorName: 'Anonymous',
    amount: 5000,
    date: '2024-07-15',
    status: 'Completed',
  },
  {
    id: 'DON003',
    donorName: 'Mehta Family Foundation',
    amount: 25000,
    date: '2024-07-12',
    status: 'Completed',
  },
  {
    id: 'DON004',
    donorName: 'Online Campaign',
    amount: 12000,
    date: '2024-07-10',
    status: 'Pending',
  },
  {
    id: 'DON005',
    donorName: 'Walk-in Donor',
    amount: 1000,
    date: '2024-06-28',
    status: 'Failed',
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
