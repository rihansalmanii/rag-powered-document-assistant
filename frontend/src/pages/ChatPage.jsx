import React, { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { getConversationMessages, sendQuery, uploadPDF } from '../api/chatApi'
import { FaUserCircle } from 'react-icons/fa'
import { MdSmartToy } from 'react-icons/md'
import { IoSend } from 'react-icons/io5'
import { IoMdAdd } from "react-icons/io"

const ChatPage = () => {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [conversationId, setConversationId] = useState(null) // ✅ NEW

  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)

  const { id } = useParams()
  const chatEndRef = useRef(null)

  // 🧠 Load existing conversation
  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await getConversationMessages(id)
        setMessages(res.messages || [])
        setConversationId(id) // ✅ SET HERE
      } catch (err) {
        console.error(err)
      }
    }

    if (id) getMessages()
  }, [id])

  // 🔽 Auto scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // 📤 SEND MESSAGE (FIXED)
  const handleSend = async () => {
    if (!input.trim() || uploading) return

    const userMsg = {
      _id: Date.now(),
      content: input,
      role: 'user'
    }

    setMessages(prev => [...prev, userMsg])
    setInput('')

    try {
      console.log("Sending with ID:", conversationId)

      const res = await sendQuery(input, conversationId)

      console.log("Received ID:", res.conversation_id)

      // ✅ IMPORTANT FIX
      setConversationId(prev => prev || res.conversation_id)

      const botMsg = {
        _id: Date.now() + 1,
        content: res.answer,
        role: 'assistant'
      }

      setMessages(prev => [...prev, botMsg])

    } catch (err) {
      console.error(err)
    }
  }

  // 📎 FILE UPLOAD
  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0]
    if (!selectedFile) return

    setFile(selectedFile)
    setUploading(true)

    try {
      const res = await uploadPDF(selectedFile, conversationId)
      console.log("Uploaded:", res)

    } catch (err) {
      console.error(err)
      alert("❌ Upload failed")
      setFile(null)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">

      <div className="p-4 border-b border-gray-700 text-lg font-semibold">
        💬 Chat Conversation
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          const isUser = msg.role === 'user'

          return (
            <div
              key={msg._id}
              className={`flex items-end gap-2 ${
                isUser ? 'justify-end' : 'justify-start'
              }`}
            >
              {!isUser && <MdSmartToy className="text-3xl text-green-400" />}

              <div
                className={`max-w-xs md:max-w-md px-4 py-2 rounded-2xl text-sm shadow-lg ${
                  isUser
                    ? 'bg-blue-600 rounded-br-none'
                    : 'bg-gray-700 rounded-bl-none'
                }`}
              >
                {msg.content}
              </div>

              {isUser && <FaUserCircle className="text-3xl text-blue-400" />}
            </div>
          )
        })}
        <div ref={chatEndRef} />
      </div>

      <div className="p-4 border-t border-gray-700 flex flex-col gap-2">

        {file && (
          <div className="flex items-center justify-between bg-gray-800 p-3 rounded-lg border border-gray-600">
            <div className="text-sm truncate">
              📄 {file.name}
            </div>

            {uploading ? (
              <div className="text-yellow-400 text-xs animate-pulse">
                Uploading...
              </div>
            ) : (
              <div className="text-green-400 text-xs">
                Uploaded ✅
              </div>
            )}
          </div>
        )}

        <div className="flex items-center gap-2">

          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="hidden"
            id="pdfUpload"
          />

          <label
            htmlFor="pdfUpload"
            className="cursor-pointer bg-gray-800 hover:bg-gray-700 p-2 rounded-lg border border-gray-600"
          >
            <IoMdAdd className="text-xl" />
          </label>

          <input
            type="text"
            placeholder="Ask your PDF..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={uploading}
            className="flex-1 p-2 rounded-lg bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          />

          <button
            onClick={handleSend}
            disabled={uploading || !input.trim()}
            className={`p-3 rounded-full transition ${
              uploading || !input.trim()
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            <IoSend size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChatPage