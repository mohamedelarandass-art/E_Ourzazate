import styles from './categories.module.css';

function Skeleton({ width, height }: { width: string; height: string }) {
  return (
    <div
      className={styles.skeleton}
      style={{ width, height }}
    />
  );
}

export default function CategoriesLoading() {
  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderTop}>
          <Skeleton width="140px" height="32px" />
          <Skeleton width="120px" height="36px" />
        </div>
      </div>

      {/* Category rows skeleton */}
      <div className={styles.section}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className={styles.categoryRow}>
            <Skeleton width="44px" height="44px" />
            <div className={styles.categoryInfo}>
              <div className={styles.skeletonRow}>
                <Skeleton width="60%" height="16px" />
                <Skeleton width="100px" height="12px" />
                <div className={styles.skeletonInline}>
                  <Skeleton width="70px" height="20px" />
                </div>
              </div>
            </div>
            <Skeleton width="48px" height="28px" />
            <div className={styles.actions}>
              <Skeleton width="36px" height="36px" />
              <Skeleton width="36px" height="36px" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
