'use client';

import { useState, useEffect, useCallback, ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  Package,
  Grid3x3,
  MessageSquare,
  Mail,
  Settings,
  Menu,
  X,
  LogOut,
  ExternalLink,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { useToast } from '@/components/ui/Toast/Toast';
import styles from './admin-shell.module.css';

import type { AdminRole } from '@/types';

interface NavItem {
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
  badge?: number;
  ownerOnly?: boolean;
}

interface AdminShellProps {
  children: ReactNode;
  user: {
    displayName: string;
    role: AdminRole;
  };
  unreadMessages: number;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Tableau de Bord', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Produits', href: '/admin/products', icon: Package },
  { label: 'Catégories', href: '/admin/categories', icon: Grid3x3 },
  { label: 'Messages', href: '/admin/messages', icon: MessageSquare },
  { label: 'Newsletter', href: '/admin/newsletter', icon: Mail },
  { label: 'Paramètres', href: '/admin/settings', icon: Settings, ownerOnly: true },
];

const ROLE_LABELS: Record<AdminRole, string> = {
  owner: 'Propriétaire',
  manager: 'Gestionnaire',
  viewer: 'Lecteur',
};

export default function AdminShell({ children, user, unreadMessages }: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const toast = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  // Close sidebar on route change
  useEffect(() => {
    closeSidebar();
  }, [pathname, closeSidebar]);

  // Close sidebar on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') closeSidebar();
    }
    if (sidebarOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [sidebarOpen, closeSidebar]);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/admin/login');
    } catch {
      toast.error('Erreur', 'Impossible de se déconnecter. Veuillez réessayer.');
      setLoggingOut(false);
    }
  }

  const visibleItems = NAV_ITEMS.filter(
    (item) => !item.ownerOnly || user.role === 'owner'
  );

  function isActive(href: string) {
    if (href === '/admin/dashboard') return pathname === '/admin/dashboard';
    return pathname.startsWith(href);
  }

  return (
    <div className={styles.shell}>
      {/* Mobile overlay */}
      <div
        className={cn(styles.sidebarOverlay, sidebarOpen && styles.visible)}
        onClick={closeSidebar}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <aside className={cn(styles.sidebar, sidebarOpen && styles.open)}>
        <div className={styles.sidebarHeader}>
          <h2 className={styles.sidebarBrand}>
            EQ Ouarzazate
            <span className={styles.sidebarBrandSub}>Administration</span>
          </h2>
          <button
            className={styles.sidebarClose}
            onClick={closeSidebar}
            aria-label="Fermer le menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav className={styles.sidebarNav} aria-label="Navigation admin">
          <ul className={styles.navList}>
            {visibleItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              const badgeCount = item.href === '/admin/messages' ? unreadMessages : 0;

              return (
                <li key={item.href} className={styles.navItem}>
                  <Link
                    href={item.href}
                    className={cn(styles.navLink, active && styles.active)}
                    aria-current={active ? 'page' : undefined}
                  >
                    <Icon size={20} className={styles.navIcon} />
                    <span className={styles.navLabel}>{item.label}</span>
                    {badgeCount > 0 && (
                      <span className={styles.navBadge}>{badgeCount}</span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className={styles.sidebarFooter}>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.backToSite}
          >
            <ExternalLink size={16} />
            Retour au site
          </a>
        </div>
      </aside>

      {/* Main content area */}
      <div className={styles.main}>
        {/* Top bar */}
        <header className={styles.topBar}>
          <div className={styles.topBarLeft}>
            <button
              className={styles.menuButton}
              onClick={() => setSidebarOpen(true)}
              aria-label="Ouvrir le menu"
            >
              <Menu size={22} />
            </button>
          </div>

          <div className={styles.topBarRight}>
            <div className={styles.userInfo}>
              <span className={styles.userName}>{user.displayName}</span>
              <Badge variant="default" size="sm">
                {ROLE_LABELS[user.role]}
              </Badge>
            </div>
            <button
              className={styles.logoutButton}
              onClick={handleLogout}
              disabled={loggingOut}
              aria-label="Se déconnecter"
              title="Se déconnecter"
            >
              <LogOut size={18} />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className={styles.content}>
          {children}
        </main>
      </div>
    </div>
  );
}
