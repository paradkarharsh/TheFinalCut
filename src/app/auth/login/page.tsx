import { Metadata } from 'next';
import AuthClient from '@/components/auth/AuthClient';

export const metadata: Metadata = { title: 'Sign In' };

export default function LoginPage() {
  return <AuthClient mode="login" />;
}
