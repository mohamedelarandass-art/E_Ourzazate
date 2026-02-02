import styles from './messages.module.css';

function Skeleton({ width, height }: { width: string; height: string }) {
  return (
    <div
      className={styles.skeleton}
      style={{ width, height }}
    />
  );
}

export default function MessagesLoading() {
  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderTop}>
          <Skeleton width="120px" height="32px" />
        </div>
      </div>

      {/* Filter tabs skeleton */}
      <div className={styles.filterTabs}>
        <Skeleton width="80px" height="40px" />
        <Skeleton width="100px" height="40px" />
        <Skeleton width="70px" height="40px" />
        <Skeleton width="90px" height="40px" />
      </div>

      {/* Message rows skeleton */}
      <div className={styles.section}>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className={styles.messageHeader}>
            <div className={styles.messageInfo}>
              <Skeleton width="40%" height="16px" />
              <div className={styles.skeletonRow}>
                <Skeleton width="60%" height="14px" />
              </div>
              <div className={styles.skeletonInline}>
                <Skeleton width="80px" height="12px" />
                <Skeleton width="120px" height="12px" />
              </div>
            </div>
            <Skeleton width="70px" height="24px" />
          </div>
        ))}
      </div>
    </div>
  );
}
