"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

export function NotificationSettings() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    emailDigest: "daily",
    channels: {
      messages: {
        email: true,
        push: true,
      },
      events: {
        email: true,
        push: true,
      },
      connections: {
        email: true,
        push: true,
      },
      mentoring: {
        email: true,
        push: true,
      },
      jobOpportunities: {
        email: true,
        push: false,
      },
      news: {
        email: false,
        push: false,
      },
    },
    marketingEmails: false,
  });

  const handleChannelToggle = (channel, type) => {
    setSettings({
      ...settings,
      channels: {
        ...settings.channels,
        [channel]: {
          ...settings.channels[channel],
          [type]: !settings.channels[channel][type],
        },
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* General Notification Settings */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-medium mb-4">General Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive notifications via email
                </p>
              </div>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, emailNotifications: checked })
                }
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Push Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive browser push notifications
                </p>
              </div>
              <Switch
                checked={settings.pushNotifications}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, pushNotifications: checked })
                }
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Digest Frequency</Label>
                <p className="text-sm text-muted-foreground">
                  How often you want to receive email digests
                </p>
              </div>
              <Select
                value={settings.emailDigest}
                onValueChange={(value) =>
                  setSettings({ ...settings, emailDigest: value })
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="never">Never</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Channels */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-medium mb-4">Notification Preferences</h3>
          <div className="space-y-6">
            {Object.entries(settings.channels).map(([channel, values]) => (
              <div key={channel}>
                <div className="flex items-center justify-between mb-2">
                  <Label className="capitalize">
                    {channel.replace(/([A-Z])/g, " $1").trim()}
                  </Label>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Label htmlFor={`${channel}-email`} className="text-sm">
                        Email
                      </Label>
                      <Switch
                        id={`${channel}-email`}
                        checked={values.email}
                        onCheckedChange={() =>
                          handleChannelToggle(channel, "email")
                        }
                        disabled={!settings.emailNotifications}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Label htmlFor={`${channel}-push`} className="text-sm">
                        Push
                      </Label>
                      <Switch
                        id={`${channel}-push`}
                        checked={values.push}
                        onCheckedChange={() =>
                          handleChannelToggle(channel, "push")
                        }
                        disabled={!settings.pushNotifications}
                      />
                    </div>
                  </div>
                </div>
                <Separator className="mt-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Marketing Preferences */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-medium mb-4">Marketing Preferences</h3>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Marketing Emails</Label>
              <p className="text-sm text-muted-foreground">
                Receive updates about alumni events, opportunities, and news
              </p>
            </div>
            <Switch
              checked={settings.marketingEmails}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, marketingEmails: checked })
              }
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button variant="outline">Cancel</Button>
        <Button className="bg-gradient-to-r from-red-900 to-red-500 text-white">
          Save Changes
        </Button>
      </div>
    </div>
  );
}