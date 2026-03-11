"use client"

import { useEffect, useRef, useState } from "react"
import type { ReactNode } from "react"
import { signOut } from "next-auth/react"
import {
  AlertCircle,
  Bell,
  Building2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  FileText,
  Gavel,
  Home,
  LogOut,
  MoreHorizontal,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  Search,
  Shield,
  Siren,
  Users,
} from "lucide-react"

const mockResidents = [
  { id: "BRGY-2026-1001", name: "Alyssa Dela Cruz", birthdate: "1994-03-12", status: "Active", purok: "Purok 1" },
  { id: "BRGY-2026-1002", name: "Miguel Santos", birthdate: "", status: "For Review", purok: "Purok 2" },
  { id: "BRGY-2026-1003", name: "Rina Valdez", birthdate: "1988-07-24", status: "Active", purok: "Purok 4" },
  { id: "BRGY-2026-1004", name: "Noel Dimaano", birthdate: null, status: "Pending", purok: "Purok 3" },
  { id: "BRGY-2026-1005", name: "Jessa Mariano", birthdate: "2001-11-05", status: "Active", purok: "Purok 5" },
  { id: "BRGY-2026-1006", name: "Carlo Rivera", birthdate: "1979-01-30", status: "Inactive", purok: "Purok 6" },
]

const mockBlotters = [
  { id: "BLT-2401", incident: "Noise disturbance near covered court", date: "2026-03-10", severity: "Low", status: "Pending" },
  { id: "BLT-2402", incident: "Property damage complaint", date: "2026-03-09", severity: "Medium", status: "Under Review" },
  { id: "BLT-2403", incident: "Street altercation", date: "2026-03-08", severity: "High", status: "Filed" },
  { id: "BLT-2404", incident: "Curfew violation report", date: "2026-03-07", severity: "Low", status: "Resolved" },
  { id: "BLT-2405", incident: "Illegal dumping concern", date: "2026-03-06", severity: "Medium", status: "Pending" },
]

const mockRecentActivity = [
  { id: "DOC-1001", module: "Clearance", title: "Barangay Clearance", requestedBy: "Ana Robles", status: "Generated", date: "2026-03-11" },
  { id: "DOC-1002", module: "Certificate", title: "Certificate of Residency", requestedBy: "NULL", status: "Pending", date: "2026-03-11" },
  { id: "DOC-1003", module: "Permit", title: "Business Permit Endorsement", requestedBy: "Mario Cruz", status: "Generated", date: "2026-03-10" },
  { id: "DOC-1004", module: "Complaint", title: "Incident Intake Form", requestedBy: "NULL", status: "Under Review", date: "2026-03-09" },
  { id: "DOC-1005", module: "Clearance", title: "First Time Job Seeker", requestedBy: "Liza Mateo", status: "Generated", date: "2026-03-08" },
  { id: "DOC-1006", module: "Certificate", title: "Certificate of Indigency", requestedBy: "Paolo Soriano", status: "Pending", date: "2026-03-07" },
]

const mockComplaints = [
  { id: "CMP-3101", subject: "Drainage blockage concern", complainant: "Shiela Ramos", priority: "Medium", status: "Pending", date: "2026-03-10" },
  { id: "CMP-3102", subject: "Stray animal complaint", complainant: "NULL", priority: "Low", status: "Under Review", date: "2026-03-09" },
  { id: "CMP-3103", subject: "Late-night videoke report", complainant: "Ben Alonzo", priority: "High", status: "Filed", date: "2026-03-08" },
  { id: "CMP-3104", subject: "Water interruption notice request", complainant: "NULL", priority: "Low", status: "Resolved", date: "2026-03-06" },
]

const mockCredits = [
  { id: "wallet-1", label: "General Fund", amount: 742350.45 },
  { id: "wallet-2", label: "Disaster Fund", amount: 128000 },
]

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

function formatDate(date: string | Date) {
  const value = date instanceof Date ? date : new Date(date)

  return value.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

function calculateAge(birthdate?: string | null) {
  if (!birthdate) {
    return "—"
  }

  const date = new Date(birthdate)

  if (Number.isNaN(date.getTime())) {
    return "—"
  }

  const today = new Date()
  let age = today.getFullYear() - date.getFullYear()
  const monthDiff = today.getMonth() - date.getMonth()

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())) {
    age -= 1
  }

  return String(age)
}

function formatUserName(name: string) {
  return name === "NULL" ? "System" : name
}

function getAvatarColor(name: string) {
  const colors = [
    "bg-blue-100 text-blue-700",
    "bg-emerald-100 text-emerald-700",
    "bg-amber-100 text-amber-700",
    "bg-rose-100 text-rose-700",
    "bg-cyan-100 text-cyan-700",
    "bg-indigo-100 text-indigo-700",
  ]

  const seed = name.split("").reduce((total, char) => total + char.charCodeAt(0), 0)
  return colors[seed % colors.length]
}

type ButtonProps = {
  children: ReactNode
  className?: string
  onClick?: () => void
  variant?: "primary" | "secondary" | "ghost" | "danger"
  type?: "button" | "submit"
}

function Button({
  children,
  className = "",
  onClick,
  type = "button",
  variant = "primary",
}: ButtonProps) {
  const styles = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50",
    ghost: "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900",
    danger: "bg-red-600 text-white hover:bg-red-700",
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${styles[variant]} ${className}`}
    >
      {children}
    </button>
  )
}

function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-xl border border-slate-200 bg-white p-5 shadow-sm ${className}`}>{children}</div>
}

function StatusBadge({ status }: { status: string }) {
  const colorMap: Record<string, string> = {
    Generated: "bg-green-50 text-green-700 ring-green-200",
    Active: "bg-green-50 text-green-700 ring-green-200",
    Resolved: "bg-green-50 text-green-700 ring-green-200",
    Pending: "bg-amber-50 text-amber-700 ring-amber-200",
    "For Review": "bg-amber-50 text-amber-700 ring-amber-200",
    "Under Review": "bg-amber-50 text-amber-700 ring-amber-200",
    Filed: "bg-blue-50 text-blue-700 ring-blue-200",
    Inactive: "bg-red-50 text-red-700 ring-red-200",
  }

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${colorMap[status] ?? "bg-slate-100 text-slate-700 ring-slate-200"}`}>
      {status}
    </span>
  )
}

function Avatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("")

  return (
    <div className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${getAvatarColor(name)}`}>
      {initials || "BS"}
    </div>
  )
}

type Column<T> = {
  key: string
  header: string
  render: (item: T) => ReactNode
  sortValue?: (item: T) => string | number
  className?: string
}

type DataTableProps<T> = {
  columns: Column<T>[]
  data: T[]
  pageSize?: number
}

function DataTable<T>({ columns, data, pageSize = 25 }: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1)
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null)

  const sortedData = [...data].sort((a, b) => {
    if (!sortConfig) {
      return 0
    }

    const column = columns.find((item) => item.key === sortConfig.key)

    if (!column?.sortValue) {
      return 0
    }

    const aValue = column.sortValue(a)
    const bValue = column.sortValue(b)

    if (aValue < bValue) {
      return sortConfig.direction === "asc" ? -1 : 1
    }

    if (aValue > bValue) {
      return sortConfig.direction === "asc" ? 1 : -1
    }

    return 0
  })

  const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize))
  const safePage = Math.min(currentPage, totalPages)
  const startIndex = (safePage - 1) * pageSize
  const endIndex = Math.min(startIndex + pageSize, sortedData.length)
  const paginatedData = sortedData.slice(startIndex, endIndex)

  function toggleSort(column: Column<T>) {
    if (!column.sortValue) {
      return
    }

    setCurrentPage(1)
    setSortConfig((current) => {
      if (!current || current.key !== column.key) {
        return { key: column.key, direction: "asc" }
      }

      return {
        key: column.key,
        direction: current.direction === "asc" ? "desc" : "asc",
      }
    })
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              {columns.map((column) => {
                const isSorted = sortConfig?.key === column.key
                return (
                  <th key={column.key} className={`px-4 py-3 text-left font-semibold text-slate-600 ${column.className ?? ""}`}>
                    <button
                      type="button"
                      onClick={() => toggleSort(column)}
                      className="inline-flex items-center gap-2"
                    >
                      <span>{column.header}</span>
                      <ChevronsUpDown className={`h-4 w-4 ${isSorted ? "text-blue-600" : "text-slate-400"}`} />
                    </button>
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {paginatedData.map((row, index) => (
              <tr key={index} className="hover:bg-slate-50">
                {columns.map((column) => (
                  <td key={column.key} className={`px-4 py-4 align-middle text-slate-700 ${column.className ?? ""}`}>
                    {column.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex flex-col gap-3 border-t border-slate-200 bg-white px-4 py-3 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <span>
          Showing {sortedData.length === 0 ? 0 : startIndex + 1}-{endIndex} of {sortedData.length} records
        </span>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            className="px-3 py-2"
            onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="min-w-20 text-center font-medium text-slate-600">
            Page {safePage} of {totalPages}
          </span>
          <Button
            variant="secondary"
            className="px-3 py-2"
            onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

type ViewKey = "dashboard" | "residents" | "blotters" | "documents" | "complaints"

function matchesSearch(value: string, query: string) {
  return value.toLowerCase().includes(query.toLowerCase())
}

function filterResidents(query: string) {
  if (!query) {
    return mockResidents
  }

  return mockResidents.filter((resident) =>
    [resident.id, resident.name, resident.purok, resident.status].some((field) => matchesSearch(field, query))
  )
}

function filterBlotters(query: string) {
  if (!query) {
    return mockBlotters
  }

  return mockBlotters.filter((item) =>
    [item.id, item.incident, item.severity, item.status].some((field) => matchesSearch(field, query))
  )
}

function filterDocuments(query: string) {
  if (!query) {
    return mockRecentActivity
  }

  return mockRecentActivity.filter((item) =>
    [item.id, item.module, item.title, formatUserName(item.requestedBy), item.status].some((field) =>
      matchesSearch(field, query)
    )
  )
}

function filterComplaints(query: string) {
  if (!query) {
    return mockComplaints
  }

  return mockComplaints.filter((item) =>
    [item.id, item.subject, formatUserName(item.complainant), item.priority, item.status].some((field) =>
      matchesSearch(field, query)
    )
  )
}

type SidebarProps = {
  activeView: ViewKey
  isCollapsed: boolean
  onSelect: (view: ViewKey) => void
}

function Sidebar({ activeView, isCollapsed, onSelect }: SidebarProps) {
  const sections = [
    {
      title: "Overview",
      items: [{ key: "dashboard" as const, label: "Dashboard", icon: Home }],
    },
    {
      title: "Records",
      items: [
        { key: "residents" as const, label: "Residents", icon: Users },
        { key: "documents" as const, label: "Documents", icon: FileText, pending: true },
      ],
    },
    {
      title: "Judicial",
      items: [
        { key: "blotters" as const, label: "Blotters", icon: Gavel, pending: true },
        { key: "complaints" as const, label: "Complaints", icon: Siren },
      ],
    },
  ]

  return (
    <aside className={`sticky top-0 hidden h-screen shrink-0 flex-col border-r border-slate-200 bg-white transition-all duration-300 lg:flex ${isCollapsed ? "w-20" : "w-64"}`}>
      <div className={`border-b border-slate-200 px-4 py-5 ${isCollapsed ? "flex justify-center" : "flex items-center"}`}>
        <div className={`flex min-w-0 items-center ${isCollapsed ? "justify-center" : "gap-3"}`}>
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-900 text-white shadow-sm">
            <Shield className="h-6 w-6" />
          </div>
          {!isCollapsed && (
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Barangay System</p>
              <p className="truncate text-lg font-bold text-slate-900">Administrative Seal</p>
            </div>
          )}
        </div>
      </div>

      <nav className="flex-1 space-y-6 px-3 py-6">
        {sections.map((section) => (
          <div key={section.title}>
            {!isCollapsed && (
              <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                {section.title}
              </p>
            )}
            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon
                const isActive = activeView === item.key

                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => onSelect(item.key)}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-blue-50 text-blue-700"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <div className="relative">
                      <Icon className="h-5 w-5" />
                      {item.pending && <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-red-600" />}
                    </div>
                    {!isCollapsed && <span className="truncate">{item.label}</span>}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-slate-200 p-4">
        <div className={`flex items-center gap-3 rounded-xl bg-slate-50 p-3 ${isCollapsed ? "justify-center" : ""}`}>
          <Avatar name="Barangay Clerk" />
          {!isCollapsed && (
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-900">Barangay Clerk</p>
              <p className="truncate text-xs text-slate-500">Municipal Operations</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}

type TopHeaderProps = {
  isSidebarCollapsed: boolean
  onToggleSidebar: () => void
  searchQuery: string
  onSearchChange: (value: string) => void
  onSelectView: (view: ViewKey) => void
}

function TopHeader({
  isSidebarCollapsed,
  onToggleSidebar,
  searchQuery,
  onSearchChange,
  onSelectView,
}: TopHeaderProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const dropdownRef = useRef<HTMLDivElement | null>(null)
  const notificationsRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false)
      }
    }

    window.addEventListener("mousedown", handleClickOutside)
    return () => window.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="flex items-center gap-4 px-4 py-4 lg:px-8">
        <button type="button" onClick={onToggleSidebar} className="hidden rounded-xl border border-slate-200 p-2 text-slate-500 hover:bg-slate-50 lg:inline-flex">
          {isSidebarCollapsed ? <PanelLeftOpen className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
        </button>

        <div className="relative mx-auto flex w-full max-w-xl items-center">
          <Search className="absolute left-4 h-4 w-4 text-slate-400" />
          <input
            type="search"
            placeholder="Search records, services, or incidents"
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-700 outline-none ring-0 placeholder:text-slate-400 focus:border-blue-600"
          />
        </div>

        <div className="hidden items-center gap-3 xl:flex">
          {mockCredits.map((credit) => (
            <div key={credit.id} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">{credit.label}</p>
              <p className="text-sm font-semibold text-slate-900">{formatCurrency(credit.amount)}</p>
            </div>
          ))}
        </div>

        <div ref={notificationsRef} className="relative">
          <button
            type="button"
            onClick={() => setShowNotifications((value) => !value)}
            className="relative rounded-xl border border-slate-200 p-2.5 text-slate-500 hover:bg-slate-50 hover:text-slate-900"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-red-600" />
          </button>
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
              <div className="px-3 py-2">
                <p className="text-sm font-semibold text-slate-900">Notifications</p>
                <p className="text-xs text-slate-500">Operational reminders from today.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  onSelectView("documents")
                  setShowNotifications(false)
                }}
                className="flex w-full flex-col items-start rounded-lg px-3 py-2 text-left hover:bg-slate-50"
              >
                <span className="text-sm font-medium text-slate-800">7 documents are queued for release</span>
                <span className="text-xs text-slate-500">Open Documents module</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  onSelectView("blotters")
                  setShowNotifications(false)
                }}
                className="flex w-full flex-col items-start rounded-lg px-3 py-2 text-left hover:bg-slate-50"
              >
                <span className="text-sm font-medium text-slate-800">5 blotter cases need follow-up</span>
                <span className="text-xs text-slate-500">Jump to Blotters view</span>
              </button>
            </div>
          )}
        </div>

        <div ref={dropdownRef} className="relative">
          <button
            type="button"
            onClick={() => setIsOpen((value) => !value)}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-2 py-1.5 hover:bg-slate-50"
          >
            <Avatar name="Barangay Clerk" />
            <ChevronDown className="h-4 w-4 text-slate-500" />
          </button>
          {isOpen && (
            <div className="absolute right-0 mt-2 w-52 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
              <button
                type="button"
                onClick={() => {
                  onSelectView("residents")
                  setIsOpen(false)
                }}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              >
                <Settings className="h-4 w-4" />
                Profile Settings
              </button>
              <button
                type="button"
                onClick={() => {
                  onSelectView("dashboard")
                  setIsOpen(false)
                }}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              >
                <Building2 className="h-4 w-4" />
                Barangay Details
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false)
                  signOut({ callbackUrl: "/login" })
                }}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

function WelcomeCard() {
  const hour = new Date().getHours()
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening"

  return (
    <Card className="overflow-hidden bg-slate-900 text-white">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-200">V5 Barangay System Dashboard</p>
          <h1 className="mt-3 text-3xl font-bold">{greeting}, Barangay Clerk</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-300">
            Monitor barangay records, respond to active judicial matters, and keep document workflows moving from a single operational view.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl bg-white/10 px-4 py-3">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Pending Queue</p>
            <p className="mt-1 text-2xl font-bold">14</p>
          </div>
          <div className="rounded-2xl bg-white/10 px-4 py-3">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Resolved Today</p>
            <p className="mt-1 text-2xl font-bold">9</p>
          </div>
        </div>
      </div>
    </Card>
  )
}

function StatCard({
  icon,
  label,
  value,
  detail,
}: {
  icon: typeof Users
  label: string
  value: string
  detail: string
}) {
  const Icon = icon

  return (
    <Card>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-3 text-3xl font-bold text-slate-900">{value}</p>
          <p className="mt-2 text-sm text-slate-500">{detail}</p>
        </div>
        <div className="rounded-2xl bg-blue-50 p-3 text-blue-600">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </Card>
  )
}

function QuickActions({ onSelectView }: { onSelectView: (view: ViewKey) => void }) {
  const [showDetails, setShowDetails] = useState(false)
  const actions = [
    { label: "Add Resident", icon: Users, view: "residents" as const },
    { label: "Generate Document", icon: FileText, view: "documents" as const },
    { label: "Log Blotter", icon: Gavel, view: "blotters" as const },
    { label: "View Alerts", icon: AlertCircle, view: "complaints" as const },
  ]

  return (
    <Card>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Quick Actions</h2>
          <p className="text-sm text-slate-500">One-click shortcuts for the daily front desk flow.</p>
        </div>
        <button
          type="button"
          onClick={() => setShowDetails((value) => !value)}
          className="rounded-lg p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-700"
        >
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </div>
      {showDetails && (
        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
          These shortcuts switch the main workspace to the matching module so staff can continue without leaving the dashboard shell.
        </div>
      )}
      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {actions.map((action) => {
          const Icon = action.icon
          return (
            <Button
              key={action.label}
              className="justify-start rounded-2xl px-4 py-4"
              variant="primary"
              onClick={() => onSelectView(action.view)}
            >
              <Icon className="h-4 w-4" />
              {action.label}
            </Button>
          )
        })}
      </div>
    </Card>
  )
}

function DashboardView({
  searchQuery,
  onSelectView,
}: {
  searchQuery: string
  onSelectView: (view: ViewKey) => void
}) {
  const activityColumns: Column<(typeof mockRecentActivity)[number]>[] = [
    {
      key: "title",
      header: "Document",
      render: (item) => (
        <div>
          <p className="font-semibold text-slate-900">{item.title}</p>
          <p className="text-xs text-slate-500">{item.module}</p>
        </div>
      ),
      sortValue: (item) => item.title,
    },
    {
      key: "requestedBy",
      header: "Requested By",
      render: (item) => <span>{formatUserName(item.requestedBy)}</span>,
      sortValue: (item) => formatUserName(item.requestedBy),
    },
    {
      key: "status",
      header: "Status",
      render: (item) => <StatusBadge status={item.status} />,
      sortValue: (item) => item.status,
    },
    {
      key: "date",
      header: "Date",
      render: (item) => <span>{formatDate(item.date)}</span>,
      sortValue: (item) => item.date,
      className: "whitespace-nowrap",
    },
  ]

  const filteredActivity = filterDocuments(searchQuery)

  return (
    <div className="space-y-6">
      <WelcomeCard />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Users} label="Residents" value="2,846" detail="32 new records this month" />
        <StatCard icon={Building2} label="Establishments" value="418" detail="12 permits awaiting verification" />
        <StatCard icon={FileText} label="Documents" value="126" detail="7 queued for release today" />
        <StatCard icon={Gavel} label="Blotters" value="23" detail="5 cases need follow-up action" />
      </div>
      <QuickActions onSelectView={onSelectView} />
      <Card>
        <div className="mb-5">
          <h2 className="text-lg font-bold text-slate-900">Recent Activity</h2>
          <p className="text-sm text-slate-500">Latest documents and requests processed by the Barangay System.</p>
        </div>
        <DataTable columns={activityColumns} data={filteredActivity} pageSize={25} />
      </Card>
    </div>
  )
}

function ResidentsView({ searchQuery }: { searchQuery: string }) {
  const residentColumns: Column<(typeof mockResidents)[number]>[] = [
    {
      key: "id",
      header: "ID",
      render: (resident) => <span className="font-medium text-slate-900">{resident.id.slice(-4)}</span>,
      sortValue: (resident) => resident.id,
    },
    {
      key: "name",
      header: "Resident",
      render: (resident) => (
        <div className="flex items-center gap-3">
          <Avatar name={resident.name} />
          <div>
            <p className="font-semibold text-slate-900">{resident.name}</p>
            <p className="text-xs text-slate-500">{resident.purok}</p>
          </div>
        </div>
      ),
      sortValue: (resident) => resident.name,
    },
    {
      key: "age",
      header: "Age",
      render: (resident) => <span>{calculateAge(resident.birthdate)}</span>,
      sortValue: (resident) => {
        const age = calculateAge(resident.birthdate)
        return age === "—" ? -1 : Number(age)
      },
    },
    {
      key: "status",
      header: "Status",
      render: (resident) => <StatusBadge status={resident.status} />,
      sortValue: (resident) => resident.status,
    },
  ]

  const filteredResidents = filterResidents(searchQuery)

  return (
    <Card>
      <div className="mb-5">
        <h2 className="text-lg font-bold text-slate-900">Residents Registry</h2>
        <p className="text-sm text-slate-500">Live roster for resident records with the age bug handled correctly.</p>
      </div>
      <DataTable columns={residentColumns} data={filteredResidents} pageSize={25} />
    </Card>
  )
}

function SeverityDot({ severity }: { severity: string }) {
  const color =
    severity === "High" ? "bg-red-600" : severity === "Medium" ? "bg-amber-500" : "bg-green-600"

  return (
    <div className="inline-flex items-center gap-2">
      <span className={`h-2.5 w-2.5 rounded-full ${color}`} />
      <span>{severity}</span>
    </div>
  )
}

function BlottersView({ searchQuery }: { searchQuery: string }) {
  const blotterColumns: Column<(typeof mockBlotters)[number]>[] = [
    {
      key: "incident",
      header: "Incident",
      render: (item) => <span className="font-medium text-slate-900">{item.incident}</span>,
      sortValue: (item) => item.incident,
    },
    {
      key: "date",
      header: "Date",
      render: (item) => <span>{formatDate(item.date)}</span>,
      sortValue: (item) => item.date,
    },
    {
      key: "severity",
      header: "Severity",
      render: (item) => <SeverityDot severity={item.severity} />,
      sortValue: (item) => item.severity,
    },
    {
      key: "status",
      header: "Status",
      render: (item) => <StatusBadge status={item.status} />,
      sortValue: (item) => item.status,
    },
  ]

  const filteredBlotters = filterBlotters(searchQuery)

  return (
    <Card>
      <div className="mb-5">
        <h2 className="text-lg font-bold text-slate-900">Blotter Desk</h2>
        <p className="text-sm text-slate-500">Judicial log for incidents, severity triage, and current blotter status.</p>
      </div>
      <DataTable columns={blotterColumns} data={filteredBlotters} pageSize={25} />
    </Card>
  )
}

function DocumentsView({ searchQuery }: { searchQuery: string }) {
  const documentColumns: Column<(typeof mockRecentActivity)[number]>[] = [
    {
      key: "id",
      header: "ID",
      render: (item) => <span className="font-medium text-slate-900">{item.id}</span>,
      sortValue: (item) => item.id,
    },
    {
      key: "title",
      header: "Document",
      render: (item) => (
        <div>
          <p className="font-semibold text-slate-900">{item.title}</p>
          <p className="text-xs text-slate-500">{item.module}</p>
        </div>
      ),
      sortValue: (item) => item.title,
    },
    {
      key: "requestedBy",
      header: "Requested By",
      render: (item) => <span>{formatUserName(item.requestedBy)}</span>,
      sortValue: (item) => formatUserName(item.requestedBy),
    },
    {
      key: "status",
      header: "Status",
      render: (item) => <StatusBadge status={item.status} />,
      sortValue: (item) => item.status,
    },
  ]

  return (
    <Card>
      <div className="mb-5">
        <h2 className="text-lg font-bold text-slate-900">Documents Module</h2>
        <p className="text-sm text-slate-500">Processing queue for certificates, clearances, endorsements, and intake forms.</p>
      </div>
      <DataTable columns={documentColumns} data={filterDocuments(searchQuery)} pageSize={25} />
    </Card>
  )
}

function ComplaintsView({ searchQuery }: { searchQuery: string }) {
  const complaintColumns: Column<(typeof mockComplaints)[number]>[] = [
    {
      key: "subject",
      header: "Complaint",
      render: (item) => <span className="font-medium text-slate-900">{item.subject}</span>,
      sortValue: (item) => item.subject,
    },
    {
      key: "complainant",
      header: "Complainant",
      render: (item) => <span>{formatUserName(item.complainant)}</span>,
      sortValue: (item) => formatUserName(item.complainant),
    },
    {
      key: "priority",
      header: "Priority",
      render: (item) => <SeverityDot severity={item.priority} />,
      sortValue: (item) => item.priority,
    },
    {
      key: "status",
      header: "Status",
      render: (item) => <StatusBadge status={item.status} />,
      sortValue: (item) => item.status,
    },
  ]

  return (
    <Card>
      <div className="mb-5">
        <h2 className="text-lg font-bold text-slate-900">Complaints Module</h2>
        <p className="text-sm text-slate-500">Front-desk complaint intake with complaint owner normalization for system-generated entries.</p>
      </div>
      <DataTable columns={complaintColumns} data={filterComplaints(searchQuery)} pageSize={25} />
    </Card>
  )
}

function EmptySearchState({ query }: { query: string }) {
  return (
    <Card className="border-dashed">
      <div className="flex flex-col items-start gap-3">
        <div className="rounded-2xl bg-slate-100 p-3 text-slate-600">
          <Search className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900">No matches found</h2>
          <p className="mt-1 max-w-xl text-sm text-slate-500">
            No records matched <span className="font-medium text-slate-700">{query}</span>. Try a resident name, document title, incident, or status keyword.
          </p>
        </div>
      </div>
    </Card>
  )
}

export default function App() {
  const [activeView, setActiveView] = useState<ViewKey>("dashboard")
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  let renderedView: ReactNode

  switch (activeView) {
    case "dashboard":
      renderedView = <DashboardView searchQuery={searchQuery} onSelectView={setActiveView} />
      break
    case "residents":
      renderedView = <ResidentsView searchQuery={searchQuery} />
      break
    case "blotters":
      renderedView = <BlottersView searchQuery={searchQuery} />
      break
    case "documents":
      renderedView = <DocumentsView searchQuery={searchQuery} />
      break
    case "complaints":
      renderedView = <ComplaintsView searchQuery={searchQuery} />
      break
    default:
      renderedView = <DashboardView searchQuery={searchQuery} onSelectView={setActiveView} />
  }

  const activeResultsCount =
    activeView === "dashboard"
      ? filterDocuments(searchQuery).length
      : activeView === "residents"
        ? filterResidents(searchQuery).length
        : activeView === "blotters"
          ? filterBlotters(searchQuery).length
          : activeView === "documents"
            ? filterDocuments(searchQuery).length
            : filterComplaints(searchQuery).length

  return (
    <main className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
      <Sidebar
        activeView={activeView}
        isCollapsed={isSidebarCollapsed}
        onSelect={setActiveView}
      />
      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <TopHeader
          isSidebarCollapsed={isSidebarCollapsed}
          onToggleSidebar={() => setIsSidebarCollapsed((value) => !value)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSelectView={setActiveView}
        />
        <div className="flex-1 overflow-y-auto p-4 lg:p-8">
          {searchQuery && activeResultsCount === 0 ? <EmptySearchState query={searchQuery} /> : renderedView}
        </div>
      </div>
    </main>
  )
}
