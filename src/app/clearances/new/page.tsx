"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Search } from "lucide-react"
import { toast } from "sonner"
import type { Resident } from "@/types"

function NewClearanceContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const preselectedResidentId = searchParams.get("residentId")
  
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [residents, setResidents] = useState<Resident[]>([])
  const [selectedResident, setSelectedResident] = useState<Resident | null>(null)
  const [showSearch, setShowSearch] = useState(!preselectedResidentId)

  useEffect(() => {
    if (preselectedResidentId) {
      fetch(`/api/residents/${preselectedResidentId}`)
        .then(res => res.json())
        .then(data => setSelectedResident(data))
    }
  }, [preselectedResidentId])

  useEffect(() => {
    if (searchQuery.length >= 2) {
      fetch(`/api/residents?q=${encodeURIComponent(searchQuery)}`)
        .then(res => res.json())
        .then(data => setResidents(data))
    }
  }, [searchQuery])

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!selectedResident) {
      toast.error("Please select a resident")
      return
    }

    setLoading(true)
    const formData = new FormData(e.currentTarget)

    try {
      const response = await fetch("/api/clearances", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          residentId: selectedResident.id,
          purpose: formData.get("purpose"),
          amount: parseFloat(formData.get("amount") as string) || 50,
          ctcNo: formData.get("ctcNo"),
          orNo: formData.get("orNo"),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create clearance")
      }

      const clearance = await response.json()
      toast.success("Clearance issued successfully!")
      router.push(`/clearances`)
    } catch (error) {
      toast.error("Failed to issue clearance")
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/clearances">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Issue Barangay Clearance</h1>
          <p className="text-muted-foreground">Create a new barangay clearance certificate</p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Select Resident</CardTitle>
          </CardHeader>
          <CardContent>
            {showSearch ? (
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search residents by name or ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                {residents.length > 0 && (
                  <div className="border rounded-md divide-y">
                    {residents.map((resident) => (
                      <button
                        key={resident.id}
                        type="button"
                        className="w-full px-4 py-3 text-left hover:bg-muted flex items-center justify-between"
                        onClick={() => {
                          setSelectedResident(resident)
                          setShowSearch(false)
                          setResidents([])
                          setSearchQuery("")
                        }}
                      >
                        <div>
                          <p className="font-medium">{resident.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {resident.barangayId} • {resident.purok || "No purok"}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : selectedResident ? (
              <div className="p-4 border rounded-md bg-muted/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">
                      {selectedResident.firstName} {selectedResident.lastName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {selectedResident.barangayId}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {selectedResident.address}
                    </p>
                  </div>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setShowSearch(true)}
                  >
                    Change
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">Search and select a resident</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Clearance Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="purpose">Purpose *</Label>
              <Textarea
                id="purpose"
                name="purpose"
                placeholder="e.g., Employment, Business Permit, School Requirement"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Fee Amount *</Label>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  defaultValue={50}
                  min={0}
                  step={0.01}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ctcNo">CTC Number</Label>
                <Input
                  id="ctcNo"
                  name="ctcNo"
                  placeholder="Community Tax Certificate"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="orNo">O.R. Number</Label>
              <Input
                id="orNo"
                name="orNo"
                placeholder="Official Receipt Number"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button 
            type="submit" 
            size="lg" 
            disabled={loading || !selectedResident}
          >
            {loading ? "Issuing..." : "Issue Clearance"}
          </Button>
          <Button type="button" variant="outline" size="lg" asChild>
            <Link href="/clearances">Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  )
}

export default function NewClearancePage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    }>
      <NewClearanceContent />
    </Suspense>
  )
}
