import { useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom"

import {
  getConversationMessages,
  sendQuery,
  uploadPDF
} from "../api/chatApi"

import { MdSmartToy } from "react-icons/md"
import { IoSend } from "react-icons/io5"
import { IoMdAdd, IoMdClose } from "react-icons/io"
import { FiFileText, FiUser } from "react-icons/fi"

const ChatPage = () => {
  const { id } = useParams()

  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [conversationId, setConversationId] = useState(null)

  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [sending, setSending] = useState(false)

  const [error, setError] = useState("")

  const chatEndRef = useRef(null)
  const fileInputRef = useRef(null)

  useEffect(() => {
    const getMessages = async () => {
      try {
        setError("")

        const res = await getConversationMessages(id)

        setMessages(res.messages || [])
        setConversationId(id)
      } catch (err) {
        console.error(err)

        setError(
          err.response?.data?.detail ||
          "Unable to load this conversation."
        )
      }
    }

    if (id) {
      getMessages()
    }
  }, [id])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: "smooth"
    })
  }, [messages, sending])

  const handleSend = async () => {
    const trimmedInput = input.trim()

    if (!trimmedInput || uploading || sending) {
      return
    }

    const userMsg = {
      _id: `user-${Date.now()}`,
      content: trimmedInput,
      role: "user"
    }

    setMessages((prev) => [...prev, userMsg])
    setInput("")
    setError("")
    setSending(true)

    try {
      const res = await sendQuery(
        trimmedInput,
        conversationId
      )

      setConversationId(
        (prev) => prev || res.conversation_id
      )

      const botMsg = {
        _id: `assistant-${Date.now()}`,
        content: res.answer,
        role: "assistant"
      }

      setMessages((prev) => [...prev, botMsg])
    } catch (err) {
      console.error(err)

      setError(
        err.response?.data?.detail ||
        "Unable to send your message."
      )
    } finally {
      setSending(false)
    }
  }

  const handleKeyDown = (event) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault()
      handleSend()
    }
  }

  const handleFileChange = async (event) => {
    const selectedFile = event.target.files?.[0]

    if (!selectedFile) {
      return
    }

    if (selectedFile.type !== "application/pdf") {
      setError("Please select a valid PDF file.")
      return
    }

    setFile(selectedFile)
    setUploading(true)
    setError("")

    try {
      const res = await uploadPDF(
        selectedFile,
        conversationId
      )

      console.log("Uploaded:", res)

      if (res.conversation_id) {
        setConversationId(
          (prev) => prev || res.conversation_id
        )
      }

      if (res.doc_id) {
        localStorage.setItem("doc_id", res.doc_id)
      }
    } catch (err) {
      console.error(err)

      setError(
        err.response?.data?.detail ||
        "PDF upload failed."
      )

      setFile(null)
    } finally {
      setUploading(false)

      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const removeFile = () => {
    if (uploading) {
      return
    }

    setFile(null)

    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <main className="relative flex h-screen min-w-0 flex-col overflow-hidden bg-[#020205] text-white">
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-20 -top-40 h-[600px] w-[180px] rotate-[31deg] bg-white/[0.07] blur-3xl" />

        <div className="absolute right-[18%] top-[5%] h-[520px] w-[100px] rotate-[31deg] bg-white/[0.035] blur-3xl" />

        <div className="absolute -bottom-56 left-1/2 h-[430px] w-[900px] -translate-x-1/2 rounded-full bg-white/[0.02] blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 flex h-[76px] shrink-0 items-center justify-between border-b border-white/[0.07] bg-black/20 px-5 backdrop-blur-2xl md:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-[14px] border border-white/[0.1] bg-white/[0.07] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
            <MdSmartToy className="text-xl text-white/75" />

            <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.75)]" />
          </div>

          <div className="min-w-0">
            <h1 className="truncate text-sm font-semibold text-white md:text-base">
              Document conversation
            </h1>

            <p className="truncate text-[11px] text-white/30">
              Ask questions based on your uploaded PDF
            </p>
          </div>
        </div>

        <div className="hidden shrink-0 items-center gap-2 rounded-full border border-white/[0.07] bg-white/[0.04] px-3 py-1.5 text-[10px] uppercase tracking-wider text-white/30 sm:flex">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]" />
          Ready
        </div>
      </header>

      {/* Messages */}
      <section className="relative z-10 min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-4 py-7 md:px-8">
        <div className="mx-auto flex min-h-full w-full max-w-4xl flex-col">
          {messages.length === 0 && !sending && (
            <div className="flex flex-1 flex-col items-center justify-center px-5 py-20 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-[28px] border border-white/[0.1] bg-white/[0.06] shadow-[0_24px_80px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-2xl">
                <FiFileText className="text-3xl text-white/65" />
              </div>

              <h2 className="mt-6 text-2xl font-semibold tracking-tight">
                Start exploring your document
              </h2>

              <p className="mt-3 max-w-md text-sm leading-6 text-white/35">
                Upload a PDF, then ask questions about its
                content. Your saved messages will appear here.
              </p>
            </div>
          )}

          <div className="space-y-6">
            {messages.map((msg) => {
              const isUser = msg.role === "user"

              return (
                <div
                  key={msg._id}
                  className={`flex w-full items-end gap-3 ${isUser
                      ? "justify-end"
                      : "justify-start"
                    }`}
                >
                  {!isUser && (
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/[0.09] bg-white/[0.055]">
                      <MdSmartToy className="text-lg text-white/65" />
                    </div>
                  )}

                  <div
                    className={`max-w-[84%] rounded-[22px] px-5 py-3.5 text-[16.5px] leading-6 shadow-lg md:max-w-[72%] ${isUser
                        ? "rounded-br-md bg-white text-black shadow-[0_15px_50px_rgba(255,255,255,0.08)]"
                        : "rounded-bl-md border border-white/[0.08] bg-white/[0.065] text-white/80 shadow-[0_15px_50px_rgba(0,0,0,0.28)] backdrop-blur-xl"
                      }`}
                  >
                    <p className="whitespace-pre-wrap break-words">
                      {msg.content}
                    </p>
                  </div>

                  {isUser && (
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/[0.09] bg-white/[0.055]">
                      <FiUser className="text-base text-white/55" />
                    </div>
                  )}
                </div>
              )
            })}

            {sending && (
              <div className="flex items-end gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.09] bg-white/[0.055]">
                  <MdSmartToy className="text-lg text-white/65" />
                </div>

                <div className="flex items-center gap-1.5 rounded-[22px] rounded-bl-md border border-white/[0.08] bg-white/[0.065] px-5 py-4 backdrop-blur-xl">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-white/40 [animation-delay:-0.3s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-white/40 [animation-delay:-0.15s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-white/40" />
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>
        </div>
      </section>

      {/* Input area */}
      <footer className="relative z-10 shrink-0 border-t border-white/[0.07] bg-black/25 px-4 pb-5 pt-4 backdrop-blur-2xl md:px-8">
        <div className="mx-auto w-full max-w-4xl">
          {error && (
            <div className="mb-3 flex items-center justify-between rounded-2xl border border-red-400/20 bg-red-500/[0.08] px-4 py-3 text-sm text-red-200">
              <span className="pr-4">{error}</span>

              <button
                type="button"
                onClick={() => setError("")}
                className="shrink-0 text-red-200/50 transition hover:text-red-100"
              >
                <IoMdClose className="text-lg" />
              </button>
            </div>
          )}

          {file && (
            <div className="mb-3 flex items-center justify-between rounded-2xl border border-white/[0.08] bg-white/[0.055] px-4 py-3 backdrop-blur-xl">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.06]">
                  <FiFileText className="text-lg text-white/60" />
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-white/80">
                    {file.name}
                  </p>

                  <p className="mt-0.5 text-[11px] text-white/30">
                    {uploading
                      ? "Uploading document..."
                      : "Document uploaded and ready"}
                  </p>
                </div>
              </div>

              <div className="ml-4 flex shrink-0 items-center gap-3">
                {uploading ? (
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/15 border-t-white/65" />
                ) : (
                  <span className="text-[11px] text-emerald-300/80">
                    Ready
                  </span>
                )}

                {!uploading && (
                  <button
                    type="button"
                    onClick={removeFile}
                    className="flex h-8 w-8 items-center justify-center rounded-xl text-white/30 transition hover:bg-white/[0.07] hover:text-white/70"
                  >
                    <IoMdClose className="text-lg" />
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="flex items-end gap-2 rounded-[26px] border border-white/[0.1] bg-white/[0.065] p-2 shadow-[0_22px_80px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-2xl">
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="hidden"
              id="pdfUpload"
            />

            <label
              htmlFor="pdfUpload"
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition ${uploading
                  ? "cursor-not-allowed bg-white/[0.025] text-white/15"
                  : "cursor-pointer bg-white/[0.055] text-white/45 hover:bg-white/[0.09] hover:text-white"
                }`}
            >
              <IoMdAdd className="text-2xl" />
            </label>

            <textarea
              rows={1}
              placeholder="Ask your PDF..."
              value={input}
              onChange={(event) =>
                setInput(event.target.value)
              }
              onKeyDown={handleKeyDown}
              disabled={uploading || sending}
              className="max-h-36 min-h-11 min-w-0 flex-1 resize-none overflow-y-auto bg-transparent px-2 py-3 text-[18px] leading-5 text-white outline-none placeholder:text-white/25 disabled:cursor-not-allowed disabled:opacity-50"
            />

            <button
              type="button"
              onClick={handleSend}
              disabled={
                uploading ||
                sending ||
                !input.trim()
              }
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition ${uploading ||
                  sending ||
                  !input.trim()
                  ? "cursor-not-allowed bg-white/[0.035] text-white/15"
                  : "bg-white text-black hover:bg-white/90"
                }`}
            >
              {sending ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/20 border-t-black" />
              ) : (
                <IoSend className="text-lg" />
              )}
            </button>
          </div>

          <p className="mt-2 text-center text-[10px] text-white/20">
            Press Enter to send · Shift + Enter for a new line
          </p>
        </div>
      </footer>
    </main>
  )
}

export default ChatPage