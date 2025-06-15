
import LoginForm from './LoginForm';
import { setCookie, getCookie } from 'cookies-next';
import dotenv from 'dotenv';
dotenv.config();

export default function LoginPage() {
  const existing = getCookie('_att_tk');

  if (!existing) {
    const now = Date.now();
    setCookie('_att_tk', `000-${now}`, {
      maxAge: 30 * 24 * 60 * 60, // 30 days for example
      path: '/',
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production'
    });
  }

  return <LoginForm />;
}