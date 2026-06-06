import { Metadata } from 'next';
import AuthClient from '@/components/auth/AuthClient';

export const metadata: Metadata = { title: 'Create Account' };

export default function RegisterPage() {
  return <AuthClient mode="register" />;
}
