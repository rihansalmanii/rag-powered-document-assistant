import { useState } from "react"
import {
  Navigate,
  Route,
  Routes
} from "react-router-dom"

import {
  IoMenu,
  IoClose
} from "react-icons/io5"

import NewChat from "./pages/NewChat"
import ChatPage from "./pages/ChatPage"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Setting from "./pages/Setting"

import SideBar from "./components/common/SideBar"
import { useAuth } from "./contexts/AuthContext"

const App = () => {
  const { user, loading } = useAuth()

  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#020205] text-white">
        <div className="flex flex-col items-center gap-3">
          <span className="h-7 w-7 animate-spin rounded-full border-2 border-white/20 border-t-white" />

          <p className="text-sm text-white/50">
            Checking authentication...
          </p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <Routes>
        <Route path="/signin" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="*"
          element={
            <Navigate
              to="/signin"
              replace
            />
          }
        />
      </Routes>
    )
  }

  return (
    <div className="relative flex h-screen w-full overflow-hidden bg-[#020205]">
      {/* Desktop sidebar */}
      <div className="hidden w-[290px] shrink-0 md:block">
        <SideBar />
      </div>

      {/* Mobile hamburger */}
      <button
        type="button"
        onClick={() => setSidebarOpen(true)}
        aria-label="Open sidebar"
        className="fixed left-4 top-4 z-40 flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-black/60 text-white shadow-lg backdrop-blur-xl md:hidden"
      >
        <IoMenu className="text-2xl" />
      </button>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Dark backdrop */}
          <button
            type="button"
            aria-label="Close sidebar"
            onClick={() => setSidebarOpen(false)}
            className="absolute inset-0 h-full w-full bg-black/65 backdrop-blur-sm"
          />

          {/* Drawer */}
          <div className="relative z-10 h-full w-[85%] max-w-[320px] shadow-[20px_0_60px_rgba(0,0,0,0.65)]">
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close sidebar"
              className="absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] text-white/70 transition hover:bg-white/[0.1] hover:text-white"
            >
              <IoClose className="text-xl" />
            </button>

            <SideBar />
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="min-w-0 flex-1 overflow-hidden">
        <Routes>
          <Route path="/" element={<NewChat />} />

          <Route
            path="/chat/:id"
            element={<ChatPage />}
          />

          <Route
            path="/settings/:id"
            element={<Setting />}
          />

          <Route
            path="/signin"
            element={<Navigate to="/" replace />}
          />

          <Route
            path="/signup"
            element={<Navigate to="/" replace />}
          />

          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />
        </Routes>
      </main>
    </div>
  )
}

export default App