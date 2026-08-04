import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi"
import { FcGoogle } from "react-icons/fc"

import { useAuth } from "../contexts/AuthContext"

const Login = () => {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [formData, setFormData] = useState({
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
      await login(formData)

      setFormData({
        email: "",
        password: ""
      })

      navigate("/")
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Unable to sign in. Please try again."
      )
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = () => {
    console.log("Google login is not implemented yet")
  }

  return (
    <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#020205] px-4 py-10 text-white">
      {/* Background lighting */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 right-[8%] h-[420px] w-[180px] rotate-[34deg] bg-white/10 blur-3xl" />
        <div className="absolute top-[7%] right-[19%] h-[520px] w-[90px] rotate-[34deg] bg-white/5 blur-3xl" />
        <div className="absolute bottom-[-180px] left-1/2 h-[320px] w-[720px] -translate-x-1/2 rounded-full bg-white/[0.025] blur-3xl" />
      </div>

      {/* Login card */}
      <section className="relative z-10 w-full max-w-[470px] rounded-[38px] border border-white/15 bg-white/[0.08] px-7 py-9 shadow-[0_28px_100px_rgba(0,0,0,0.75),inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-2xl sm:px-10 sm:py-11">
        {/* Logo */}
        {/* <div className="text-center text-5xl font-semibold">DocLens</div> */}


        <div className="text-center">
          <h1 className="text-3xl font-semibold tracking-tight">
            Sign In
          </h1>

          <p className="mt-2 text-sm text-white/55">
            Please enter your details to sign in.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-10 space-y-5"
        >
          {/* Email */}
          <div className="relative">
            <FiMail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-white/60" />

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email address"
              autoComplete="email"
              required
              className="h-14 w-full rounded-2xl border border-white/10 bg-white/[0.07] pl-12 pr-4 text-md text-white outline-none transition placeholder:text-white/35 focus:border-white/25 focus:bg-white/[0.1] focus:ring-2 focus:ring-white/5"
            />
          </div>

          {/* Password */}
          <div>
            <div className="relative">
              <FiLock className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-white/60" />

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                autoComplete="current-password"
                required
                className="h-14 w-full rounded-2xl border border-white/10 bg-white/[0.07] pl-12 pr-12 text-md text-white outline-none transition placeholder:text-white/35 focus:border-white/25 focus:bg-white/[0.1] focus:ring-2 focus:ring-white/5"
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 text-lg text-white/50 transition hover:text-white"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>

            <div className="mt-3 flex justify-end">
              <button
                type="button"
                className="text-xs text-white/45 transition hover:text-white/80"
              >
                Forgot Password?
              </button>
            </div>
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
                Signing in...
              </span>
            ) : (
              "Sign in"
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="my-7 flex items-center gap-4">
          <span className="h-px flex-1 bg-white/10" />
          <span className="text-xs text-white/35">OR</span>
          <span className="h-px flex-1 bg-white/10" />
        </div>

        {/* Google */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="flex h-14 w-full items-center justify-center gap-3 rounded-2xl border border-white/5 bg-white/[0.07] text-sm text-white/70 transition hover:bg-white/[0.11] hover:text-white"
        >
          <FcGoogle className="text-xl" />
          Continue with Google
        </button>

        {/* Signup */}
        <p className="mt-8 text-center text-sm text-white/45">
          Don&apos;t have an account?{" "}
          <Link
            to="/signup"
            className="font-medium text-white transition hover:text-white/75"
          >
            Sign up
          </Link>
        </p>
      </section>
    </main>
  )
}

export default Login