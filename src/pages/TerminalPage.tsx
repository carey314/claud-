export default function TerminalPage() {
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
