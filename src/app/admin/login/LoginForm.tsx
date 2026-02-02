'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import styles from './login.module.css';

export default function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setFieldErrors({});
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        if (res.status === 429) {
          setError('Trop de tentatives. Veuillez patienter avant de réessayer.');
          return;
        }
        if (data.details) {
          setFieldErrors(data.details);
        } else {
          setError(data.error || 'Erreur de connexion');
        }
        return;
      }

      router.push('/admin/dashboard');
    } catch {
      setError('Impossible de contacter le serveur');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      {error && (
        <div className={styles.errorAlert} role="alert">
          <AlertCircle size={18} className={styles.errorIcon} />
          {error}
        </div>
      )}

      <Input
        label="Nom d'utilisateur"
        name="username"
        type="text"
        autoComplete="username"
        required
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        error={fieldErrors.username}
        disabled={isLoading}
      />

      <div className={styles.passwordWrapper}>
        <Input
          label="Mot de passe"
          name="password"
          type={showPassword ? 'text' : 'password'}
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={fieldErrors.password}
          disabled={isLoading}
          rightIcon={
            <button
              type="button"
              className={styles.togglePassword}
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
              tabIndex={0}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          }
        />
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        fullWidth
        isLoading={isLoading}
        loadingText="Connexion..."
        className={styles.submitButton}
      >
        Se connecter
      </Button>
    </form>
  );
}
