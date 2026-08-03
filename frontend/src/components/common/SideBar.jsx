import ChatList from "../sidebar/ChatList"
import Header from "../sidebar/Header"
import Footer from "../sidebar/Footer"

const SideBar = () => {
  return (
    <aside className="relative flex h-screen w-full flex-col overflow-hidden border-r border-white/[0.07] bg-[#070709] text-white">
      {/* Ambient background effects */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 -top-28 h-72 w-72 rounded-full bg-white/[0.05] blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-white/[0.025] blur-3xl" />
        <div className="absolute right-[-55px] top-24 h-72 w-20 rotate-[26deg] bg-white/[0.025] blur-3xl" />
      </div>

      <div className="relative z-10 flex min-h-0 flex-1 flex-col">
        <Header />

        <div className="min-h-0 flex-1 overflow-hidden">
          <ChatList />
        </div>

        <Footer />
      </div>
    </aside>
  )
}

export default SideBar