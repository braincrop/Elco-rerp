'use client'
import styles from '../VirtualMachine.module.css'

const LOCAL_VIDEO = '/video/3198159-hd_1920_1080_25fps.mp4'

export default function SplashView({ videoUrl, deviceName }) {
  const src = videoUrl || LOCAL_VIDEO

  return (
    <div className={styles.splashView}>
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <video
        key={src}
        src={src}
        autoPlay
        muted
        loop
        playsInline
        className={styles.splashVideo}
      />
      <div className={styles.splashOverlay}>
        <div>
          <p className={styles.splashLabel}>Live splash preview</p>
          {deviceName && <p className={styles.splashDevName}>{deviceName}</p>}
        </div>
      </div>
    </div>
  )
}
