
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from "./components/ThemeProvider";




function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AppRoutes />
        <Toaster position="top-right" toastOptions={{
          style: { fontSize: '1rem', borderRadius: '0.75rem' },
          success: { style: { background: '#e6fffa', color: '#065f46' } },
          error: { style: { background: '#fff1f2', color: '#b91c1c' } },
        }} />
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App
