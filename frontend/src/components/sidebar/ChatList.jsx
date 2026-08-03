import { useEffect, useState } from "react"
import {
  useLocation,
  useNavigate
} from "react-router-dom"

import {
  FiMessageSquare,
  FiRefreshCw
} from "react-icons/fi"

import { getAllConversations } from "../../api/chatApi"

const ChatList = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const [conversations, setConversations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const fetchConversations = async () => {
    try {
      setLoading(true)
      setError("")

      const data = await getAllConversations()

      setConversations(data.conversations || [])
    } catch (error) {
      console.error(error)

      setConversations([])

      if (error.response?.status !== 401) {
        setError("Unable to load conversations")
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchConversations()
  }, [])

  const activeConversationId =
    location.pathname.match(/^\/chat\/([^/]+)/)?.[1]

  const openChat = (conversationId) => {
    navigate(`/chat/${conversationId}`)
  }

  return (
    <section className="flex h-full min-h-0 flex-col overflow-hidden px-3 pb-3 pt-4">
      {/* Title */}
      <div className="mb-3 flex shrink-0 items-center justify-between px-2">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/25">
            Recent conversations
          </p>
        </div>

        <div className="flex items-center gap-2">
          {!loading && conversations.length > 0 && (
            <span className="rounded-full bg-white/[0.05] px-2 py-0.5 text-[9px] text-white/25">
              {conversations.length}
            </span>
          )}

          <button
            type="button"
            onClick={fetchConversations}
            disabled={loading}
            aria-label="Refresh conversations"
            className="flex h-7 w-7 items-center justify-center rounded-lg text-white/25 transition hover:bg-white/[0.06] hover:text-white/65 disabled:opacity-40"
          >
            <FiRefreshCw
              className={`text-xs ${
                loading ? "animate-spin" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Scrollable list */}
      <div className="sidebar-scrollbar min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain pr-1">
        {loading && (
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="flex h-[54px] animate-pulse items-center gap-3 rounded-2xl px-3"
              >
                <div className="h-8 w-8 shrink-0 rounded-xl bg-white/[0.045]" />

                <div className="min-w-0 flex-1 space-y-2">
                  <div className="h-2.5 w-4/5 rounded-full bg-white/[0.045]" />
                  <div className="h-2 w-2/5 rounded-full bg-white/[0.025]" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="mx-1 rounded-2xl border border-red-400/10 bg-red-500/[0.055] px-4 py-4 text-center">
            <p className="text-xs text-red-200/70">
              {error}
            </p>

            <button
              type="button"
              onClick={fetchConversations}
              className="mt-3 text-[11px] text-white/40 transition hover:text-white"
            >
              Try again
            </button>
          </div>
        )}

        {!loading &&
          !error &&
          conversations.length === 0 && (
            <div className="flex h-full min-h-52 flex-col items-center justify-center px-5 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.045]">
                <FiMessageSquare className="text-lg text-white/25" />
              </div>

              <p className="mt-4 text-sm font-medium text-white/50">
                No conversations yet
              </p>

              <p className="mt-1 max-w-[190px] text-xs leading-5 text-white/25">
                Create a conversation and upload a PDF to get started.
              </p>
            </div>
          )}

        {!loading && conversations.length > 0 && (
          <div className="space-y-1">
            {conversations.map((conversation) => {
              const conversationId =
                conversation.conversation_id

              const isActive =
                activeConversationId === conversationId

              return (
                <button
                  type="button"
                  key={conversationId}
                  onClick={() =>
                    openChat(conversationId)
                  }
                  className={`group relative flex w-full min-w-0 items-center gap-3 overflow-hidden rounded-2xl border px-3 py-2.5 text-left transition ${
                    isActive
                      ? "border-white/[0.1] bg-white/[0.085] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
                      : "border-transparent text-white/50 hover:bg-white/[0.05] hover:text-white/80"
                  }`}
                >
                  {isActive && (
                    <span className="absolute left-0 top-1/2 h-6 w-[2px] -translate-y-1/2 rounded-r-full bg-white/80 shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
                  )}

                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border transition ${
                      isActive
                        ? "border-white/[0.1] bg-white/[0.095] text-white"
                        : "border-white/[0.05] bg-white/[0.03] text-white/25 group-hover:bg-white/[0.065] group-hover:text-white/55"
                    }`}
                  >
                    <FiMessageSquare className="text-sm" />
                  </span>

                  <span className="min-w-0 flex-1 overflow-hidden">
                    <span
                      className={`block w-full truncate text-[13px] ${
                        isActive
                          ? "font-medium text-white"
                          : "text-white/50 group-hover:text-white/80"
                      }`}
                      title={
                        conversation.title || "New Chat"
                      }
                    >
                      {conversation.title || "New Chat"}
                    </span>

                    <span className="mt-0.5 block truncate text-[10px] text-white/18">
                      Document conversation
                    </span>
                  </span>

                  <span
                    className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                      isActive
                        ? "bg-white/65"
                        : "bg-transparent group-hover:bg-white/20"
                    }`}
                  />
                </button>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}

export default ChatList