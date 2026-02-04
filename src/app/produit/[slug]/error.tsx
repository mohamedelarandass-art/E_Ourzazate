/**
 * Product Detail Error Boundary
 *
 * Catches unhandled errors in the product detail route (e.g. Prisma/Neon
 * connection timeouts) and renders a user-friendly retry screen.
 *
 * @module app/produit/[slug]/error
 */

'use client';

import { useEffect } from 'react';
import Link from 'next/link';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ProductError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('[produit] Unhandled error:', error);
  }, [error]);

  return (
    <div
      style={{
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        textAlign: 'center',
        gap: '1rem',
      }}
    >
      <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>
        Impossible de charger ce produit
      </h2>
      <p style={{ color: '#666', maxWidth: '480px' }}>
        Une erreur est survenue lors du chargement du produit.
        Veuillez réessayer dans quelques instants.
      </p>
      <button
        onClick={reset}
        style={{
          padding: '0.75rem 2rem',
          backgroundColor: '#111',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '1rem',
          marginTop: '0.5rem',
        }}
      >
        Réessayer
      </button>
      <Link
        href="/catalogue"
        style={{
          color: '#666',
          textDecoration: 'underline',
          fontSize: '0.875rem',
        }}
      >
        Retour au catalogue
      </Link>
    </div>
  );
}
