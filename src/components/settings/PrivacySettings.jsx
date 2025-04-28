// src/components/settings/PrivacySettings.jsx
"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function PrivacySettings() {
  const [settings, setSettings] = useState({
    profileVisibility: "public",
    showEmail: false,
    showPhone: false,
    showLocation: true,
    showEducation: true,
    showExperience: true,
    showConnections: true,
    activityVisibility: "connections",
    searchable: true,
    allowMessaging: "authenticated",
    dataSharing: {
      shareAnalytics: true,
      shareProfessionalInfo: true,
      shareAcademicInfo: true,
      shareEventHistory: false,
    },
  });

  return (
    <div className="space-y-6">
      {/* Profile Visibility */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-medium mb-4">Profile Visibility</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Profile Access</Label>
              <Select
                value={settings.profileVisibility}
                onValueChange={(value) =>
                  setSettings({ ...settings, profileVisibility: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Everyone (Public)</SelectItem>
                  <SelectItem value="alumni">ESPRIT Alumni Only</SelectItem>
                  <SelectItem value="connections">
                    My Connections Only
                  </SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                Control who can see your complete profile
              </p>
            </div>

            <Separator />

            <h4 className="font-medium">Information Visibility</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Show Email Address</Label>
                <Switch
                  checked={settings.showEmail}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, showEmail: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Show Phone Number</Label>
                <Switch
                  checked={settings.showPhone}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, showPhone: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Show Location</Label>
                <Switch
                  checked={settings.showLocation}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, showLocation: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Show Education History</Label>
                <Switch
                  checked={settings.showEducation}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, showEducation: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Show Professional Experience</Label>
                <Switch
                  checked={settings.showExperience}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, showExperience: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Show Connections</Label>
                <Switch
                  checked={settings.showConnections}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, showConnections: checked })
                  }
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activity & Interaction Settings */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-medium mb-4">Activity & Interactions</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Activity Visibility</Label>
              <Select
                value={settings.activityVisibility}
                onValueChange={(value) =>
                  setSettings({ ...settings, activityVisibility: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Everyone</SelectItem>
                  <SelectItem value="connections">Connections Only</SelectItem>
                  <SelectItem value="none">No One</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                Control who can see your activities and updates
              </p>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>Messaging Permissions</Label>
              <Select
                value={settings.allowMessaging}
                onValueChange={(value) =>
                  setSettings({ ...settings, allowMessaging: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Anyone</SelectItem>
                  <SelectItem value="authenticated">
                    Authenticated Alumni Only
                  </SelectItem>
                  <SelectItem value="connections">Connections Only</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                Control who can send you messages
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Search Visibility</Label>
                <p className="text-sm text-muted-foreground">
                  Allow others to find you in search results
                </p>
              </div>
              <Switch
                checked={settings.searchable}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, searchable: checked })
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Sharing Preferences */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-medium mb-4">Data Sharing Preferences</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Analytics & Insights</Label>
                <p className="text-sm text-muted-foreground">
                  Share anonymous data to improve alumni services
                </p>
              </div>
              <Switch
                checked={settings.dataSharing.shareAnalytics}
                onCheckedChange={(checked) =>
                  setSettings({
                    ...settings,
                    dataSharing: {
                      ...settings.dataSharing,
                      shareAnalytics: checked,
                    },
                  })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Professional Information</Label>
                <p className="text-sm text-muted-foreground">
                  Share career insights with ESPRIT for alumni statistics
                </p>
              </div>
              <Switch
                checked={settings.dataSharing.shareProfessionalInfo}
                onCheckedChange={(checked) =>
                  setSettings({
                    ...settings,
                    dataSharing: {
                      ...settings.dataSharing,
                      shareProfessionalInfo: checked,
                    },
                  })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Academic Information</Label>
                <p className="text-sm text-muted-foreground">
                  Share academic achievements for educational insights
                </p>
              </div>
              <Switch
                checked={settings.dataSharing.shareAcademicInfo}
                onCheckedChange={(checked) =>
                  setSettings({
                    ...settings,
                    dataSharing: {
                      ...settings.dataSharing,
                      shareAcademicInfo: checked,
                    },
                  })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Event Participation</Label>
                <p className="text-sm text-muted-foreground">
                  Share event attendance data for better event planning
                </p>
              </div>
              <Switch
                checked={settings.dataSharing.shareEventHistory}
                onCheckedChange={(checked) =>
                  setSettings({
                    ...settings,
                    dataSharing: {
                      ...settings.dataSharing,
                      shareEventHistory: checked,
                    },
                  })
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button variant="outline">Reset to Defaults</Button>
        <Button className="bg-gradient-to-r from-red-900 to-red-500 text-white">
          Save Changes
        </Button>
      </div>
    </div>
  );
}