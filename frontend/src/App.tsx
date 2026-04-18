import { BrowserRouter, Route, Routes } from "react-router-dom"
import Navbar from "./components/Navbar"
import { AuthProvider } from "./context/AuthContext"
import Login from "./pages/Login"
import Register from "./pages/Register"
import UserDashboard from "./pages/UserDashboard"
import AdminDashboard from "./pages/AdminDashboard"

function AppRouter() {
  return (
    <BrowserRouter>
      <AuthProvider>
        {/*this makes the entire app fill the screen and allows us to use flexbox to layout the navbar and main content*/}
        <div className="flex flex-col h-screen overflow-hidden">
          <Navbar />
          {/* flex-1 makes this area fill the rest of the screen */}
          <main className="flex-1 overflow-y-auto bg-gray-50">
            <Routes>
              <Route path="/" element={<div>Home</div>} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/user" element={<UserDashboard />} />
              <Route path="/admin" element={<AdminDashboard />} />
              
            </Routes>
          </main>

        </div>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default AppRouter