import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { IoMdAdd } from "react-icons/io"
import { HiOutlineSparkles } from "react-icons/hi2"

import { getNewConversationId } from "../../api/chatApi"

const Header = () => {
  const navigate = useNavigate()
  const [creating, setCreating] = useState(false)

  const handleNewChat = async () => {
    if (creating) return

    try {
      setCreating(true)

      const response = await getNewConversationId()

      const conversationId =
        response.conversation_id ||
        response.id ||
        response

      navigate(`/chat/${conversationId}`)
    } catch (error) {
      console.error(
        "Error creating new conversation:",
        error
      )
    } finally {
      setCreating(false)
    }
  }

  return (
    <header className="shrink-0 border-b border-white/[0.06] px-4 pb-4 pt-5">
      {/* Brand */}
      <div className="flex items-center gap-3 px-1">
        <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-[15px] border border-white/[0.12] bg-white/[0.075] shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_12px_35px_rgba(0,0,0,0.35)]">
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.14] via-white/[0.04] to-transparent" />

          <div className="relative grid grid-cols-3 gap-1">
            {Array.from({ length: 9 }).map((_, index) => (
              <span
                key={index}
                className={`block h-1.5 w-1.5 rounded-full bg-white ${
                  index === 4
                    ? "scale-125 opacity-100"
                    : "opacity-55"
                }`}
              />
            ))}
          </div>

          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.75)]" />
        </div>

        <div className="min-w-0 flex-1">
          <h1 className="truncate text-[16px] font-semibold tracking-tight text-white">
            DocLens
            <span className="ml-1 text-white/35">AI</span>
          </h1>

          <p className="truncate text-[10px] uppercase tracking-[0.18em] text-white/25">
            Document intelligence
          </p>
        </div>

        <div className="flex items-center gap-1.5 rounded-full border border-white/[0.07] bg-white/[0.04] px-2 py-1">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]" />

          <span className="text-[9px] font-medium uppercase tracking-wide text-white/30">
            Online
          </span>
        </div>
      </div>

      {/* New chat */}
      <button
        type="button"
        onClick={handleNewChat}
        disabled={creating}
        className="group mt-5 flex h-11 w-full items-center justify-between rounded-2xl border border-white/[0.09] bg-white/[0.055] px-3.5 text-sm text-white/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition hover:border-white/[0.15] hover:bg-white/[0.09] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-white text-black transition group-hover:scale-105">
            {creating ? (
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-black/20 border-t-black" />
            ) : (
              <IoMdAdd className="text-base" />
            )}
          </span>

          {creating ? "Creating chat..." : "New conversation"}
        </span>

        <HiOutlineSparkles className="text-base text-white/20 transition group-hover:text-white/50" />
      </button>
    </header>
  )
}

export default Header