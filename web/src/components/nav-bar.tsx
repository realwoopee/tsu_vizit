import { Link, useNavigate } from "react-router-dom"
import { LogOut } from "lucide-react"
import { useState } from "react"
import "../styles/nav-bar.css"

type UserRole = "guest" | "student" | "admin"

interface NavBarProps {
  userRole?: UserRole
  userName?: string
}

export const NavBar = ({ userRole = "guest", userName }: NavBarProps) => {
  const navigate = useNavigate()
  const [profileName, setProfileName] = useState<string | null>(null)
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJ0c3Utdml6aXQiLCJpc3MiOiJ0c3Utdml6aXQiLCJleHAiOjE3NDI0MjM2MjgsIlVzZXJJZCI6IjAxOTU5MTRlLWRkMGYtN2Q5Ny04YjdkLWIzMGU4NzA1NTQyZSIsIlNlc3Npb25JZCI6IjA5Mjg1OWE0LTFhYWUtNDc4Yi04MjVhLTUwMzAzMmIzMWZkZCIsImlhdCI6MTc0MjQyMDAyOCwibmJmIjoxNzQyNDIwMDI4fQ.mxcAWdoQz0P9tIH4vAIbktYUepNVcTPMaNUgv54Wi0I"

  const fetchUserProfile = async () => {
    try {

      const profileResponse = await fetch("https://vizit.90.188.95.63.sslip.io/api/account/profile", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!profileResponse.ok) {
        throw new Error("Не удалось получить данные профиля")
      }

      const profileData = await profileResponse.json()
      if (profileData.fullName) {
        setProfileName(profileData.fullName)
      }
    } catch (error) {
      console.error("Ошибка при получении данных профиля:", error)
    }
  }

  fetchUserProfile()


  const handleLogout = async () => {
    try {

      const sessionResponse = await fetch("https://vizit.90.188.95.63.sslip.io/api/session", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!sessionResponse.ok) {
        throw new Error("Не удалось получить данные сессии")
      }

      const sessionData = await sessionResponse.json()
      const sessionId = sessionData.id

      const logoutResponse = await fetch(`https://vizit.90.188.95.63.sslip.io/api/session/${sessionId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!logoutResponse.ok) {
        throw new Error("Не удалось выйти из системы")
      }

      navigate("/login")
    } catch (error) {
      console.error("Ошибка при выходе из системы:", error)
      navigate("/login")
    }
  }


  const displayName = profileName || "Профиль"

  return (
    <nav className="nav-bar">
      <div className="nav-left">
        <Link to="/" className="nav-logo-link">
          <img src="/src/assets/logo.svg" alt="ТГУ логотип" className="nav-logo" />
        </Link>
      </div>

      <div className="nav-right">
        {userRole === "guest" ? (
          <>
            <Link to="/register" className="nav-button">
              Регистрация
            </Link>
            <Link to="/login" className="nav-button">
              Войти
            </Link>
          </>
        ) : (
          <>
            {userRole === "admin" && (
              <Link to="/users" className="nav-link">
                Список пользователей
              </Link>
            )}
            <Link to="/passes" className="nav-link">
              Список пропусков
            </Link>
            <Link to="/profile" className="nav-link">
              {displayName}
            </Link>
            <button className="nav-button logout-button" onClick={handleLogout}>
              <LogOut size={20} />
              <span>Выйти</span>
            </button>
          </>
        )}
      </div>
    </nav>
  )
}

