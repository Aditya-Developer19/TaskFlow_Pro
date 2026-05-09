import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  
  const from = location.state?.from?.pathname || '/app/dashboard';

  const onSubmit = (e) => {
    e.preventDefault();
    if (name.trim().length < 2) {
      setError('Please enter a valid name (at least 2 characters)');
      return;
    }
    login(name.trim());
    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-light dark:bg-surface-dark px-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img src="/favicon.svg" alt="TaskFlow Pro" className="w-12 h-12" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome</h1>
          <p className="text-sm text-gray-500 mt-2">Enter your name to access your workspace</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <Input 
            label="Your Name" 
            type="text" 
            placeholder="Jane Doe"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError('');
            }}
            error={error}
          />
          
          <Button type="submit" className="w-full mt-2">
            Enter Workspace
          </Button>
        </form>
      </Card>
    </div>
  );
}
