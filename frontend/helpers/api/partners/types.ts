import { Incident } from "../incidents"
import { User } from "../auth"

export interface CreatePartner {
  name: string
  contact_email: string
  url?: string
  reported_incidents?: Incident[]
}

export interface Partner {
  id: number
  name: string
  url: string
  contact_email: string
  reported_incidents: Incident[]
  members: PartnerMember[]
}

export interface PartnerMember {
  id: number
  partner_id: number
  user_id: number
  user: User
  role: MemberRole
  date_joined: string
  is_active: boolean
}

export enum MemberRole {
  ADMIN = "Administrator",
  PUBLISHER = "Publisher",
  MEMBER = "Member",
  SUBSCRIBER = "Subscriber"
}
