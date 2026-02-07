"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft } from "lucide-react"
import { toast } from "sonner"

export default function NewIncidentPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)

    try {
      const response = await fetch("/api/incidents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          incidentType: formData.get("incidentType"),
          incidentDate: formData.get("incidentDate"),
          incidentLocation: formData.get("incidentLocation"),
          description: formData.get("description"),
          complainantName: formData.get("complainantName"),
          complainantAddress: formData.get("complainantAddress"),
          complainantContact: formData.get("complainantContact"),
          respondentName: formData.get("respondentName"),
          respondentAddress: formData.get("respondentAddress"),
          respondentContact: formData.get("respondentContact"),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create incident report")
      }

      toast.success("Incident report created successfully!")
      router.push("/incidents")
    } catch (error) {
      toast.error("Failed to create incident report")
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/incidents">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Report Incident</h1>
          <p className="text-muted-foreground">Create a new incident or blotter report</p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Incident Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="incidentType">Incident Type *</Label>
                <Input
                  id="incidentType"
                  name="incidentType"
                  placeholder="e.g., Theft, Assault, Noise Complaint"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="incidentDate">Date & Time *</Label>
                <Input
                  id="incidentDate"
                  name="incidentDate"
                  type="datetime-local"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="incidentLocation">Location *</Label>
              <Input
                id="incidentLocation"
                name="incidentLocation"
                placeholder="Where did the incident occur?"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                name="description"
                rows={5}
                placeholder="Detailed description of the incident..."
                required
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Complainant Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="complainantName">Full Name *</Label>
              <Input
                id="complainantName"
                name="complainantName"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="complainantAddress">Address</Label>
                <Input
                  id="complainantAddress"
                  name="complainantAddress"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="complainantContact">Contact Number</Label>
                <Input
                  id="complainantContact"
                  name="complainantContact"
                  type="tel"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Respondent Information (if applicable)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="respondentName">Full Name</Label>
              <Input
                id="respondentName"
                name="respondentName"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="respondentAddress">Address</Label>
                <Input
                  id="respondentAddress"
                  name="respondentAddress"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="respondentContact">Contact Number</Label>
                <Input
                  id="respondentContact"
                  name="respondentContact"
                  type="tel"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button type="submit" size="lg" disabled={loading}>
            {loading ? "Submitting..." : "Submit Report"}
          </Button>
          <Button type="button" variant="outline" size="lg" asChild>
            <Link href="/incidents">Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  )
}
