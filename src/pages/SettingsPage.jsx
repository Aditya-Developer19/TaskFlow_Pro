import { useState } from 'react';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';
import { Avatar } from '../components/ui/Avatar';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';

export default function SettingsPage() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 800);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-sm text-gray-500">Manage your account and application preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1">
          <nav className="flex flex-col space-y-1">
            <button className="px-3 py-2 text-left text-sm font-medium rounded-md bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white">
              Profile
            </button>
            <button className="px-3 py-2 text-left text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800/50">
              Appearance
            </button>
            <button className="px-3 py-2 text-left text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800/50">
              Notifications
            </button>
          </nav>
        </div>

        <div className="md:col-span-3 space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-medium mb-4">Profile</h2>
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar src={user?.photoURL} initials={user?.displayName} size="xl" />
                <div>
                  <Button variant="secondary" size="sm">Change Avatar</Button>
                  <p className="text-xs text-gray-500 mt-2">JPG, GIF or PNG. 1MB max.</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                <Input label="Display Name" defaultValue={user?.displayName || ''} />
                <Input label="Email" type="email" defaultValue={user?.email || ''} disabled />
              </div>

              <div className="pt-4 flex justify-end border-t border-gray-100 dark:border-gray-800">
                <Button onClick={handleSave} isLoading={isSaving}>Save Changes</Button>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-medium mb-4">Appearance</h2>
            <div className="space-y-4">
              <Select 
                label="Theme" 
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                options={[
                  { label: 'System', value: 'system' },
                  { label: 'Light', value: 'light' },
                  { label: 'Dark', value: 'dark' }
                ]}
              />
            </div>
          </Card>

          <Card className="p-6 border-red-200 dark:border-red-900/50">
            <h2 className="text-lg font-medium text-red-600 dark:text-red-400 mb-4">Danger Zone</h2>
            <p className="text-sm text-gray-500 mb-4">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <Button variant="danger">Delete Account</Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
