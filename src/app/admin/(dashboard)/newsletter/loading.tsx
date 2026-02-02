import styles from './newsletter.module.css';

function Skeleton({ width, height }: { width: string; height: string }) {
  return (
    <div
      className={styles.skeleton}
      style={{ width, height }}
    />
  );
}

export default function NewsletterLoading() {
  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderTop}>
          <Skeleton width="140px" height="32px" />
          <Skeleton width="130px" height="36px" />
        </div>
      </div>

      {/* Stats cards skeleton */}
      <div className={styles.statsGrid}>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className={styles.statCard}>
            <Skeleton width="100px" height="12px" />
            <Skeleton width="60px" height="28px" />
          </div>
        ))}
      </div>

      {/* Search skeleton */}
      <div className={styles.toolbar}>
        <Skeleton width="100%" height="44px" />
      </div>

      {/* Table skeleton */}
      <div className={styles.section}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className={styles.mobileRow}>
            <div className={styles.mobileInfo}>
              <Skeleton width="70%" height="16px" />
              <div className={styles.skeletonInline}>
                <Skeleton width="100px" height="12px" />
                <Skeleton width="50px" height="20px" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
