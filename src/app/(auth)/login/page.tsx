'use client';

import { useState } from 'react';

import LoginForm from './(components)/loginForm/LoginForm';
import VerificationForm from './(components)/verificationForm/VerificationForm';

export default function Login() {
  const [email, setEmail] = useState<string>('');
  const [showVerification, setShowVerification] = useState(false);

  const handleLoginSuccess = (userEmail: string) => {
    setEmail(userEmail);
    setShowVerification(true);
  };

  const handleBackToLogin = () => {
    setShowVerification(false);
    setEmail('');
  };

  return !showVerification ? (
    <LoginForm onSuccess={handleLoginSuccess} />
  ) : (
    <VerificationForm email={email} onBack={handleBackToLogin} />
  );
}
