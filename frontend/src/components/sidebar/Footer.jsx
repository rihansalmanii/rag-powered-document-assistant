import { useState } from "react"
import { useNavigate } from "react-router-dom"

import {
  FiLogOut,
  FiSettings
} from "react-icons/fi"

import { useAuth } from "../../contexts/AuthContext"

const Footer = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const [loggingOut, setLoggingOut] = useState(false)

  const username =
    user?.username ||
    user?.email?.split("@")[0] ||
    "User"

  const email =
    user?.email || "Authenticated account"

  const initial =
    username.charAt(0).toUpperCase()

  const handleSettings = () => {
    if (!user?.user_id) return

    navigate(`/settings/${user.user_id}`)
  }

  const handleLogout = async () => {
    if (loggingOut) return

    try {
      setLoggingOut(true)
      await logout()
    } catch (error) {
      console.error("Error logging out:", error)
    } finally {
      setLoggingOut(false)
    }
  }

  return (
    <footer className="shrink-0 border-t border-white/[0.06] px-3 pb-4 pt-3">
      <div className="rounded-[22px] border border-white/[0.08] bg-white/[0.04] p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-xl">
        {/* Account row */}
        <div className="flex min-w-0 items-center gap-3 rounded-2xl px-2 py-2">
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] border border-white/[0.1] bg-gradient-to-br from-white/[0.14] to-white/[0.035] text-sm font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
            {initial}

            <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-[3px] border-[#111114] bg-emerald-400" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-[15px] font-medium text-white/80">
              {username}
            </p>

            <p
              className="mt-0.5 truncate text-[13px] text-white/45"
              title={email}
            >
              {email}
            </p>
          </div>

          <button
            type="button"
            onClick={handleSettings}
            disabled={!user?.user_id}
            aria-label="Open settings"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-white/25 transition hover:bg-white/[0.07] hover:text-white/65 disabled:cursor-not-allowed disabled:opacity-30"
          >
            <FiSettings className="text-lg" />
          </button>
        </div>

        <div className="mx-2 my-1 h-px bg-white/[0.05]" />

        {/* Logout */}
        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          className="group flex h-10 w-full items-center justify-between rounded-2xl px-3 text-xs text-white/35 transition hover:bg-white/[0.055] hover:text-white/70 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span>Account session</span>

          <span className="flex items-center gap-2">
            {loggingOut ? "Signing out..." : "Logout"}

            {loggingOut ? (
              <span className="h-3.5 w-3.5 animate-spin rounded-full border border-white/20 border-t-white/70" />
            ) : (
              <FiLogOut className="text-sm" />
            )}
          </span>
        </button>
      </div>

      <p className="mt-3 text-center text-[9px] uppercase tracking-[0.18em] text-white/28">
        DocLens · Private document chat
      </p>
    </footer>
  )
}

export default Footer