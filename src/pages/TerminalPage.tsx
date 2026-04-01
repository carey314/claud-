import { useState, useEffect } from 'react'

export default function TerminalPage() {
  const [ready, setReady] = useState(false)

  // 等 ttyd 启动（最多重试 10 次）
  useEffect(() => {
    let attempts = 0
    const check = () => {
      fetch('http://localhost:7681/terminal/', { mode: 'no-cors' })
        .then(() => setReady(true))
        .catch(() => {
          if (++attempts < 10) setTimeout(check, 500)
        })
    }
    check()
  }, [])

  if (!ready) {
    return (
      <div className="w-full h-full bg-[#0f1013] flex items-center justify-center">
        <span className="text-[#868e96] text-xs font-mono animate-pulse">终端连接中...</span>
      </div>
    )
  }

  return (
    <div className="w-full h-full bg-[#0f1013]">
      <iframe
        src="http://localhost:7681/terminal/"
        className="w-full h-full border-0"
        allow="clipboard-read; clipboard-write"
      />
    </div>
  )
}
