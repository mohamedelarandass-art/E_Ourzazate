import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { validateRequest } from '@/lib/auth-utils';
import { redirect } from 'next/navigation';
import LoginForm from './LoginForm';
import styles from './login.module.css';

export const metadata: Metadata = {
  title: 'Connexion - Administration',
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  const { user } = await validateRequest();
  if (user) {
    redirect('/admin/dashboard');
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.logo}>Equipement Ouarzazate</h1>
          <p className={styles.subtitle}>Espace d&apos;administration</p>
        </header>

        <div className={styles.card}>
          <LoginForm />
        </div>

        <div className={styles.footer}>
          <Link href="/" className={styles.backLink}>
            <ArrowLeft size={14} />
            Retour au site
          </Link>
        </div>
      </div>
    </div>
  );
}
