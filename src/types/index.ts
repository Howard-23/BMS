export interface User {
  id: number
  username: string
  email: string
  firstName: string
  middleName?: string | null
  lastName: string
  suffix?: string | null
  role: 'ADMIN' | 'STAFF' | 'OFFICIAL' | 'TREASURER' | 'SECRETARY'
  position?: string | null
  phone?: string | null
  address?: string | null
  isActive: boolean
  lastLogin?: Date | null
  createdAt: Date
}

export interface Resident {
  id: number
  barangayId?: string | null
  firstName: string
  middleName?: string | null
  lastName: string
  suffix?: string | null
  birthDate: Date
  birthPlace?: string | null
  gender: 'MALE' | 'FEMALE' | 'OTHER'
  civilStatus: 'SINGLE' | 'MARRIED' | 'WIDOWED' | 'SEPARATED' | 'DIVORCED'
  bloodType?: string | null
  phone?: string | null
  email?: string | null
  address: string
  purok?: string | null
  philhealthId?: string | null
  sssId?: string | null
  gsisId?: string | null
  tin?: string | null
  votersId?: string | null
  isVoter: boolean
  precinctNumber?: string | null
  occupation?: string | null
  employmentStatus?: string | null
  monthlyIncome?: number | null
  educationalAttainment?: string | null
  schoolLastAttended?: string | null
  motherName?: string | null
  fatherName?: string | null
  spouseName?: string | null
  isSeniorCitizen: boolean
  isPwd: boolean
  isSoloParent: boolean
  isIndigent: boolean
  emergencyContactName?: string | null
  emergencyContactPhone?: string | null
  emergencyContactRelationship?: string | null
  photoUrl?: string | null
  remarks?: string | null
  status: string
  createdAt: Date
  updatedAt: Date
}

export interface BarangayClearance {
  id: number
  clearanceNo: string
  residentId: number
  purpose: string
  ctcNo?: string | null
  orNo?: string | null
  amount: number
  status: 'PENDING' | 'APPROVED' | 'RELEASED' | 'CANCELLED'
  createdAt: Date
  processedAt?: Date | null
  resident: Resident
}

export interface IncidentReport {
  id: number
  caseNo: string
  incidentType: string
  incidentDate: Date
  incidentLocation: string
  description: string
  complainantName: string
  complainantAddress?: string | null
  complainantContact?: string | null
  respondentName?: string | null
  respondentAddress?: string | null
  respondentContact?: string | null
  status: 'PENDING' | 'UNDER_INVESTIGATION' | 'RESOLVED' | 'DISMISSED'
  resolution?: string | null
  resolvedAt?: Date | null
  createdAt: Date
}

export interface FinancialTransaction {
  id: number
  transactionNo: string
  transactionType: 'INCOME' | 'EXPENSE'
  category: string
  amount: number
  description?: string | null
  payerName?: string | null
  payeeName?: string | null
  referenceNo?: string | null
  transactionDate: Date
  createdAt: Date
}

export interface Announcement {
  id: number
  title: string
  content: string
  announcementType: 'NEWS' | 'EVENT' | 'ADVISORY'
  eventDate?: Date | null
  eventLocation?: string | null
  imageUrl?: string | null
  isPinned: boolean
  isPublished: boolean
  createdAt: Date
  updatedAt: Date
}

export interface BarangayInfo {
  id: number
  name: string
  district?: string | null
  city: string
  province: string
  region?: string | null
  contactNumber?: string | null
  email?: string | null
  address?: string | null
  latitude?: number | null
  longitude?: number | null
  logoUrl?: string | null
  sealUrl?: string | null
  mission?: string | null
  vision?: string | null
  history?: string | null
  facebookUrl?: string | null
  twitterUrl?: string | null
}

export interface DashboardStats {
  totalResidents: number
  totalHouseholds: number
  totalVoters: number
  seniorCitizens: number
  pendingClearances: number
  pendingIncidents: number
  monthlyIncome: number
  monthlyExpense: number
}
