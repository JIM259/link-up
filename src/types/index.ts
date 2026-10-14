export type UserRole = 'student' | 'senior_helper' | 'moderator' | 'admin';

export interface User {
  id: string;
  username: string;
  fullName: string;
  email: string;
  avatar: string;
  role: UserRole;
  university: string;
  city: string;
  bio: string;
  nativeLanguages: string[];
  learningLanguages: string[];
  interests: string[];
  skills: string[];
  helpAreas: string[];
  reputationScore: number;
  isVerified: boolean;
  joinedAt: string;
  phone?: string;
  wechatId?: string;
  blockedUserIds?: string[];
}

export interface Post {
  id: string;
  authorId: string;
  author: User;
  content: string;
  category: 'Help Request' | 'Housing' | 'Second-hand' | 'Language Exchange' | 'General' | 'Campus Life' | 'Events';
  images?: string[];
  location?: string;
  tags: string[];
  aiAnalysis?: {
    intent: string;
    location: string;
    urgency: 'Low' | 'Medium' | 'High';
    budget?: string;
    extractedNeed: string;
  };
  likesCount: number;
  commentsCount: number;
  savesCount: number;
  isLiked?: boolean;
  isSaved?: boolean;
  createdAt: string;
}

export interface AppComment {
  id: string;
  postId: string;
  authorId: string;
  author: User;
  content: string;
  createdAt: string;
}

export interface MarketplaceListing {
  id: string;
  sellerId: string;
  seller: User;
  title: string;
  description: string;
  category: 'Electronics' | 'Bicycles' | 'Dorm Essentials' | 'Books' | 'Clothing' | 'Other';
  priceRmb: number;
  condition: 'Brand New' | 'Like New' | 'Good' | 'Fair';
  location: string;
  university: string;
  images: string[];
  status: 'Active' | 'Reserved' | 'Sold' | 'Expired';
  expiresAt: string;
  createdAt: string;
}

export interface HousingListing {
  id: string;
  hostId: string;
  host: User;
  title: string;
  description: string;
  rentRmbPerMonth: number;
  roomType: 'Private Room' | 'Shared Room' | 'Entire Studio' | 'Roommate Needed';
  city: string;
  location: string;
  universityProximity: string;
  amenities: string[];
  images: string[];
  availableFrom: string;
  isRoommateMatching: boolean;
  status: 'Available' | 'Occupied' | 'Expired';
  expiresAt: string;
  createdAt: string;
}

export interface Event {
  id: string;
  organizerId: string;
  organizer: User;
  title: string;
  description: string;
  category: 'Language Exchange' | 'Cultural Exchange' | 'Sports' | 'Study Group' | 'City Tour' | 'Networking' | 'Food & Social';
  date: string;
  time: string;
  location: string;
  city: string;
  university: string;
  maxParticipants: number;
  participantIds: string[];
  participants?: User[];
  isJoined?: boolean;
  image?: string;
  createdAt: string;
}

export interface Guide {
  id: string;
  title: string;
  category: 'Arrival Checklist' | 'Visa & Residence' | 'Digital Life & Payments' | 'Transportation' | 'Chinese Language' | 'City Guide';
  summary: string;
  content: string;
  authorName: string;
  isVerifiedOfficial: boolean;
  readTimeMinutes: number;
  upvotes: number;
  updatedAt: string;
  image?: string;
}

export interface SmartMatchResult {
  matchScore: number; // 0 - 100
  matchReason: string;
  detectedIntent: string[];
  locationMatched: string;
  suggestedHousing: HousingListing[];
  suggestedMarketplace: MarketplaceListing[];
  suggestedSeniorHelpers: User[];
  suggestedLanguagePartners: User[];
  suggestedGuides: Guide[];
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  content: string;
  mediaUrl?: string;
  referenceType?: 'post' | 'housing' | 'marketplace' | 'event';
  referenceId?: string;
  isRead: boolean;
  createdAt: string;
}

export interface Conversation {
  id: string;
  participantIds: string[];
  participants: User[];
  lastMessage?: Message;
  unreadCount: number;
  updatedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'like' | 'comment' | 'match' | 'message' | 'system' | 'moderation';
  title: string;
  message: string;
  linkUrl?: string;
  isRead: boolean;
  createdAt: string;
}

export interface Report {
  id: string;
  reporterId: string;
  reporter: User;
  targetType: 'post' | 'user' | 'listing' | 'comment';
  targetId: string;
  reason: string;
  aiRiskScore: number; // 0 - 100
  aiRiskAnalysis: string;
  status: 'Pending' | 'Reviewed' | 'Dismissed' | 'Action Taken';
  createdAt: string;
}

export interface CampusPost {
  id: string;
  channelId: string;
  authorId: string;
  author: User;
  content: string;
  type: 'Question' | 'Announcement' | 'Campus Life' | 'Lost & Found' | 'Event';
  likesCount: number;
  commentsCount: number;
  isPinned?: boolean;
  createdAt: string;
}

export interface UniversityChannel {
  id: string;
  name: string;
  chineseName: string;
  city: string;
  badgeCode: string;
  description: string;
  bannerImage: string;
  memberCount: number;
  isOfficialPartner: boolean;
  memberIds: string[];
  isJoined?: boolean;
  topics: string[];
  posts: CampusPost[];
}

export interface AuditLog {
  id: string;
  actorId: string;
  actorName: string;
  action: string;
  details: string;
  ipAddress: string;
  createdAt: string;
}
