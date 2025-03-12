"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { NavBar } from "../components/nav-bar"
import { UserList } from "../components/user-list"
import { Search } from "lucide-react"
import { ConfirmationModal } from "../components/role-confirm"
import "../styles/users.css"
import type { User } from "../components/user-list-item"

export const UsersPage = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [changedUserIds, setChangedUserIds] = useState<Set<number>>(new Set())

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)

    //Искусственные данные пользователей, заменить на API-запрос
  useEffect(() => {
    const mockUsers: User[] = [
      {
        id: 1,
        fullName: "Иванов Иван Иванович",
        roles: {
          isStudent: true,
          isTeacher: false,
          isDean: false,
          isAdmin: false,
        },
      },
      {
        id: 2,
        fullName: "Петров Петр Петрович",
        roles: {
          isStudent: true,
          isTeacher: true,
          isDean: false,
          isAdmin: false,
        },
      },
      {
        id: 3,
        fullName: "Сидоров Сидор Сидорович",
        roles: {
          isStudent: false,
          isTeacher: true,
          isDean: true,
          isAdmin: false,
        },
      },
      {
        id: 4,
        fullName: "Александров Александр Александрович",
        roles: {
          isStudent: false,
          isTeacher: false,
          isDean: false,
          isAdmin: true,
        },
      },
      {
        id: 5,
        fullName: "Николаев Николай Николаевич",
        roles: {
          isStudent: true,
          isTeacher: false,
          isDean: true,
          isAdmin: false,
        },
      },
    ]

    //Искусственная задержки загрузки, удалить при подключении бэка
    setTimeout(() => {
      setUsers(mockUsers)
      setFilteredUsers(mockUsers)
      setIsLoading(false)
    }, 500)
  }, [])

  const handleRoleChange = (userId: number, role: keyof User["roles"], value: boolean) => {
    const updatedUsers = users.map((user) => {
      if (user.id === userId) {
        return {
          ...user,
          roles: {
            ...user.roles,
            [role]: value,
          },
        }
      }
      return user
    })

    setUsers(updatedUsers)

    setChangedUserIds((prev) => {
      const newSet = new Set(prev)
      newSet.add(userId)
      return newSet
    })
    setHasUnsavedChanges(true)

    const query = searchQuery.toLowerCase()
    const filtered = updatedUsers.filter((user) => user.fullName.toLowerCase().includes(query))
    setFilteredUsers(filtered)
  }

  const handleSearch = () => {
    if (searchQuery.trim() === "") {
      setFilteredUsers(users)
    } else {
      const query = searchQuery.toLowerCase()
      const filtered = users.filter((user) => user.fullName.toLowerCase().includes(query))
      setFilteredUsers(filtered)
    }
  }

  const handleOpenConfirmModal = () => {
    if (hasUnsavedChanges) {
      setIsConfirmModalOpen(true)
    }
  }

  const handleSaveChanges = () => {
    const usersToUpdate = users.filter((user) => changedUserIds.has(user.id))

    console.log("Сохранение изменений для пользователей:", usersToUpdate)

    setHasUnsavedChanges(false)
    setChangedUserIds(new Set())
    setIsConfirmModalOpen(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  //Кол-во элементов на страницу, заменить при подключении бэка
  const itemsPerPage = 1
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const renderPaginationButtons = () => {
    const buttons = []

    buttons.push(
      <button
        key="first"
        className={`pagination-button ${currentPage === 1 ? "active" : ""}`}
        onClick={() => setCurrentPage(1)}
      >
        1
      </button>,
    )

    if (currentPage > 3) {
      buttons.push(
        <span key="ellipsis-start" className="pagination-ellipsis">
          ...
        </span>,
      )
    }

    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      if (i === 1 || i === totalPages) continue

      buttons.push(
        <button
          key={i}
          className={`pagination-button ${currentPage === i ? "active" : ""}`}
          onClick={() => setCurrentPage(i)}
        >
          {i}
        </button>,
      )
    }

    if (currentPage < totalPages - 2 && totalPages > 3) {
      buttons.push(
        <span key="ellipsis-end" className="pagination-ellipsis">
          ...
        </span>,
      )
    }

    if (totalPages > 1) {
      buttons.push(
        <button
          key="last"
          className={`pagination-button ${currentPage === totalPages ? "active" : ""}`}
          onClick={() => setCurrentPage(totalPages)}
        >
          {totalPages}
        </button>,
      )
    }

    return buttons
  }

  const changedUsersCount = changedUserIds.size

  return (
    <div className="users-page">
      <NavBar userRole="admin" userName="Администратор" />

      <div className="users-container">
        <h1 className="users-title">Список пользователей</h1>

        <div className="search-container">
          <div className="search-input-wrapper">
            <input
              type="text"
              className="search-input"
              placeholder="Поиск по ФИО"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button className="search-icon-button" onClick={handleSearch}>
              <Search size={20} />
            </button>
          </div>
          <button className="save-button" onClick={handleOpenConfirmModal} disabled={!hasUnsavedChanges}>
            <span>Сохранить изменения</span>
          </button>
        </div>

        {isLoading ? (
          <div className="loading-indicator">Загрузка...</div>
        ) : (
          <>
            <UserList users={paginatedUsers} onRoleChange={handleRoleChange} />

            {totalPages > 1 && <div className="pagination">{renderPaginationButtons()}</div>}
          </>
        )}
      </div>

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleSaveChanges}
        title="Подтверждение изменений"
        message={`Вы уверены, что хотите сохранить изменения ролей для ${changedUsersCount} ${
          changedUsersCount === 1
            ? "пользователя"
            : changedUsersCount > 1 && changedUsersCount < 5
              ? "пользователей"
              : "пользователей"
        }?`}
        confirmText="Сохранить"
        cancelText="Отмена"
      />
    </div>
  )
}

export default UsersPage

