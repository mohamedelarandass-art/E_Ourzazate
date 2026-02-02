import styles from './dashboard.module.css';

function Skeleton({ width, height }: { width: string; height: string }) {
  return (
    <div
      className={styles.skeleton}
      style={{ width, height }}
    />
  );
}

export default function DashboardLoading() {
  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <Skeleton width="200px" height="32px" />
        <Skeleton width="280px" height="16px" />
      </div>

      <div className={styles.statsGrid}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className={styles.statCard}>
            <Skeleton width="44px" height="44px" />
            <div className={styles.statContent}>
              <Skeleton width="60px" height="28px" />
              <div style={{ marginTop: '4px' }}>
                <Skeleton width="100px" height="14px" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.twoColumn}>
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <Skeleton width="140px" height="20px" />
          </div>
          <div className={styles.sectionContent}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
              <Skeleton width="100%" height="40px" />
              <Skeleton width="100%" height="40px" />
              <Skeleton width="100%" height="40px" />
            </div>
          </div>
        </div>
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <Skeleton width="160px" height="20px" />
          </div>
          <div className={styles.sectionContent}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} width="100%" height="24px" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
