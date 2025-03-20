"use client"

import { Link, useNavigate } from "react-router-dom"
import { useState, useEffect, useRef } from "react"
import { ChevronDown, LogOut, User, Layers } from "lucide-react"
import "../styles/nav-bar.css"
import ProfileModal from "./profile-modal"
import SessionsModal from "./sessions-modal"

type UserRole = "Student" | "Teacher" | "DeansEmployee" | "Admin" | "guest"

interface NavBarProps {
  userRole?: UserRole
  userName?: string
}

export const NavBar = ({ userRole = "guest", userName }: NavBarProps) => {
  const navigate = useNavigate()
  const [profileName, setProfileName] = useState<string | null>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [isSessionsModalOpen, setIsSessionsModalOpen] = useState(false)
  const [userRoleState, setUserRoleState] = useState<UserRole>(userRole || "guest")

  const menuRef = useRef<HTMLDivElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  const fetchUserProfile = async () => {
    try {
      // Заглушка для Bearer токена
      const token = localStorage.getItem("token")

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

      // Set the user role from the profile data
      if (profileData.role) {
        setUserRoleState(profileData.role)
      }
    } catch (error) {
      console.error("Ошибка при получении данных профиля:", error)
      setUserRoleState("guest")
    }
  }

  useEffect(() => {
    if (userRole && userRole !== "guest") {
      setUserRoleState(userRole)
    }
    fetchUserProfile()
  }, [userRole])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMenuOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isMenuOpen])

  const handleLogout = async () => {
    try {
      // Заглушка для Bearer токена
      const token = "example_bearer_token"

      const sessionResponse = await fetch("https://vizit.90.188.95.63.sslip.io/api/session/current", {
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

  const displayName = profileName || userName || "Профиль"

  const handleProfileClick = () => {
    setIsProfileModalOpen(true)
    setIsMenuOpen(false)
  }

  const handleSessionsClick = () => {
    setIsSessionsModalOpen(true)
    setIsMenuOpen(false)
  }

  return (
    <nav className="nav-bar">
      <div className="nav-left">
        <Link to="/" className="nav-logo-link">
          <img src="/src/assets/logo.svg" alt="ТГУ логотип" className="nav-logo" />
        </Link>
      </div>

      <div className="nav-right">
        {userRoleState === "guest" ? (
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
            {(userRoleState === "DeansEmployee" || userRoleState === "Admin") && (
              <Link to="/users" className="nav-link">
                Список пользователей
              </Link>
            )}
            <Link to="/passes" className="nav-link">
              Список пропусков
            </Link>

            <button className="nav-profile" onClick={handleProfileClick}>
              <User size={18} />
              <span>{displayName}</span>
            </button>

            <div className="menu-container">
              <button className="nav-menu-button" onClick={() => setIsMenuOpen(!isMenuOpen)} ref={menuButtonRef}>
                <ChevronDown size={20} />
              </button>

              {isMenuOpen && (
                <div className="nav-dropdown-menu" ref={menuRef}>
                  <button className="dropdown-item" onClick={handleSessionsClick}>
                    <Layers size={16} className="icon-left" />
                    <span>Сессии</span>
                  </button>
                  <button className="dropdown-item delete" onClick={handleLogout}>
                    <LogOut size={16} className="icon-left" />
                    <span>Выйти</span>
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {isProfileModalOpen && (
        <ProfileModal onClose={() => setIsProfileModalOpen(false)} onProfileUpdated={fetchUserProfile} />
      )}

      {isSessionsModalOpen && <SessionsModal onClose={() => setIsSessionsModalOpen(false)} />}
    </nav>
  )
}

