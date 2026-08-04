import NewChat from "./pages/NewChat"
import ChatPage from "./pages/ChatPage"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Setting from "./pages/Setting"

import SideBar from "./components/common/SideBar"

import {
  Navigate,
  Route,
  Routes
} from "react-router-dom"

import { useAuth } from "./contexts/AuthContext"

const App = () => {
  const { user, loading } = useAuth()

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

  // User is not logged in
  if (!user) {
    return (
      <Routes>
        <Route
          path="/signin"
          element={<Login />}
        />

        <Route
          path="/signup"
          element={<Signup />}
        />

        {/* Any protected or unknown route redirects to signin */}
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

  // User is logged in
  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#020205]">
      {/* Sidebar */}
      <div className="hidden w-[290px] shrink-0 md:block">
        <SideBar />
      </div>

      {/* Main content */}
      <main className="min-w-0 flex-1 overflow-hidden">
        <Routes>
          <Route
            path="/"
            element={<NewChat />}
          />

          <Route
            path="/chat/:id"
            element={<ChatPage />}
          />

          <Route
            path="/settings/:id"
            element={<Setting />}
          />

          {/* Logged-in users should not open auth pages */}
          <Route
            path="/signin"
            element={
              <Navigate
                to="/"
                replace
              />
            }
          />

          <Route
            path="/signup"
            element={
              <Navigate
                to="/"
                replace
              />
            }
          />

          {/* Unknown routes redirect home */}
          <Route
            path="*"
            element={
              <Navigate
                to="/"
                replace
              />
            }
          />
        </Routes>
      </main>
    </div>
  )
}

export default App