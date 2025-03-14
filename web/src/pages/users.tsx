"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { NavBar } from "../components/nav-bar"
import { UserList } from "../components/user-list"
import { Search, ChevronDown } from "lucide-react"
import "../styles/users.css"
import type { User, UserRole } from "../components/user-list-item"

type SortingOption = "NameAsc" | "NameDesc" | "RoleAsc" | "RoleDesc"

interface SearchParams {
  studentIdNumber?: string
  fullName?: string
  email?: string
  role?: UserRole
  sorting?: SortingOption
  offset: number
  limit: number
}

export const UsersPage = () => {
  const [searchParams, setSearchParams] = useState<SearchParams>({
    offset: 0,
    limit: 10,
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    const mockUsers: User[] = [
      {
        id: 1,
        fullName: "Иванов Иван Иванович",
        email: "ivanov@edu.tsu.ru",
        studentIdNumber: "123456",
        role: "Student",
      },
      {
        id: 2,
        fullName: "Петров Петр Петрович",
        email: "petrov@tsu.ru",
        role: "Teacher",
      },
      {
        id: 3,
        fullName: "Сидоров Сидор Сидорович",
        email: "sidorov@tsu.ru",
        role: "DeansEmployee",
      },
      {
        id: 4,
        fullName: "Александров Александр Александрович",
        email: "admin@tsu.ru",
        role: "Admin",
      },
    ]

    setTimeout(() => {
      setUsers(mockUsers)
      setIsLoading(false)
    }, 500)
  }, [searchParams])

  const handleRoleChange = (userId: number, newRole: UserRole) => {
    setUsers(users.map((user) => (user.id === userId ? { ...user, role: newRole } : user)))
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
    console.log("Search params:", searchParams)
  }

  const updateSearchParam = (param: keyof SearchParams, value: string) => {
    setSearchParams((prev) => ({
      ...prev,
      [param]: value || undefined
    }))
  }

  return (
    <div className="users-page">
      <NavBar userRole="admin" userName="Администратор" />

      <div className="users-container">
        <h1 className="users-title">Список пользователей</h1>

        <div className="search-section">
          <div className="search-header">
            <div className="search-main">
              <input
                type="text"
                className="search-input"
                placeholder="Поиск по ФИО"
                value={searchParams.fullName || ""}
                onChange={(e) => updateSearchParam("fullName", e.target.value)}
              />
              <button className="search-button" onClick={handleSearch}>
                <Search size={20} />
              </button>
            </div>
            <button className="filters-toggle" onClick={() => setShowFilters(!showFilters)}>
              Фильтры
              <ChevronDown size={20} className={`chevron ${showFilters ? "rotated" : ""}`} />
            </button>
          </div>

          {showFilters && (
            <form className="filters-panel" onSubmit={handleSearch}>
              <div className="filters-grid">
                <div className="filter-group">
                  <label>Номер студенческого:</label>
                  <input
                    type="text"
                    value={searchParams.studentIdNumber || ""}
                    onChange={(e) => updateSearchParam("studentIdNumber", e.target.value)}
                    placeholder="Введите номер"
                  />
                </div>

                <div className="filter-group">
                  <label>Email:</label>
                  <input
                    type="email"
                    value={searchParams.email || ""}
                    onChange={(e) => updateSearchParam("email", e.target.value)}
                    placeholder="Введите email"
                  />
                </div>

                <div className="filter-group">
                  <label>Роль:</label>
                  <select value={searchParams.role || ""} onChange={(e) => updateSearchParam("role", e.target.value)}>
                    <option value="">Все роли</option>
                    <option value="Student">Студент</option>
                    <option value="Teacher">Преподаватель</option>
                    <option value="DeansEmployee">Сотрудник деканата</option>
                    <option value="Admin">Администратор</option>
                  </select>
                </div>

                <div className="filter-group">
                  <label>Сортировка:</label>
                  <select
                    value={searchParams.sorting || ""}
                    onChange={(e) => updateSearchParam("sorting", e.target.value)}
                  >
                    <option value="">По умолчанию</option>
                    <option value="NameAsc">По имени (А-Я)</option>
                    <option value="NameDesc">По имени (Я-А)</option>
                    <option value="RoleAsc">По роли (А-Я)</option>
                    <option value="RoleDesc">По роли (Я-А)</option>
                  </select>
                </div>
              </div>

              <div className="filters-footer">
                <button type="submit" className="apply-filters">
                  Применить фильтры
                </button>
              </div>
            </form>
          )}
        </div>

        {isLoading ? (
          <div className="loading-indicator">Загрузка...</div>
        ) : (
          <UserList users={users} onRoleChange={handleRoleChange} />
        )}
      </div>
    </div>
  )
}

export default UsersPage

