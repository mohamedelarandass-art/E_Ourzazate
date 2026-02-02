import styles from './products.module.css';

function Skeleton({ width, height }: { width: string; height: string }) {
  return (
    <div
      className={styles.skeleton}
      style={{ width, height }}
    />
  );
}

export default function ProductsLoading() {
  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderTop}>
          <Skeleton width="120px" height="32px" />
          <Skeleton width="160px" height="36px" />
        </div>
      </div>

      {/* Filters skeleton */}
      <div className={styles.filters}>
        <div className={styles.searchRow}>
          <Skeleton width="100%" height="44px" />
        </div>
        <div className={styles.filterRow}>
          <Skeleton width="140px" height="44px" />
          <Skeleton width="140px" height="44px" />
          <Skeleton width="140px" height="44px" />
        </div>
      </div>

      {/* Product rows skeleton */}
      <div className={styles.tableWrapper}>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className={styles.mobileRow}>
            <Skeleton width="56px" height="56px" />
            <div className={styles.mobileInfo}>
              <Skeleton width="70%" height="16px" />
              <div style={{ marginTop: '8px', display: 'flex', gap: 'var(--spacing-2)' }}>
                <Skeleton width="80px" height="14px" />
                <Skeleton width="50px" height="14px" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
