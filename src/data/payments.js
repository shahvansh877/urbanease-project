
export const mockPayments = [
  {
    id: '1',
    date: '2026-03-04',
    service: 'Deep Cleaning',
    provider: 'CleanPro Services',
    amount: 150.0,
    status: 'completed',
    transactionId: 'TXN-2026-001234',
  },
  {
    id: '2',
    date: '2026-03-01',
    service: 'Plumbing Repair',
    provider: 'Plumb Experts',
    amount: 225.0,
    status: 'completed',
    transactionId: 'TXN-2026-001189',
  },
  {
    id: '3',
    date: '2026-02-28',
    service: 'Electrical Wiring',
    provider: 'Spark Electrical',
    amount: 380.0,
    status: 'completed',
    transactionId: 'TXN-2026-001156',
  },
  {
    id: '4',
    date: '2026-03-07',
    service: 'Carpet Cleaning',
    provider: 'CleanPro Services',
    amount: 120.0,
    status: 'scheduled',
    transactionId: 'TXN-2026-001267',
  },
];

export const upcomingServiceData = {
  provider: {
    name: 'John Smith',
    company: 'CleanPro Services',
    phone: '+1 (555) 123-4567',
    email: 'john.smith@cleanpro.com',
    photo: 'JS',
  },
  service: 'Carpet Cleaning',
  date: '2026-03-07',
  time: '10:00 AM',
  address: '742 Evergreen Terrace, Springfield',
  estimatedDuration: '2-3 hours',
};
