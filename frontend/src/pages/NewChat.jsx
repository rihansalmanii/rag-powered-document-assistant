import { useState } from "react"
import { useNavigate } from "react-router-dom"

import { getNewConversationId } from "../api/chatApi"

import { IoMdAdd } from "react-icons/io"
import { HiOutlineSparkles } from "react-icons/hi2"

const NewChat = () => {
  const navigate = useNavigate()

  const [creating, setCreating] = useState(false)

  const handleNewChat = async () => {
    if (creating) return

    try {
      setCreating(true)

      const conversationId = await getNewConversationId()

      navigate(`/chat/${conversationId}`)
    } catch (error) {
      console.error("Failed to create conversation:", error)
    } finally {
      setCreating(false)
    }
  }

  return (
    <main className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-[#020205] text-white">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 right-[5%] h-150 w-45 rotate-32 bg-white/[0.07] blur-3xl" />

        <div className="absolute top-[10%] right-[20%] h-125 w-25 rotate-32 bg-white/[0.035] blur-3xl" />

        <div className="absolute -bottom-52 left-1/2 h-100 w-225 -translate-x-1/2 rounded-full bg-white/2.5 blur-3xl" />
      </div>

      <div className="relative z-10 flex max-w-xl flex-col items-center text-center">
        <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-3xl border border-white/10 bg-white/[0.07] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
          <HiOutlineSparkles className="text-4xl text-white/80" />
        </div>

        <h1 className="text-4xl font-semibold tracking-tight">
          Welcome to DocLens AI
        </h1>

        <p className="mt-4 max-w-md text-base leading-7 text-white/45">
          Upload your PDF and start asking questions. Your conversations
          are automatically saved so you can continue anytime.
        </p>

        <button
          type="button"
          onClick={handleNewChat}
          disabled={creating}
          className="group mt-10 flex h-14 items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-6 text-white transition hover:border-white/20 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-black">
            {creating ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/20 border-t-black" />
            ) : (
              <IoMdAdd className="text-xl" />
            )}
          </span>

          <span className="font-medium">
            {creating ? "Creating conversation..." : "Start New Conversation"}
          </span>
        </button>
      </div>
    </main>
  )
}

export default NewChat