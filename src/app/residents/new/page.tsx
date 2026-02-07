"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft } from "lucide-react"
import { toast } from "sonner"

export default function NewResidentPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData.entries())

    try {
      const response = await fetch("/api/residents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          isVoter: data.isVoter === "on",
          isSeniorCitizen: data.isSeniorCitizen === "on",
          isPwd: data.isPwd === "on",
          isSoloParent: data.isSoloParent === "on",
          isIndigent: data.isIndigent === "on",
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create resident")
      }

      const resident = await response.json()
      toast.success("Resident created successfully!")
      router.push(`/residents/${resident.id}`)
    } catch (error) {
      toast.error("Failed to create resident")
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/residents">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Add New Resident</h1>
          <p className="text-muted-foreground">Create a new resident record</p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input id="firstName" name="firstName" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="middleName">Middle Name</Label>
              <Input id="middleName" name="middleName" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input id="lastName" name="lastName" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="suffix">Suffix</Label>
              <Input id="suffix" name="suffix" placeholder="Jr., Sr., III" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="birthDate">Birth Date *</Label>
              <Input id="birthDate" name="birthDate" type="date" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="birthPlace">Birth Place</Label>
              <Input id="birthPlace" name="birthPlace" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Gender *</Label>
              <select
                id="gender"
                name="gender"
                required
                className="w-full px-3 py-2 rounded-md border bg-background"
              >
                <option value="">Select Gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="civilStatus">Civil Status</Label>
              <select
                id="civilStatus"
                name="civilStatus"
                className="w-full px-3 py-2 rounded-md border bg-background"
              >
                <option value="SINGLE">Single</option>
                <option value="MARRIED">Married</option>
                <option value="WIDOWED">Widowed</option>
                <option value="SEPARATED">Separated</option>
                <option value="DIVORCED">Divorced</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bloodType">Blood Type</Label>
              <select
                id="bloodType"
                name="bloodType"
                className="w-full px-3 py-2 rounded-md border bg-background"
              >
                <option value="">Select Blood Type</option>
                <option value="A_POS">A+</option>
                <option value="A_NEG">A-</option>
                <option value="B_POS">B+</option>
                <option value="B_NEG">B-</option>
                <option value="AB_POS">AB+</option>
                <option value="AB_NEG">AB-</option>
                <option value="O_POS">O+</option>
                <option value="O_NEG">O-</option>
              </select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" name="phone" type="tel" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">Address *</Label>
              <Textarea id="address" name="address" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="purok">Purok/Zone</Label>
              <Input id="purok" name="purok" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Identification</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="philhealthId">PhilHealth ID</Label>
              <Input id="philhealthId" name="philhealthId" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sssId">SSS ID</Label>
              <Input id="sssId" name="sssId" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tin">TIN</Label>
              <Input id="tin" name="tin" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="votersId">Voter&apos;s ID</Label>
              <Input id="votersId" name="votersId" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="precinctNumber">Precinct Number</Label>
              <Input id="precinctNumber" name="precinctNumber" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Employment & Education</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="occupation">Occupation</Label>
              <Input id="occupation" name="occupation" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="employmentStatus">Employment Status</Label>
              <select
                id="employmentStatus"
                name="employmentStatus"
                className="w-full px-3 py-2 rounded-md border bg-background"
              >
                <option value="">Select Status</option>
                <option value="Employed">Employed</option>
                <option value="Self-employed">Self-employed</option>
                <option value="Unemployed">Unemployed</option>
                <option value="Student">Student</option>
                <option value="Retired">Retired</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="educationalAttainment">Educational Attainment</Label>
              <Input id="educationalAttainment" name="educationalAttainment" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="schoolLastAttended">School Last Attended</Label>
              <Input id="schoolLastAttended" name="schoolLastAttended" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Family Information</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="fatherName">Father&apos;s Name</Label>
              <Input id="fatherName" name="fatherName" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="motherName">Mother&apos;s Name</Label>
              <Input id="motherName" name="motherName" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="spouseName">Spouse&apos;s Name</Label>
              <Input id="spouseName" name="spouseName" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Special Categories & Emergency Contact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="flex items-center space-x-2">
                <Checkbox id="isVoter" name="isVoter" />
                <Label htmlFor="isVoter" className="font-normal">Registered Voter</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="isSeniorCitizen" name="isSeniorCitizen" />
                <Label htmlFor="isSeniorCitizen" className="font-normal">Senior Citizen</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="isPwd" name="isPwd" />
                <Label htmlFor="isPwd" className="font-normal">PWD</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="isSoloParent" name="isSoloParent" />
                <Label htmlFor="isSoloParent" className="font-normal">Solo Parent</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="isIndigent" name="isIndigent" />
                <Label htmlFor="isIndigent" className="font-normal">Indigent</Label>
              </div>
            </div>
            <div className="grid gap-6 md:grid-cols-3 pt-4 border-t">
              <div className="space-y-2">
                <Label htmlFor="emergencyContactName">Emergency Contact Name</Label>
                <Input id="emergencyContactName" name="emergencyContactName" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergencyContactPhone">Emergency Contact Phone</Label>
                <Input id="emergencyContactPhone" name="emergencyContactPhone" type="tel" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergencyContactRelationship">Relationship</Label>
                <Input id="emergencyContactRelationship" name="emergencyContactRelationship" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Remarks</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea id="remarks" name="remarks" rows={4} />
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button type="submit" size="lg" disabled={loading}>
            {loading ? "Creating..." : "Create Resident"}
          </Button>
          <Button type="button" variant="outline" size="lg" asChild>
            <Link href="/residents">Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  )
}
