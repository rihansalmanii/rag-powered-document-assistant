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
        

        <div className="min-w-0 flex-1">
          <h1 className="truncate text-[26px] font-semibold tracking-tight text-white">
            DocLens
            <span className="ml-1 text-white/35">AI</span>
          </h1>

          <p className="truncate text-[10px] uppercase tracking-[0.18em] text-white/25">
            Document intelligence
          </p>
        </div>

      </div>

      {/* New chat */}
      <button
        type="button"
        onClick={handleNewChat}
        disabled={creating}
        className="group mt-5 text-md font-semibold flex h-11 w-full items-center justify-between rounded-2xl border border-white/[0.09] bg-white/[0.055] px-3.5 text-white/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition hover:border-white/[0.15] hover:bg-white/[0.09] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
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