"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

export function ExportDataSettings() {
  const [settings, setSettings] = useState({
    exportFormat: "json",
    includeProfile: true,
    includeEducation: true,
    includeExperience: true,
    includeConnections: true,
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-medium mb-4">Export Data</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Export Format</Label>
              <select
                value={settings.exportFormat}
                onChange={(e) =>
                  setSettings({ ...settings, exportFormat: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="json">JSON</option>
                <option value="csv">CSV</option>
                <option value="pdf">PDF</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <Label>Include Profile Information</Label>
              <Switch
                checked={settings.includeProfile}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, includeProfile: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label>Include Education History</Label>
              <Switch
                checked={settings.includeEducation}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, includeEducation: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label>Include Professional Experience</Label>
              <Switch
                checked={settings.includeExperience}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, includeExperience: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label>Include Connections</Label>
              <Switch
                checked={settings.includeConnections}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, includeConnections: checked })
                }
              />
            </div>

            <Button className="bg-gradient-to-r from-red-900 to-red-500 text-white">
              Export Data
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}