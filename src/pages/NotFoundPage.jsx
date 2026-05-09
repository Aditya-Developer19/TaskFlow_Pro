import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-surface-light dark:bg-surface-dark p-4">
      <div className="text-center space-y-6 max-w-md">
        <h1 className="text-9xl font-bold text-brand-500">404</h1>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Page not found</h2>
        <p className="text-gray-500">
          Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been moved or deleted.
        </p>
        <Link to="/">
          <Button size="lg" className="mt-4">Back to Home</Button>
        </Link>
      </div>
    </div>
  );
}
