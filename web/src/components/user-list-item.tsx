"use client"
import { useState } from "react"
import { ConfirmationModal } from "./role-confirm"
import "../styles/user-list-item.css"

export type UserRole = "Student" | "Teacher" | "DeansEmployee" | "Admin"

export interface User {
  id: number
  fullName: string
  email: string
  studentIdNumber?: string
  role: UserRole
}

interface UserListItemProps {
  user: User
  onRoleChange: (userId: number, newRole: UserRole) => void
}

export const UserListItem = ({ user, onRoleChange }: UserListItemProps) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(user.role)
  const [hasChanges, setHasChanges] = useState(false)
  // Добавить состояние для модального окна
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleRoleChange = (newRole: UserRole) => {
    setSelectedRole(newRole)
    setHasChanges(true)
  }

  // Изменить обработчик сохранения, чтобы он открывал модальное окно
  const handleSave = () => {
    setIsModalOpen(true)
  }

  // Добавить обработчик подтверждения
  const handleConfirm = () => {
    console.log(`Отправка запроса на изменение роли пользователя ${user.fullName} на ${selectedRole}`)
    onRoleChange(user.id, selectedRole)
    setHasChanges(false)
    setIsModalOpen(false)
  }

  return (
    <div className="user-list-item">
      <div className="user-info">
        <div className="user-name">{user.fullName}</div>
        <div className="user-details">
          {user.studentIdNumber && <span className="user-id">ID: {user.studentIdNumber}</span>}
          <span className="user-email">{user.email}</span>
        </div>
      </div>
      <div className="user-role-control">
        <select
          className="role-select"
          value={selectedRole}
          onChange={(e) => handleRoleChange(e.target.value as UserRole)}
        >
          <option value="Student">Студент</option>
          <option value="Teacher">Преподаватель</option>
          <option value="DeansEmployee">Сотрудник деканата</option>
          <option value="Admin">Администратор</option>
        </select>
        <button className={`save-button ${hasChanges ? "active" : ""}`} onClick={handleSave} disabled={!hasChanges}>
          Сохранить
        </button>
      </div>

      {/* Добавить модальное окно подтверждения */}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirm}
        title="Подтверждение изменения роли"
        message={`Вы уверены, что хотите изменить роль пользователя ${user.fullName} на "${selectedRole === "Student" ? "Студент" : selectedRole === "Teacher" ? "Преподаватель" : selectedRole === "DeansEmployee" ? "Сотрудник деканата" : "Администратор"}"?`}
        confirmText="Сохранить"
        cancelText="Отмена"
      />
    </div>
  )
}

