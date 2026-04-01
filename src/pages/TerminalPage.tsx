import { useState, useEffect } from 'react'

export default function TerminalPage() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 1500)
    return () => clearTimeout(timer)
  }, [])

  if (!show) {
    return (
      <div className="w-full h-full bg-[#0f1013] flex items-center justify-center">
        <span className="text-[#868e96] text-xs font-mono animate-pulse">终端启动中...</span>
      </div>
    )
  }

  return (
    <div className="w-full h-full bg-[#0f1013]">
      <iframe
        src="/terminal/"
        className="w-full h-full border-0"
        allow="clipboard-read; clipboard-write"
      />
    </div>
  )
}
