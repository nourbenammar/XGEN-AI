"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

import { ProfileSettings } from "@/components/settings/ProfileSettings";
import { NotificationSettings } from "@/components/settings/NotificationSettings";
import { PrivacySettings } from "@/components/settings/PrivacySettings";
import { AccountSettings } from "@/components/settings/AccountSettings";
import { AppearanceSettings } from "@/components/settings/AppearanceSettings";
import { EducationSettings } from "@/components/settings/EducationSettings";
import { ExperienceSettings } from "@/components/settings/ExperienceSettings";
import { ExportDataSettings } from "@/components/settings/ExportDataSettings";

const settingsSections = [
  {
    id: "profile",
    icon: "User",
    title: "Profile",
    description: "Manage your personal information and public profile",
    component: ProfileSettings,
  },
  {
    id: "notifications",
    icon: "Bell",
    title: "Notifications",
    description: "Configure how you want to receive notifications",
    component: NotificationSettings,
  },
  {
    id: "privacy",
    icon: "Shield",
    title: "Privacy",
    description: "Control your privacy settings and data sharing preferences",
    component: PrivacySettings,
  },
  {
    id: "account",
    icon: "Settings",
    title: "Account",
    description: "Manage your account settings and preferences",
    component: AccountSettings,
  },
  {
    id: "appearance",
    icon: "Palette",
    title: "Appearance",
    description: "Customize the look and feel of your interface",
    component: AppearanceSettings,
  },
  {
    id: "education",
    icon: "GraduationCap",
    title: "Education",
    description: "Update your academic history and certifications",
    component: EducationSettings,
  },
  {
    id: "experience",
    icon: "Briefcase",
    title: "Experience",
    description: "Manage your professional experience and skills",
    component: ExperienceSettings,
  },
  {
    id: "data",
    icon: "Database",
    title: "Data & Export",
    description: "Export your data and manage data preferences",
    component: ExportDataSettings,
  },
];

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>
      <Separator />

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="w-full h-auto flex flex-wrap gap-2 bg-transparent p-0 justify-start">
          {settingsSections.map((section) => (
            <TabsTrigger
              key={section.id}
              value={section.id}
              className="rounded-lg px-4 py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-900 data-[state=active]:to-red-500 data-[state=active]:text-white"
            >
              {section.title}
            </TabsTrigger>
          ))}
        </TabsList>

        {settingsSections.map((section) => (
          <TabsContent
            key={section.id}
            value={section.id}
            className="space-y-6"
          >
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">
                {section.title}
              </h2>
              <p className="text-muted-foreground">{section.description}</p>
            </div>
            <Separator />
            <section.component />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}