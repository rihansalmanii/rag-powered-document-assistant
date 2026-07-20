import React, { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { getConversationMessages, uploadPDF } from '../api/chatApi'
import { FaUserCircle } from 'react-icons/fa'
import { MdSmartToy } from 'react-icons/md'
import { IoSend } from 'react-icons/io5'
import { IoMdAdd } from "react-icons/io";

const ChatPage = () => {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const { id } = useParams()
  const chatEndRef = useRef(null)

  // Fetch messages
  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await getConversationMessages(id)
        setMessages(res.messages || [])
      } catch (err) {
        console.error(err)
      }
    }

    if (id) getMessages()
  }, [id])

  // Auto scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Send message (UI only)
  const handleSend = () => {
    if (!input.trim()) return

    const newMessage = {
      _id: Date.now(),
      content: input,
      role: 'user'
    }

    setMessages((prev) => [...prev, newMessage])
    setInput('')
  }

  // File select
  const handleFileChange = (e) => {
    setFile(e.target.files[0])
  }

  // Upload PDF
  const handleFileUpload = async () => {
    if (!file) {
      alert("Please select a PDF first")
      return
    }

    try {
      setUploading(true)

      const res = await uploadPDF(file)
      console.log(res)

      alert("✅ PDF uploaded successfully!")

      setFile(null) // reset file

    } catch (error) {
      console.error(error)
      alert("❌ Upload failed")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">

      {/* Header */}
      <div className="p-4 border-b border-gray-700 text-lg font-semibold">
        💬 Chat Conversation
      </div>

      {/* Chat */}
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
              {!isUser && (
                <MdSmartToy className="text-3xl text-green-400" />
              )}

              <div
                className={`max-w-xs md:max-w-md px-4 py-2 rounded-2xl text-sm shadow-lg ${
                  isUser
                    ? 'bg-blue-600 rounded-br-none'
                    : 'bg-gray-700 rounded-bl-none'
                }`}
              >
                {msg.content}
              </div>

              {isUser && (
                <FaUserCircle className="text-3xl text-blue-400" />
              )}
            </div>
          )
        })}
        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-700 flex items-center gap-2">

        {/* Hidden file input */}
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="hidden"
          id="pdfUpload"
        />

        {/* Upload Button (Icon) */}
        <label
          htmlFor="pdfUpload"
          className="flex items-center justify-center cursor-pointer bg-gray-800 hover:bg-gray-700 p-2 rounded-lg border border-gray-600"
        >
          <IoMdAdd className="text-xl" />
        </label>

        {/* Upload trigger */}
        <button
          onClick={handleFileUpload}
          disabled={uploading}
          className="bg-green-600 hover:bg-green-700 px-3 py-2 rounded-lg text-sm"
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>

        {/* Message input */}
        <input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-2 rounded-lg bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Send button */}
        <button
          onClick={handleSend}
          className="bg-blue-600 hover:bg-blue-700 p-3 rounded-full"
        >
          <IoSend size={18} />
        </button>
      </div>
    </div>
  )
}

export default ChatPage