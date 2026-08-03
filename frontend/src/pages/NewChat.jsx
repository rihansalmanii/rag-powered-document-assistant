import { useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom"

import {
  getConversationMessages,
  sendQuery,
  uploadPDF
} from "../api/chatApi"

import { FaUserCircle } from "react-icons/fa"
import { MdSmartToy } from "react-icons/md"
import { IoSend } from "react-icons/io5"
import { IoMdAdd, IoMdClose } from "react-icons/io"
import { FiFileText } from "react-icons/fi"

const ChatPage = () => {
  const { id } = useParams()

  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")

  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [sending, setSending] = useState(false)

  const [error, setError] = useState("")

  const chatEndRef = useRef(null)
  const fileInputRef = useRef(null)

  // Fetch old conversation messages
  useEffect(() => {
    const getMessages = async () => {
      try {
        setError("")

        const res = await getConversationMessages(id)

        setMessages(res.messages || [])
      } catch (err) {
        console.error(err)

        setError(
          err.response?.data?.detail ||
            "Unable to load conversation messages."
        )
      }
    }

    if (id) {
      getMessages()
    }
  }, [id])

  // Scroll to newest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: "smooth"
    })
  }, [messages, sending])

  // Send user query
  const handleSend = async () => {
    const trimmedInput = input.trim()

    if (!trimmedInput || uploading || sending) {
      return
    }

    const userMessage = {
      _id: `user-${Date.now()}`,
      content: trimmedInput,
      role: "user"
    }

    setMessages((previous) => [
      ...previous,
      userMessage
    ])

    setInput("")
    setError("")
    setSending(true)

    try {
      const res = await sendQuery(trimmedInput, id)

      const assistantMessage = {
        _id: `assistant-${Date.now()}`,
        content: res.answer,
        role: "assistant"
      }

      setMessages((previous) => [
        ...previous,
        assistantMessage
      ])
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

  // Send on Enter, create new line on Shift + Enter
  const handleKeyDown = (event) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault()
      handleSend()
    }
  }

  // Upload PDF
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
        id
      )

      console.log("Uploaded:", res)

      if (res.doc_id) {
        localStorage.setItem(
          "doc_id",
          res.doc_id
        )
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
    <main className="relative flex h-screen w-full flex-col overflow-hidden bg-[#020205] text-white">
      {/* Background light effects */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 right-[5%] h-[600px] w-[180px] rotate-[32deg] bg-white/[0.07] blur-3xl" />

        <div className="absolute top-[10%] right-[20%] h-[500px] w-[100px] rotate-[32deg] bg-white/[0.035] blur-3xl" />

        <div className="absolute -bottom-52 left-1/2 h-[400px] w-[900px] -translate-x-1/2 rounded-full bg-white/[0.025] blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 flex h-[78px] items-center justify-between border-b border-white/[0.08] bg-black/20 px-5 backdrop-blur-2xl md:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.07] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
            <MdSmartToy className="text-xl text-white/80" />
          </div>

          <div>
            <h1 className="text-sm font-semibold text-white md:text-base">
              Document Assistant
            </h1>

            <p className="text-xs text-white/35">
              Ask questions from your uploaded PDF
            </p>
          </div>
        </div>

        <div className="hidden items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.05] px-3 py-1.5 text-xs text-white/45 sm:flex">
          <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.7)]" />
          Online
        </div>
      </header>

      {/* Messages container */}
      <section className="relative z-10 flex-1 overflow-y-auto px-4 py-6 md:px-8">
        <div className="mx-auto flex min-h-full w-full max-w-4xl flex-col text-3xl">
          {/* Empty state */}
          {messages.length === 0 && !sending && (
            <div className="flex flex-1 flex-col items-center justify-center py-16 text-center">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-[28px] border border-white/10 bg-white/[0.07] shadow-[0_20px_70px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-2xl">
                <FiFileText className="text-3xl text-white/75" />
              </div>

              <h2 className="text-2xl font-semibold tracking-tight">
                Ask your document
              </h2>

              <p className="mt-3 max-w-md text-sm leading-6 text-white/40">
                Upload a PDF and ask questions about its
                content. Your conversation will appear here.
              </p>
            </div>
          )}

          {/* Messages */}
          <div className="space-y-6">
            {messages.map((message) => {
              const isUser =
                message.role === "user"

              return (
                <div
                  key={message._id}
                  className={`flex w-full gap-3 ${
                    isUser
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  {!isUser && (
                    <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.07]">
                      <MdSmartToy className="text-lg text-white/70" />
                    </div>
                  )}

                  <div
                    className={`max-w-[82%] rounded-[22px] px-5 py-3.5 text-sm leading-6 shadow-lg md:max-w-[70%] ${
                      isUser
                        ? "rounded-br-md bg-white text-black shadow-[0_14px_40px_rgba(255,255,255,0.08)]"
                        : "rounded-bl-md border border-white/9 bg-white/[0.07] text-white/85 shadow-[0_14px_40px_rgba(0,0,0,0.25)] backdrop-blur-xl"
                    }`}
                  >
                    <p className="whitespace-pre-wrap wrap-break-word">
                      {message.content}
                    </p>
                  </div>

                  {isUser && (
                    <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center">
                      <FaUserCircle className="text-3xl text-white/55" />
                    </div>
                  )}
                </div>
              )
            })}

            {/* Assistant typing indicator */}
            {sending && (
              <div className="flex items-end gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.07]">
                  <MdSmartToy className="text-lg text-white/70" />
                </div>

                <div className="flex items-center gap-1.5 rounded-[22px] rounded-bl-md border border-white/[0.09] bg-white/[0.07] px-5 py-4 backdrop-blur-xl">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-white/45 [animation-delay:-0.3s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-white/45 [animation-delay:-0.15s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-white/45" />
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>
        </div>
      </section>

      {/* Bottom composer */}
      <footer className="relative z-10 border-t border-white/[0.07] bg-black/25 px-4 pb-5 pt-4 backdrop-blur-2xl md:px-8">
        <div className="mx-auto w-full max-w-4xl">
          {/* Error */}
          {error && (
            <div className="mb-3 flex items-center justify-between rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              <span>{error}</span>

              <button
                type="button"
                onClick={() => setError("")}
                className="ml-4 text-red-200/60 transition hover:text-red-100"
              >
                <IoMdClose className="text-lg" />
              </button>
            </div>
          )}

          {/* Selected PDF */}
          {file && (
            <div className="mb-3 flex items-center justify-between rounded-2xl border border-white/[0.08] bg-white/[0.06] px-4 py-3 backdrop-blur-xl">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.08]">
                  <FiFileText className="text-lg text-white/65" />
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-white/80">
                    {file.name}
                  </p>

                  <p className="mt-0.5 text-xs text-white/35">
                    {uploading
                      ? "Uploading document..."
                      : "Document uploaded"}
                  </p>
                </div>
              </div>

              <div className="ml-3 flex items-center gap-3">
                {uploading ? (
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/15 border-t-white/70" />
                ) : (
                  <span className="text-xs text-emerald-300">
                    Ready
                  </span>
                )}

                {!uploading && (
                  <button
                    type="button"
                    onClick={removeFile}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-white/40 transition hover:bg-white/[0.08] hover:text-white"
                  >
                    <IoMdClose className="text-lg" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Input shell */}
          <div className="flex items-end gap-2 rounded-[26px] border border-white/[0.1] bg-white/[0.07] p-2 shadow-[0_20px_70px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-2xl">
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
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition ${
                uploading
                  ? "cursor-not-allowed bg-white/[0.03] text-white/20"
                  : "cursor-pointer bg-white/[0.06] text-white/55 hover:bg-white/[0.1] hover:text-white"
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
              className="max-h-36 min-h-11 flex-1 resize-none bg-transparent px-2 py-3 text-sm leading-5 text-white outline-none placeholder:text-white/30 disabled:cursor-not-allowed disabled:opacity-50"
            />

            <button
              type="button"
              onClick={handleSend}
              disabled={
                uploading ||
                sending ||
                !input.trim()
              }
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition ${
                uploading ||
                sending ||
                !input.trim()
                  ? "cursor-not-allowed bg-white/[0.04] text-white/20"
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

          <p className="mt-2 text-center text-[11px] text-white/25">
            Press Enter to send · Shift + Enter for a new line
          </p>
        </div>
      </footer>
    </main>
  )
}

export default ChatPage