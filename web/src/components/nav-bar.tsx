import { Link } from "react-router-dom"
import { LogOut } from "lucide-react"
import "./nav-bar.css"

type UserRole = "guest" | "student" | "admin"

interface NavBarProps {
  userRole?: UserRole
  userName?: string
}

export const NavBar = ({ userRole = "guest", userName }: NavBarProps) => {
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
            <button className="nav-profile">
              {userName || "Профиль"}
            </button>
            <button className="nav-button logout-button">
              <LogOut size={20} />
              <span>Выйти</span>
            </button>
          </>
        )}
      </div>
    </nav>
  )
}

