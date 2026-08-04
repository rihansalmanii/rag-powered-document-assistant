import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi"

import { useAuth } from "../contexts/AuthContext"

const Signup = () => {
  const navigate = useNavigate()
  const { register } = useAuth()

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: ""
  })

  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    setError("")
    setLoading(true)

    try {
      await register(formData)

      setFormData({
        username: "",
        email: "",
        password: ""
      })

      navigate("/")
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        "Unable to create your account."
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#020205] px-4 py-10 text-white">
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-28 right-[8%] h-[430px] w-[180px] rotate-[34deg] bg-white/[0.09] blur-3xl" />

        <div className="absolute top-[8%] right-[20%] h-[500px] w-[90px] rotate-[34deg] bg-white/[0.04] blur-3xl" />

        <div className="absolute -bottom-52 left-1/2 h-[360px] w-[760px] -translate-x-1/2 rounded-full bg-white/[0.025] blur-3xl" />
      </div>

      {/* Signup card */}
      <section className="relative z-10 w-full max-w-[470px] rounded-[38px] border border-white/[0.14] bg-white/[0.075] px-7 py-9 shadow-[0_28px_100px_rgba(0,0,0,0.75),inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-2xl sm:px-10 sm:py-11">
        {/* Logo */}

        <div className="text-center">
          <h1 className="text-3xl font-semibold tracking-tight">
            Create account
          </h1>

          <p className="mt-2 text-sm text-white/50">
            Start chatting with your documents.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-11 space-y-5"
        >
          {/* Username */}
          <div className="relative">
            <FiUser className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-white/55" />

            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Choose a username"
              autoComplete="username"
              required
              minLength={2}
              className="h-14 w-full rounded-2xl border border-white/[0.09] bg-white/[0.065] pl-12 pr-4 text-md text-white outline-none transition placeholder:text-white/30 focus:border-white/25 focus:bg-white/[0.1] focus:ring-2 focus:ring-white/[0.04]"
            />
          </div>

          {/* Email */}
          <div className="relative">
            <FiMail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-white/55" />

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email address"
              autoComplete="email"
              required
              className="h-14 w-full rounded-2xl border border-white/[0.09] bg-white/[0.065] pl-12 pr-4 text-md text-white outline-none transition placeholder:text-white/30 focus:border-white/25 focus:bg-white/[0.1] focus:ring-2 focus:ring-white/[0.04]"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <FiLock className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-white/55" />

            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              autoComplete="new-password"
              required
              minLength={6}
              className="h-14 w-full rounded-2xl border border-white/[0.09] bg-white/[0.065] pl-12 pr-12 text-md text-white outline-none transition placeholder:text-white/30 focus:border-white/25 focus:bg-white/[0.1] focus:ring-2 focus:ring-white/[0.04]"
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={
                showPassword
                  ? "Hide password"
                  : "Show password"
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 text-lg text-white/45 transition hover:text-white"
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="flex h-14 w-full items-center justify-center rounded-2xl bg-white text-md font-medium text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/25 border-t-black" />
                Creating account...
              </span>
            ) : (
              "Create account"
            )}
          </button>
        </form>

        {/* Sign in link */}
        <p className="mt-8 text-center text-sm text-white/45">
          Already have an account?{" "}
          <Link
            to="/signin"
            className="font-medium text-white transition hover:text-white/70"
          >
            Sign in
          </Link>
        </p>

        <p className="mt-5 text-center text-[11px] leading-5 text-white/20">
          By creating an account, you agree to keep your uploaded
          documents appropriate and authorized for use.
        </p>
      </section>
    </main>
  )
}

export default Signup