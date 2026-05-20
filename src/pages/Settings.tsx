import React, { useState } from 'react';
import { Header } from '../components/layout/Header';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, Select } from '../components/ui/FormElements';
import {
  Settings as SettingsIcon,
  Bell,
  Shield,
  Palette,
  Database,
  Globe,
  Save,
} from 'lucide-react';

export function Settings() {
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', label: 'General', icon: SettingsIcon },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'data', label: 'Data Management', icon: Database },
  ];

  return (
    <div className="min-h-screen">
      <Header title="Settings" subtitle="v1.0" />

      <div className="p-6">
        <div className="flex gap-6">
          {/* Sidebar Tabs */}
          <div className="w-64 flex-shrink-0">
            <Card className="!p-2">
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-[#3b82f6]/10 text-[#3b82f6]'
                        : 'text-[#64748b] hover:bg-[#f0f4f8]'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    <span className="font-medium text-sm">{tab.label}</span>
                  </button>
                ))}
              </nav>
            </Card>
          </div>

          {/* Content */}
          <div className="flex-1">
            {activeTab === 'general' && <GeneralSettings />}
            {activeTab === 'notifications' && <NotificationSettings />}
            {activeTab === 'security' && <SecuritySettings />}
            {activeTab === 'appearance' && <AppearanceSettings />}
            {activeTab === 'data' && <DataSettings />}
          </div>
        </div>
      </div>
    </div>
  );
}

function GeneralSettings() {
  return (
    <Card title="General Settings">
      <div className="space-y-6">
        <div>
          <h3 className="font-semibold text-[#0f172a] mb-4">Organization</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Organization Name" defaultValue="Material Library" />
            <Input label="Contact Email" type="email" defaultValue="admin@company.com" />
          </div>
        </div>

        <div className="border-t border-[#e2e8f0] pt-6">
          <h3 className="font-semibold text-[#0f172a] mb-4">Regional Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Default Language"
              options={[
                { value: 'en', label: 'English' },
                { value: 'zh', label: '中文' },
              ]}
              defaultValue="en"
            />
            <Select
              label="Default Currency"
              options={[
                { value: 'USD', label: 'USD ($)' },
                { value: 'EUR', label: 'EUR (€)' },
                { value: 'CNY', label: 'CNY (¥)' },
              ]}
              defaultValue="USD"
            />
            <Select
              label="Default Unit System"
              options={[
                { value: 'metric', label: 'Metric (cm, kg)' },
                { value: 'imperial', label: 'Imperial (in, lb)' },
              ]}
              defaultValue="metric"
            />
            <Select
              label="Date Format"
              options={[
                { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
                { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
                { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
              ]}
              defaultValue="YYYY-MM-DD"
            />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-[#e2e8f0]">
          <Button>
            <Save className="w-4 h-4" />
            Save Changes
          </Button>
        </div>
      </div>
    </Card>
  );
}

function NotificationSettings() {
  return (
    <Card title="Notification Settings">
      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="font-semibold text-[#0f172a]">Email Notifications</h3>
          <NotificationToggle
            label="Material approval requests"
            description="Get notified when new materials need approval"
            defaultChecked
          />
          <NotificationToggle
            label="Low stock alerts"
            description="Alert when materials are running low"
            defaultChecked
          />
          <NotificationToggle
            label="Supplier updates"
            description="Get notified of supplier information changes"
          />
          <NotificationToggle
            label="Weekly summary"
            description="Receive weekly summary of library activity"
          />
        </div>

        <div className="border-t border-[#e2e8f0] pt-6">
          <h3 className="font-semibold text-[#0f172a] mb-4">System Notifications</h3>
          <NotificationToggle
            label="Browser notifications"
            description="Show desktop notifications for important events"
          />
        </div>

        <div className="flex justify-end pt-4 border-t border-[#e2e8f0]">
          <Button>
            <Save className="w-4 h-4" />
            Save Changes
          </Button>
        </div>
      </div>
    </Card>
  );
}

function SecuritySettings() {
  return (
    <Card title="Security Settings">
      <div className="space-y-6">
        <div>
          <h3 className="font-semibold text-[#0f172a] mb-4">Password</h3>
          <div className="space-y-4 max-w-md">
            <Input label="Current Password" type="password" />
            <Input label="New Password" type="password" />
            <Input label="Confirm New Password" type="password" />
          </div>
        </div>

        <div className="border-t border-[#e2e8f0] pt-6">
          <h3 className="font-semibold text-[#0f172a] mb-4">Two-Factor Authentication</h3>
          <NotificationToggle
            label="Enable 2FA"
            description="Add an extra layer of security to your account"
          />
        </div>

        <div className="border-t border-[#e2e8f0] pt-6">
          <h3 className="font-semibold text-[#0f172a] mb-4">Session Settings</h3>
          <div className="max-w-xs">
            <Select
              label="Session Timeout"
              options={[
                { value: '30', label: '30 minutes' },
                { value: '60', label: '1 hour' },
                { value: '120', label: '2 hours' },
                { value: '480', label: '8 hours' },
              ]}
              defaultValue="60"
            />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-[#e2e8f0]">
          <Button>
            <Save className="w-4 h-4" />
            Update Password
          </Button>
        </div>
      </div>
    </Card>
  );
}

function AppearanceSettings() {
  return (
    <Card title="Appearance Settings">
      <div className="space-y-6">
        <div>
          <h3 className="font-semibold text-[#0f172a] mb-4">Theme</h3>
          <div className="grid grid-cols-3 gap-4 max-w-md">
            <ThemeOption label="Light" active />
            <ThemeOption label="Dark" />
            <ThemeOption label="System" />
          </div>
        </div>

        <div className="border-t border-[#e2e8f0] pt-6">
          <h3 className="font-semibold text-[#0f172a] mb-4">Accent Color</h3>
          <div className="flex gap-3">
            {['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'].map((color) => (
              <button
                key={color}
                className={`w-10 h-10 rounded-lg border-2 ${
                  color === '#3b82f6' ? 'border-[#0f172a]' : 'border-transparent'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        <div className="border-t border-[#e2e8f0] pt-6">
          <h3 className="font-semibold text-[#0f172a] mb-4">Sidebar</h3>
          <NotificationToggle
            label="Collapse sidebar by default"
            description="Start with a collapsed sidebar on page load"
          />
          <NotificationToggle
            label="Show icons only when collapsed"
            description="Display only icons when sidebar is collapsed"
            defaultChecked
          />
        </div>

        <div className="flex justify-end pt-4 border-t border-[#e2e8f0]">
          <Button>
            <Save className="w-4 h-4" />
            Save Changes
          </Button>
        </div>
      </div>
    </Card>
  );
}

function DataSettings() {
  return (
    <Card title="Data Management">
      <div className="space-y-6">
        <div>
          <h3 className="font-semibold text-[#0f172a] mb-4">Export Data</h3>
          <p className="text-sm text-[#64748b] mb-4">
            Download all your data for backup or transfer purposes.
          </p>
          <div className="flex gap-3">
            <Button variant="secondary">Export Materials (CSV)</Button>
            <Button variant="secondary">Export Suppliers (CSV)</Button>
          </div>
        </div>

        <div className="border-t border-[#e2e8f0] pt-6">
          <h3 className="font-semibold text-[#0f172a] mb-4">Import Data</h3>
          <p className="text-sm text-[#64748b] mb-4">
            Import materials or suppliers from CSV files.
          </p>
          <Button variant="secondary">Import from CSV</Button>
        </div>

        <div className="border-t border-[#e2e8f0] pt-6">
          <h3 className="font-semibold text-[#ef4444] mb-4">Danger Zone</h3>
          <div className="bg-[#fef2f2] border border-[#ef4444]/20 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-[#0f172a]">Delete All Data</p>
                <p className="text-sm text-[#64748b]">
                  Permanently delete all materials, suppliers, and settings.
                </p>
              </div>
              <Button variant="danger">Delete All</Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

// Helper Components
function NotificationToggle({
  label,
  description,
  defaultChecked,
}: {
  label: string;
  description: string;
  defaultChecked?: boolean;
}) {
  const [checked, setChecked] = useState(defaultChecked || false);

  return (
    <div className="flex items-center justify-between py-3 border-b border-[#f1f5f9] last:border-0">
      <div>
        <p className="font-medium text-sm text-[#0f172a]">{label}</p>
        <p className="text-xs text-[#94a3b8]">{description}</p>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-[#e2e8f0] peer-focus:ring-2 peer-focus:ring-[#3b82f6]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#3b82f6]"></div>
      </label>
    </div>
  );
}

function ThemeOption({ label, active }: { label: string; active?: boolean }) {
  return (
    <button
      className={`p-4 rounded-lg border-2 transition-colors ${
        active ? 'border-[#3b82f6] bg-[#3b82f6]/5' : 'border-[#e2e8f0] hover:border-[#cbd5e1]'
      }`}
    >
      <div className="w-full h-20 bg-[#f0f4f8] rounded mb-2" />
      <p className="text-sm font-medium text-[#0f172a]">{label}</p>
    </button>
  );
}