import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext';
import { PreferencesProvider } from './context/PreferencesContext';
import { AuthProvider } from './features/auth/AuthContext';
import AppRouter from './routes/AppRouter';
import ErrorBoundary from './components/ui/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <PreferencesProvider>
          <AuthProvider>
            <AppRouter />
            <Toaster position="bottom-right" />
          </AuthProvider>
        </PreferencesProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
