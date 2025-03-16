import { Link } from "react-router-dom"
import { LogOut } from "lucide-react"
import { Navbar, Container, Nav, Button } from "react-bootstrap"
import "../../styles/nav-bar.css"

type UserRole = "guest" | "student" | "admin"

interface NavBarProps {
  userRole?: UserRole
  userName?: string
}

export const NavBar = ({ userRole = "guest", userName }: NavBarProps) => {
  return (
    <Navbar bg="primary" variant="dark" fixed="top" className="nav-bar">
      <Container fluid>
        <Navbar.Brand as={Link} to="/" className="nav-left">
          <img
            src="/src/assets/logo.svg"
            alt="ТГУ логотип"
            className="nav-logo"
          />
        </Navbar.Brand>
        <Nav className="ms-auto nav-right">
          {userRole === "guest" ? (
            <>
              <Nav.Link as={Link} to="/register" className="nav-button">
                Регистрация
              </Nav.Link>
              <Nav.Link as={Link} to="/login" className="nav-button">
                Войти
              </Nav.Link>
            </>
          ) : (
            <>
              {userRole === "admin" && (
                <Nav.Link as={Link} to="/users" className="nav-link">
                  Список пользователей
                </Nav.Link>
              )}
              <Nav.Link as={Link} to="/passes" className="nav-link">
                Список пропусков
              </Nav.Link>
              <Button variant="link" className="nav-profile">
                {userName || "Профиль"}
              </Button>
              <Button variant="link" className="nav-button logout-button">
                <LogOut size={20} />
                <span>Выйти</span>
              </Button>
            </>
          )}
        </Nav>
      </Container>
    </Navbar>
  )
}