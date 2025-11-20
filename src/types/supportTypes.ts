export interface Ticket {
  id: string;
  channel: 'whatsapp' | 'phone' | 'email' | 'video' | 'chat' | 'form' | 'social';
  status: 'new' | 'pending' | 'in-progress' | 'resolved' | 'escalated' | 'spam';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  subject: string;
  description: string;
  productId?: string;
  productName?: string;
  createdAt: string;
  updatedAt: string;
  assignedTo?: string; // agent id
  customerId: string;
  tags: string[];
  sourceDetail: {
    whatsappId?: string;
    phoneNumber?: string;
    emailAddress?: string;
    socialLink?: string;
    formId?: string;
    chatSessionId?: string;
  };
  lastResponseAt?: string;
  slaBreachAt?: string;
  isRead: boolean;
  attachments: string[];
  conversationPreview: string;
}

export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  location?: string;
  optInFlags: {
    email: boolean;
    sms: boolean;
    whatsapp: boolean;
    marketing: boolean;
  };
  scans: string[]; // product scan history
  purchases: string[]; // purchase history
  createdAt: string;
  lastSeenAt: string;
  totalTickets: number;
  satisfactionRating?: number;
  verificationStatus: 'verified' | 'unverified' | 'pending';
}

export interface Agent {
  id: string;
  name: string;
  email: string;
  role: 'agent' | 'senior-agent' | 'manager' | 'admin';
  availabilityStatus: 'online' | 'away' | 'offline' | 'busy';
  skillTags: string[];
  assignedTickets: number;
  avatar?: string;
  lastActiveAt: string;
  workingHours: {
    start: string;
    end: string;
    timezone: string;
  };
  languages: string[];
}

export interface VideoBooking {
  id: string;
  ticketId?: string;
  customerId: string;
  productId?: string;
  productName?: string;
  purpose: 'product-demo' | 'general-query' | 'escalation' | 'service' | 'warranty' | 'return';
  preferredSlots: string[];
  scheduledAt?: string;
  assignedAgent?: string;
  joinUrl?: string;
  customerJoinUrl?: string;
  status: 'scheduled' | 'pending' | 'live' | 'completed' | 'cancelled' | 'no-show';
  recordingUrl?: string;
  duration?: number; // in minutes
  notes?: string;
  createdAt: string;
  updatedAt: string;
  reminderSent: boolean;
  rating?: number;
  feedback?: string;
}

export interface ConversationMessage {
  id: string;
  ticketId: string;
  authorType: 'agent' | 'customer' | 'system';
  authorId: string;
  authorName: string;
  text: string;
  attachments: string[];
  timestamp: string;
  isInternal: boolean; // for agent-only notes
  messageType: 'text' | 'image' | 'video' | 'audio' | 'file' | 'system-notification';
  readBy: string[]; // agent IDs who have read this message
}

export interface SocialMention {
  id: string;
  platform: 'amazon' | 'flipkart' | 'google' | 'instagram' | 'twitter' | 'facebook' | 'linkedin';
  handle: string;
  content: string;
  link: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  timestamp: string;
  productId?: string;
  productName?: string;
  isConverted: boolean; // converted to ticket
  ticketId?: string;
  rating?: number;
  engagement: {
    likes: number;
    shares: number;
    comments: number;
  };
}

export interface SupportTemplate {
  id: string;
  name: string;
  channel: 'whatsapp' | 'phone' | 'email' | 'video' | 'chat' | 'form' | 'social' | 'all';
  category: 'greeting' | 'resolution' | 'escalation' | 'follow-up' | 'closing';
  subject?: string;
  body: string;
  placeholders: string[]; // e.g., ['customer_name', 'product_name', 'ticket_id']
  isActive: boolean;
  createdAt: string;
  usageCount: number;
}

export interface SupportSettings {
  workingHours: {
    start: string;
    end: string;
    timezone: string;
    workingDays: string[];
  };
  slaSettings: {
    firstResponseTime: number; // in hours
    resolutionTime: number; // in hours
    escalationTime: number; // in hours
  };
  autoAssignment: {
    enabled: boolean;
    method: 'round-robin' | 'skill-based' | 'workload-based';
  };
  channels: {
    whatsapp: { enabled: boolean; apiKey?: string; phoneNumber?: string };
    email: { enabled: boolean; smtpConfig?: any; imapConfig?: any };
    phone: { enabled: boolean; twilioConfig?: any };
    video: { enabled: boolean; maxDuration: number; recordingEnabled: boolean };
    chat: { enabled: boolean; widgetConfig?: any };
    social: { enabled: boolean; platforms: string[] };
  };
  notifications: {
    agents: { email: boolean; inApp: boolean; slack: boolean };
    customers: { email: boolean; sms: boolean; whatsapp: boolean };
  };
  privacy: {
    dataRetentionDays: number;
    recordingConsent: boolean;
    piiMasking: boolean;
  };
}

// Sample data for demonstration
export const SAMPLE_CUSTOMERS: Customer[] = [
  {
    id: 'cust-001',
    name: 'Priya Sharma',
    email: 'priya.sharma@gmail.com',
    phone: '+91 98765 43210',
    location: 'Mumbai, Maharashtra',
    optInFlags: { email: true, sms: true, whatsapp: true, marketing: false },
    scans: ['prod-001', 'prod-002'],
    purchases: ['order-001', 'order-002'],
    createdAt: '2024-01-15T10:30:00Z',
    lastSeenAt: '2024-01-22T14:30:00Z',
    totalTickets: 3,
    satisfactionRating: 4.5,
    verificationStatus: 'verified'
  },
  {
    id: 'cust-002',
    name: 'Rahul Kumar',
    email: 'rahul.k@yahoo.com',
    phone: '+91 91234 56789',
    location: 'Delhi, NCR',
    optInFlags: { email: true, sms: false, whatsapp: true, marketing: true },
    scans: ['prod-002'],
    purchases: ['order-003'],
    createdAt: '2024-01-18T09:15:00Z',
    lastSeenAt: '2024-01-21T16:45:00Z',
    totalTickets: 1,
    satisfactionRating: 5.0,
    verificationStatus: 'verified'
  },
  {
    id: 'cust-003',
    name: 'Anita Patel',
    email: 'anita.patel@hotmail.com',
    phone: '+91 99887 76655',
    location: 'Bangalore, Karnataka',
    optInFlags: { email: true, sms: true, whatsapp: false, marketing: false },
    scans: ['prod-003'],
    purchases: [],
    createdAt: '2024-01-20T11:20:00Z',
    lastSeenAt: '2024-01-20T11:20:00Z',
    totalTickets: 1,
    verificationStatus: 'unverified'
  }
];

export const SAMPLE_AGENTS: Agent[] = [
  {
    id: 'agent-001',
    name: 'Sarah Johnson',
    email: 'sarah.j@stegofy.com',
    role: 'senior-agent',
    availabilityStatus: 'online',
    skillTags: ['product-support', 'technical', 'video-calls'],
    assignedTickets: 8,
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
    lastActiveAt: '2024-01-22T15:30:00Z',
    workingHours: { start: '09:00', end: '18:00', timezone: 'Asia/Kolkata' },
    languages: ['English', 'Hindi']
  },
  {
    id: 'agent-002',
    name: 'Amit Verma',
    email: 'amit.v@stegofy.com',
    role: 'agent',
    availabilityStatus: 'away',
    skillTags: ['customer-service', 'whatsapp', 'social-media'],
    assignedTickets: 5,
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg',
    lastActiveAt: '2024-01-22T14:15:00Z',
    workingHours: { start: '10:00', end: '19:00', timezone: 'Asia/Kolkata' },
    languages: ['English', 'Hindi', 'Marathi']
  },
  {
    id: 'agent-003',
    name: 'Lisa Chen',
    email: 'lisa.c@stegofy.com',
    role: 'manager',
    availabilityStatus: 'online',
    skillTags: ['escalations', 'management', 'video-calls', 'technical'],
    assignedTickets: 3,
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
    lastActiveAt: '2024-01-22T15:45:00Z',
    workingHours: { start: '08:00', end: '17:00', timezone: 'Asia/Kolkata' },
    languages: ['English']
  }
];

export const SAMPLE_TICKETS: Ticket[] = [
  {
    id: 'TKT-001',
    channel: 'whatsapp',
    status: 'new',
    priority: 'medium',
    subject: 'Product quality inquiry about Organic Honey',
    description: 'Customer asking about the purity and source of organic honey after scanning QR code',
    productId: '1',
    productName: 'Organic Honey 500g',
    createdAt: '2024-01-22T14:30:00Z',
    updatedAt: '2024-01-22T14:30:00Z',
    customerId: 'cust-001',
    tags: ['product-inquiry', 'quality'],
    sourceDetail: { whatsappId: '+919876543210' },
    isRead: false,
    attachments: [],
    conversationPreview: 'Hi, I scanned the QR code on your honey jar and wanted to know more about the source...'
  },
  {
    id: 'TKT-002',
    channel: 'email',
    status: 'in-progress',
    priority: 'high',
    subject: 'Defective product - Tea packaging damaged',
    description: 'Customer received damaged tea packaging and requesting replacement',
    productId: '2',
    productName: 'Premium Green Tea 250g',
    createdAt: '2024-01-21T16:45:00Z',
    updatedAt: '2024-01-22T10:15:00Z',
    assignedTo: 'agent-001',
    customerId: 'cust-002',
    tags: ['defective-product', 'replacement'],
    sourceDetail: { emailAddress: 'rahul.k@yahoo.com' },
    lastResponseAt: '2024-01-22T10:15:00Z',
    isRead: true,
    attachments: ['/attachments/damaged-package.jpg'],
    conversationPreview: 'I received the tea package today but it was damaged during shipping...'
  },
  {
    id: 'TKT-003',
    channel: 'phone',
    status: 'pending',
    priority: 'medium',
    subject: 'Callback request for product demo',
    description: 'Customer wants a callback to understand product benefits',
    productId: '3',
    productName: 'Handmade Soap Pack',
    createdAt: '2024-01-21T11:20:00Z',
    updatedAt: '2024-01-21T11:20:00Z',
    assignedTo: 'agent-002',
    customerId: 'cust-003',
    tags: ['callback', 'product-demo'],
    sourceDetail: { phoneNumber: '+919988776655' },
    isRead: true,
    attachments: [],
    conversationPreview: 'Requested callback to discuss soap ingredients and benefits'
  },
  {
    id: 'TKT-004',
    channel: 'video',
    status: 'resolved',
    priority: 'low',
    subject: 'Product demonstration completed',
    description: 'Video call completed for honey product demonstration',
    productId: '1',
    productName: 'Organic Honey 500g',
    createdAt: '2024-01-20T09:15:00Z',
    updatedAt: '2024-01-20T15:30:00Z',
    assignedTo: 'agent-001',
    customerId: 'cust-001',
    tags: ['video-demo', 'completed'],
    sourceDetail: {},
    lastResponseAt: '2024-01-20T15:30:00Z',
    isRead: true,
    attachments: ['/recordings/demo-session-001.mp4'],
    conversationPreview: 'Video demonstration completed successfully. Customer satisfied with product quality.'
  },
  {
    id: 'TKT-005',
    channel: 'social',
    status: 'escalated',
    priority: 'urgent',
    subject: 'Negative review on Amazon - urgent response needed',
    description: 'Customer posted negative review about tea quality on Amazon marketplace',
    productId: '2',
    productName: 'Premium Green Tea 250g',
    createdAt: '2024-01-19T14:20:00Z',
    updatedAt: '2024-01-22T09:00:00Z',
    assignedTo: 'agent-003',
    customerId: 'cust-002',
    tags: ['negative-review', 'amazon', 'reputation'],
    sourceDetail: { socialLink: 'https://amazon.in/review/R123456789' },
    slaBreachAt: '2024-01-22T14:20:00Z',
    isRead: true,
    attachments: [],
    conversationPreview: 'Customer posted 2-star review citing poor tea quality and taste issues...'
  },
  {
    id: 'TKT-006',
    channel: 'chat',
    status: 'new',
    priority: 'low',
    subject: 'General inquiry about shipping',
    description: 'Customer asking about shipping times and delivery options',
    createdAt: '2024-01-22T13:45:00Z',
    updatedAt: '2024-01-22T13:45:00Z',
    customerId: 'cust-003',
    tags: ['shipping', 'general-inquiry'],
    sourceDetail: { chatSessionId: 'chat-session-789' },
    isRead: false,
    attachments: [],
    conversationPreview: 'Hi, I wanted to know about the shipping options available for my location...'
  },
  {
    id: 'TKT-007',
    channel: 'form',
    status: 'pending',
    priority: 'medium',
    subject: 'Product feedback form submission',
    description: 'Customer submitted feedback form with suggestions for improvement',
    productId: '1',
    productName: 'Organic Honey 500g',
    createdAt: '2024-01-21T08:30:00Z',
    updatedAt: '2024-01-21T08:30:00Z',
    customerId: 'cust-001',
    tags: ['feedback', 'suggestions'],
    sourceDetail: { formId: 'feedback-form-001' },
    isRead: true,
    attachments: ['/forms/feedback-001.pdf'],
    conversationPreview: 'Submitted detailed feedback about honey taste and packaging suggestions...'
  }
];

export const SAMPLE_VIDEO_BOOKINGS: VideoBooking[] = [
  {
    id: 'VB-001',
    ticketId: 'TKT-008',
    customerId: 'cust-001',
    productId: '1',
    productName: 'Organic Honey 500g',
    purpose: 'product-demo',
    preferredSlots: ['2024-01-23T10:00:00Z', '2024-01-23T14:00:00Z'],
    scheduledAt: '2024-01-23T10:00:00Z',
    assignedAgent: 'agent-001',
    joinUrl: 'https://meet.stegofy.com/room/vb-001-agent',
    customerJoinUrl: 'https://meet.stegofy.com/join/vb-001',
    status: 'scheduled',
    createdAt: '2024-01-22T11:30:00Z',
    updatedAt: '2024-01-22T11:30:00Z',
    reminderSent: false,
    notes: 'Customer wants to see honey extraction process and quality testing'
  },
  {
    id: 'VB-002',
    customerId: 'cust-002',
    productId: '2',
    productName: 'Premium Green Tea 250g',
    purpose: 'service',
    preferredSlots: ['2024-01-24T15:00:00Z'],
    scheduledAt: '2024-01-24T15:00:00Z',
    assignedAgent: 'agent-002',
    joinUrl: 'https://meet.stegofy.com/room/vb-002-agent',
    customerJoinUrl: 'https://meet.stegofy.com/join/vb-002',
    status: 'scheduled',
    createdAt: '2024-01-22T09:15:00Z',
    updatedAt: '2024-01-22T09:15:00Z',
    reminderSent: true,
    notes: 'Follow-up call for previous quality concern'
  }
];

export const SAMPLE_CONVERSATION_MESSAGES: ConversationMessage[] = [
  {
    id: 'msg-001',
    ticketId: 'TKT-001',
    authorType: 'customer',
    authorId: 'cust-001',
    authorName: 'Priya Sharma',
    text: 'Hi, I scanned the QR code on your honey jar and wanted to know more about the source. Is it really organic?',
    attachments: [],
    timestamp: '2024-01-22T14:30:00Z',
    isInternal: false,
    messageType: 'text',
    readBy: []
  },
  {
    id: 'msg-002',
    ticketId: 'TKT-002',
    authorType: 'customer',
    authorId: 'cust-002',
    authorName: 'Rahul Kumar',
    text: 'I received the tea package today but it was damaged during shipping. The box was crushed and some tea spilled out.',
    attachments: ['/attachments/damaged-package.jpg'],
    timestamp: '2024-01-21T16:45:00Z',
    isInternal: false,
    messageType: 'text',
    readBy: ['agent-001']
  },
  {
    id: 'msg-003',
    ticketId: 'TKT-002',
    authorType: 'agent',
    authorId: 'agent-001',
    authorName: 'Sarah Johnson',
    text: 'I\'m sorry to hear about the damaged package, Rahul. We\'ll send you a replacement immediately. Can you please confirm your delivery address?',
    attachments: [],
    timestamp: '2024-01-22T10:15:00Z',
    isInternal: false,
    messageType: 'text',
    readBy: []
  },
  {
    id: 'msg-004',
    ticketId: 'TKT-002',
    authorType: 'system',
    authorId: 'system',
    authorName: 'System',
    text: 'Ticket assigned to Sarah Johnson',
    attachments: [],
    timestamp: '2024-01-22T09:00:00Z',
    isInternal: false,
    messageType: 'system-notification',
    readBy: ['agent-001']
  }
];

export const SAMPLE_SOCIAL_MENTIONS: SocialMention[] = [
  {
    id: 'SM-001',
    platform: 'amazon',
    handle: 'VerifiedPurchaser123',
    content: 'Great honey quality! Exactly as described. Will buy again.',
    link: 'https://amazon.in/review/R123456789',
    sentiment: 'positive',
    timestamp: '2024-01-21T12:30:00Z',
    productId: '1',
    productName: 'Organic Honey 500g',
    isConverted: false,
    rating: 5,
    engagement: { likes: 12, shares: 3, comments: 2 }
  },
  {
    id: 'SM-002',
    platform: 'instagram',
    handle: '@healthyeats_mumbai',
    content: 'Tried this organic honey from @stegofy_official. The taste is amazing! #organic #honey #healthy',
    link: 'https://instagram.com/p/ABC123',
    sentiment: 'positive',
    timestamp: '2024-01-20T18:45:00Z',
    productId: '1',
    productName: 'Organic Honey 500g',
    isConverted: false,
    engagement: { likes: 45, shares: 8, comments: 12 }
  },
  {
    id: 'SM-003',
    platform: 'twitter',
    handle: '@disappointed_buyer',
    content: 'The tea quality is not as premium as advertised. Expected better for the price. @stegofy_official',
    link: 'https://twitter.com/status/123456789',
    sentiment: 'negative',
    timestamp: '2024-01-19T14:20:00Z',
    productId: '2',
    productName: 'Premium Green Tea 250g',
    isConverted: true,
    ticketId: 'TKT-005',
    engagement: { likes: 3, shares: 1, comments: 5 }
  }
];

export const SAMPLE_SUPPORT_TEMPLATES: SupportTemplate[] = [
  {
    id: 'TPL-001',
    name: 'Welcome Greeting',
    channel: 'all',
    category: 'greeting',
    subject: 'Thank you for contacting us',
    body: 'Hi {{customer_name}}, thank you for reaching out to us. We\'ve received your inquiry about {{product_name}} and will get back to you shortly.',
    placeholders: ['customer_name', 'product_name'],
    isActive: true,
    createdAt: '2024-01-15T10:00:00Z',
    usageCount: 45
  },
  {
    id: 'TPL-002',
    name: 'Product Quality Assurance',
    channel: 'whatsapp',
    category: 'resolution',
    body: 'We understand your concern about {{product_name}}. All our products go through rigorous quality testing. Would you like to schedule a video call to discuss this further?',
    placeholders: ['product_name'],
    isActive: true,
    createdAt: '2024-01-15T10:00:00Z',
    usageCount: 23
  },
  {
    id: 'TPL-003',
    name: 'Escalation Notice',
    channel: 'email',
    category: 'escalation',
    subject: 'Your concern has been escalated - Ticket {{ticket_id}}',
    body: 'Dear {{customer_name}}, your concern regarding {{product_name}} has been escalated to our senior team. We will resolve this within 24 hours.',
    placeholders: ['customer_name', 'product_name', 'ticket_id'],
    isActive: true,
    createdAt: '2024-01-15T10:00:00Z',
    usageCount: 8
  }
];