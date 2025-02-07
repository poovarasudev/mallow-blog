import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import api from '@/lib/axios';

export default function EmailVerification() {
  const [verifying, setVerifying] = useState(true);
  const [success, setSuccess] = useState(false);
  const { id, hash } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        await api.get(`/email/verify/${id}/${hash}`);
        setSuccess(true);
        toast.success('Email verified successfully!');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } catch (error) {
        setSuccess(false);
        toast.error('Failed to verify email. Please try again.');
      } finally {
        setVerifying(false);
      }
    };

    verifyEmail();
  }, [id, hash, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full mx-auto p-6"
      >
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm text-center">
          {verifying ? (
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <h2 className="text-2xl font-semibold">Verifying your email...</h2>
              <p className="text-muted-foreground">Please wait while we verify your email address.</p>
            </div>
          ) : success ? (
            <div className="flex flex-col items-center gap-4">
              <CheckCircle2 className="h-12 w-12 text-green-500" />
              <h2 className="text-2xl font-semibold">Email Verified!</h2>
              <p className="text-muted-foreground">Your email has been successfully verified.</p>
              <p className="text-sm text-muted-foreground">Redirecting to login...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <XCircle className="h-12 w-12 text-red-500" />
              <h2 className="text-2xl font-semibold">Verification Failed</h2>
              <p className="text-muted-foreground">We couldn't verify your email address.</p>
              <Button
                onClick={() => navigate('/login')}
                className="mt-4 rounded-full bg-gradient-to-r from-primary to-purple-600"
              >
                Return to Login
              </Button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}