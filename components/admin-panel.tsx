"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Lock, Save, Eye, EyeOff } from "lucide-react"
import { updateApiCredentials } from "@/lib/meme-service"

export default function AdminPanel() {
  const { toast } = useToast()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [username, setUsername] = useState("olalekancodes")
  const [apiPassword, setApiPassword] = useState("Rokeeb.6127#")
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAuthenticate = () => {
    if (password === "asJrA.61271895$") {
      setIsAuthenticated(true)
      toast({
        title: "Authentication successful",
        description: "You now have admin access",
      })
    } else {
      toast({
        title: "Authentication failed",
        description: "Incorrect password",
        variant: "destructive",
      })
    }
    setPassword("")
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      await updateApiCredentials(username, apiPassword)
      toast({
        title: "Credentials updated",
        description: "API credentials have been successfully updated",
      })
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Could not update API credentials",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Admin Authentication
          </CardTitle>
          <CardDescription>Enter the admin password to access credential management</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="admin-password">Admin Password</Label>
              <Input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleAuthenticate} className="w-full">
            Authenticate
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>API Credentials Management</CardTitle>
        <CardDescription>Update the Imgflip API credentials used for meme generation</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="api-username">Imgflip Username</Label>
            <Input
              id="api-username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter Imgflip username"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="api-password">Imgflip Password</Label>
            <div className="relative">
              <Input
                id="api-password"
                type={showPassword ? "text" : "password"}
                value={apiPassword}
                onChange={(e) => setApiPassword(e.target.value)}
                placeholder="Enter Imgflip password"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSubmit} disabled={isSubmitting || !username || !apiPassword} className="w-full">
          {isSubmitting ? (
            <>Updating...</>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Credentials
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
