import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import Index from '@/pages/Index';
import Admin from '@/pages/Admin';
import Login from '@/pages/login';
import NotFound from '@/pages/NotFound';

function App() {
  return (
    <Router>
      <Routes>
        {/* الصفحة الرئيسية */}
        <Route path="/" element={<Index />} />
        
        {/* صفحة تسجيل الدخول */}
        <Route path="/login" element={<Login />} />
        
        {/* صفحة المسؤول (محمية) */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          } 
        />
        
        {/* صفحة 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      
      {/* Toaster للإشعارات */}
      <Toaster position="top-center" richColors />
    </Router>
  );
}

export default App;