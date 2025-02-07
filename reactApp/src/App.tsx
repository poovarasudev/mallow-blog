import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/components/layout/navbar";
import ProtectedRoute from "@/components/auth/protected-route";
import Login from "@/pages/login";
import Signup from "@/pages/signup";
import ForgotPassword from "@/pages/forgot-password";
import ResetPassword from "@/pages/reset-password";
import EmailVerification from "@/pages/email-verification";
import Dashboard from "@/pages/dashboard";
import BlogPost from "@/pages/blog/[id]";
import { AnimatePresence, motion } from "framer-motion";

function App() {
    const location = useLocation();
  return (
      <div>
      <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
              key={location.pathname}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.6, delay: 0.5 } }}
              exit={{ opacity: 0, y: "100vh", transition: { duration: 0.5 } }}
          >
    <Router>
      {/*<Navbar />*/}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/email/verify/:id/:hash" element={<EmailVerification />} />
        <Route
          path="/dashboard"
          element={
            // <ProtectedRoute>
              <Dashboard />
            // </ProtectedRoute>
          }
        />
        <Route
          path="/blog/:id"
          element={
            <ProtectedRoute>
              <BlogPost />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Toaster />
    </Router>
          </motion.div>
      </AnimatePresence>
      </div>
  );
}

export default App;
