/**
 * CHECK-IN TYPES
 */
export interface Checkin {
  checkinId: number;
  userId: number;
  checkinAt: string;
  cravings: number;
  control: number;
  selfEfficacy: number;
  consequences: boolean;
  copingUsed: boolean;
  notes: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCheckinRequest {
  userId: number;
  cravings: number;
  control: number;
  selfEfficacy: number;
  consequences: boolean;
  copingUsed: boolean;
  notes: string;
}

export interface CheckinResponse {
  message: string;
  streakMessage: string;
  riskStatus: string;
  data: Checkin;
  metrics: {
    score: number;
    riskLevel: "low" | "medium" | "high";
  };
}

/**
 * SUPPORT PARTNER ACTION TYPES
 * Used by the Action Center to log interventions.
 */
export interface SupportAction {
  actionId: number;
  partnerId: number;
  userId: number;
  success: boolean;
  actionDescription: string;
  createdAt?: string;
}

export interface CreateActionRequest {
  partnerId: number; 
  userId: number; 
  success: boolean;
  actionDescription: string;
}



export interface ChatRoom {
  roomId: number;
  isPersistent: boolean;
  description: string | null;
  createdAt?: string;
}

export interface CreateChatRoomRequest {
  isPersistent: boolean;
  description: string;
}

export interface Message {
  messagesId: number;
  roomId: number;
  userId: number;
  message: string;
  sender: 'patient' | 'support_partner' | 'admin';
  createdAt?: string;
}

export interface CreateMessageRequest {
  roomId: number;
  message: string;
  // userId and sender are typically handled by backend bearAuth
}

/**
 * SUPPORT PARTNER PROFILE TYPES
 */
export interface SupportPartner {
  partnerId: number;
  userId: number;
  partnerName: string;
  contactInfo: string;
  relationship: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreatePartnerRequest {
  userId: number;
  partnerName: string;
  contactInfo: string;
  relationship: string;
}

/**
 * USER MANAGEMENT TYPES
 */
export interface User {
  userId: number;
  userName: string;
  email: string;
  contactPhone: string;
  userType: 'patient' | 'support_partner' | 'admin';
  partnerId?: number | null; // The ID of the partner checking up on this user
  streak_days?: number;
  last_checkin?: string;
  createdAt?: string;
}