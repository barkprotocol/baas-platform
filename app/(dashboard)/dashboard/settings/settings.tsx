'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"

const profileSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  bio: z.string().max(160, { message: "Bio must not exceed 160 characters." }).optional(),
})

const securitySchema = z.object({
  currentPassword: z.string().min(8, { message: "Password must be at least 8 characters." }),
  newPassword: z.string().min(8, { message: "Password must be at least 8 characters." }),
  confirmPassword: z.string().min(8, { message: "Password must be at least 8 characters." }),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

type ProfileFormData = z.infer<typeof profileSchema>
type SecurityFormData = z.infer<typeof securitySchema>

export function Settings() {
  const [twoFAEnabled, setTwoFAEnabled] = useState(false)
  
  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      email: "",
      bio: "",
    },
  })

  const securityForm = useForm<SecurityFormData>({
    resolver: zodResolver(securitySchema),
  })

  const onProfileSubmit = (data: ProfileFormData) => {
    // Here you would typically send this data to your backend
    console.log(data)
    toast({
      title: "Profile Updated",
      description: "Your profile information has been updated successfully.",
    })
  }

  const onSecuritySubmit = (data: SecurityFormData) => {
    // Here you would typically send this data to your backend
    console.log(data)
    toast({
      title: "Security Settings Updated",
      description: "Your security settings have been updated successfully.",
    })
  }

  const handleTwoFAToggle = (checked: boolean) => {
    setTwoFAEnabled(checked)
    // Here you would typically enable/disable 2FA on your backend
    toast({
      title: `Two-Factor Authentication ${checked ? 'Enabled' : 'Disabled'}`,
      description: `You have successfully ${checked ? 'enabled' : 'disabled'} two-factor authentication.`,
    })
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Account Settings</h1>
      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your account profile information here.</CardDescription>
            </CardHeader>
            <form onSubmit={profileForm.handleSubmit(onProfileSubmit)}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" {...profileForm.register("name")} />
                  {profileForm.formState.errors.name && (
                    <p className="text-sm text-red-500">{profileForm.formState.errors.name.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" {...profileForm.register("email")} />
                  {profileForm.formState.errors.email && (
                    <p className="text-sm text-red-500">{profileForm.formState.errors.email.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Input id="bio" {...profileForm.register("bio")} />
                  {profileForm.formState.errors.bio && (
                    <p className="text-sm text-red-500">{profileForm.formState.errors.bio.message}</p>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit">Save Changes</Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage your account security settings here.</CardDescription>
            </CardHeader>
            <form onSubmit={securityForm.handleSubmit(onSecuritySubmit)}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input id="currentPassword" type="password" {...securityForm.register("currentPassword")} />
                  {securityForm.formState.errors.currentPassword && (
                    <p className="text-sm text-red-500">{securityForm.formState.errors.currentPassword.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input id="newPassword" type="password" {...securityForm.register("newPassword")} />
                  {securityForm.formState.errors.newPassword && (
                    <p className="text-sm text-red-500">{securityForm.formState.errors.newPassword.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input id="confirmPassword" type="password" {...securityForm.register("confirmPassword")} />
                  {securityForm.formState.errors.confirmPassword && (
                    <p className="text-sm text-red-500">{securityForm.formState.errors.confirmPassword.message}</p>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="2fa" checked={twoFAEnabled} onCheckedChange={handleTwoFAToggle} />
                  <Label htmlFor="2fa">Enable Two-Factor Authentication</Label>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit">Update Security Settings</Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Manage how you receive notifications.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="emailNotifications">Email Notifications</Label>
                <Select defaultValue="all">
                  <SelectTrigger id="emailNotifications">
                    <SelectValue placeholder="Select email notification preference" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Notifications</SelectItem>
                    <SelectItem value="important">Important Only</SelectItem>
                    <SelectItem value="none">No Notifications</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="marketingEmails" />
                <Label htmlFor="marketingEmails">Receive Marketing Emails</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="activityDigest" />
                <Label htmlFor="activityDigest">Receive Weekly Activity Digest</Label>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Notification Preferences</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}