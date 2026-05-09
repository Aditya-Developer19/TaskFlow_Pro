import { useState } from 'react';
import { Dialog } from '../../components/ui/Dialog';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import toast from 'react-hot-toast';

export default function InviteModal({ open, onOpenChange }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInvite = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      toast.success(`Invite sent to ${email}`);
      setLoading(false);
      setEmail('');
      onOpenChange(false);
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange} title="Invite to Workspace">
      <form onSubmit={handleInvite} className="space-y-4">
        <p className="text-sm text-gray-500">
          Invite new members to collaborate on tasks in this workspace.
        </p>
        <Input 
          label="Email address" 
          type="email" 
          placeholder="colleague@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <div className="flex justify-end space-x-3 pt-2">
          <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" isLoading={loading}>
            Send Invite
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
