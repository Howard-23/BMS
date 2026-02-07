export const dynamic = 'force-dynamic'

import { db } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default async function SettingsPage() {
  const barangayInfo = await db.barangayInfo.findFirst()

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage barangay information and system settings</p>
      </div>

      <form className="space-y-6 max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle>Barangay Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Barangay Name</Label>
                <Input 
                  id="name" 
                  name="name" 
                  defaultValue={barangayInfo?.name || ""} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="district">District</Label>
                <Input 
                  id="district" 
                  name="district" 
                  defaultValue={barangayInfo?.district || ""} 
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input 
                  id="city" 
                  name="city" 
                  defaultValue={barangayInfo?.city || ""} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="province">Province</Label>
                <Input 
                  id="province" 
                  name="province" 
                  defaultValue={barangayInfo?.province || ""} 
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea 
                id="address" 
                name="address" 
                defaultValue={barangayInfo?.address || ""} 
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contactNumber">Contact Number</Label>
                <Input 
                  id="contactNumber" 
                  name="contactNumber" 
                  defaultValue={barangayInfo?.contactNumber || ""} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email"
                  defaultValue={barangayInfo?.email || ""} 
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mission & Vision</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="mission">Mission</Label>
              <Textarea 
                id="mission" 
                name="mission" 
                rows={3}
                defaultValue={barangayInfo?.mission || ""} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vision">Vision</Label>
              <Textarea 
                id="vision" 
                name="vision" 
                rows={3}
                defaultValue={barangayInfo?.vision || ""} 
              />
            </div>
          </CardContent>
        </Card>

        <Button type="submit" size="lg">
          Save Changes
        </Button>
      </form>
    </div>
  )
}
