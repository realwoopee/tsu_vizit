"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { NavBar } from "../components/nav-bar"
import { UserList } from "../components/user-list"
import { Pagination } from "../components/users-pagination"
import { Search, ChevronDown, AlertCircle } from "lucide-react"
import "../styles/users.css"
import type { User, UserRole } from "../components/user-list-item"
import { fetchUsers, updateUserRole, type SearchParams } from "../services/users-api"

export const UsersPage = () => {
  const [formInputs, setFormInputs] = useState<SearchParams>({
    offset: 0,
    limit: 10,
  })

  const [searchParams, setSearchParams] = useState<SearchParams>({
    offset: 0,
    limit: 10,
  })

  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [fetchTrigger, setFetchTrigger] = useState(0)

  useEffect(() => {
    const getUsers = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const response = await fetchUsers(searchParams)
        setUsers(response.users)
        setTotalCount(response.totalCount)
      } catch (err) {
        if  (err instanceof Error && err.message.includes("401")){
          setError("Ошибка авторизации. У Вас нет доступа к списку пользователей.")
          setUsers([])
        }
        else{
        setError("Не удалось загрузить список пользователей. Пожалуйста, попробуйте позже.")
        }
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    getUsers()
  }, [fetchTrigger])

  const handleRoleChange = async (userId: string | number, newRole: UserRole) => {
    try {
      await updateUserRole(userId, newRole)
      setUsers(users.map((user) => (user.id === userId ? { ...user, role: newRole } : user)))
    } catch (error) {
      console.error("Ошибка при изменении роли:", error)
      alert("Не удалось изменить роль пользователя. Пожалуйста, попробуйте позже.")
    }
  }

  const handleSearch = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault()
    }

    setCurrentPage(1)

    setSearchParams({
      ...formInputs,
      offset: 0,
    })

    setFetchTrigger((prev) => prev + 1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)

    const offset = (page - 1) * (searchParams.limit || 10)

    setSearchParams((prev) => ({
      ...prev,
      offset,
    }))

    setFetchTrigger((prev) => prev + 1)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleSearch()
    }
  }

  const updateFormInput = (param: keyof SearchParams, value: string | number) => {
    setFormInputs((prev) => ({
      ...prev,
      [param]: value || undefined,
    }))
  }

  const totalPages = Math.ceil(totalCount / (searchParams.limit || 10))

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
                value={formInputs.fullName || ""}
                onChange={(e) => updateFormInput("fullName", e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button className="search-button" onClick={() => handleSearch()}>
                <Search size={20} />
              </button>
            </div>

            <div className="items-per-page">
              <label htmlFor="limit">На странице:</label>
              <input
                id="limit"
                type="number"
                min="1"
                max="100"
                className="limit-input"
                value={formInputs.limit || 10}
                onChange={(e) => updateFormInput("limit", Number.parseInt(e.target.value) || 10)}
                onKeyDown={handleKeyDown}
              />
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
                    value={formInputs.studentIdNumber || ""}
                    onChange={(e) => updateFormInput("studentIdNumber", e.target.value)}
                    placeholder="Введите номер"
                    onKeyDown={handleKeyDown}
                  />
                </div>

                <div className="filter-group">
                  <label>Email:</label>
                  <input
                    type="email"
                    value={formInputs.email || ""}
                    onChange={(e) => updateFormInput("email", e.target.value)}
                    placeholder="Введите email"
                    onKeyDown={handleKeyDown}
                  />
                </div>

                <div className="filter-group">
                  <label>Роль:</label>
                  <select
                    value={formInputs.role || ""}
                    onChange={(e) => updateFormInput("role", (e.target.value as UserRole) || "")}
                  >
                    <option value="">Все роли</option>
                    <option value="Student">Студент</option>
                    <option value="Teacher">Преподаватель</option>
                    <option value="DeansEmployee">Сотрудник деканата</option>
                    <option value="Admin">Администратор</option>
                  </select>
                </div>

                <div className="filter-group">
                  <label>Сортировка:</label>
                  <select value={formInputs.sorting || ""} onChange={(e) => updateFormInput("sorting", e.target.value)}>
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

        {error && (
          <div className="error-message">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {isLoading ? (
          <div className="loading-indicator">Загрузка...</div>
        ) : users.length > 0 ? (
          <>
            <UserList users={users} onRoleChange={handleRoleChange} />
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
          </>
        ) : (
          <div className="no-results">Пользователи не найдены</div>
        )}
      </div>
    </div>
  )
}

export default UsersPage

