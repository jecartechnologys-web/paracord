'use client'

import { useEffect, useState } from 'react'

export default function Loader({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval)
          setTimeout(onDone, 400)
          return 100
        }
        const inc = Math.random() * 15 + 2
        return Math.min(p + inc, 100)
      })
    }, 300)
    return () => clearInterval(interval)
  }, [onDone])

  return (
    <div className={`loader ${progress >= 100 ? 'hidden' : ''}`}>
      <div className="bar-bg">
        <div className="bar-fill" style={{ width: `${progress}%` }} />
      </div>
      <div className="label">{Math.round(progress)}%</div>
    </div>
  )
}
