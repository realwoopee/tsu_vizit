"use client"
import { useState } from "react"
import { ConfirmationModal } from "./role-confirm"
import "../styles/user-list-item.css"

export type UserRole = "Student" | "Teacher" | "DeansEmployee" | "Admin"

// Update the User interface to match the API response
export interface User {
  id: string | number // Change to accept string or number
  fullName: string
  email: string
  studentIdNumber?: string
  role: UserRole
}

interface UserListItemProps {
  user: User
  onRoleChange: (userId: string | number, newRole: UserRole) => void
}

export const UserListItem = ({ user, onRoleChange }: UserListItemProps) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(user.role)
  const [hasChanges, setHasChanges] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handleRoleChange = (newRole: UserRole) => {
    setSelectedRole(newRole)
    setHasChanges(true)
  }

  const handleSave = () => {
    setIsModalOpen(true)
  }

  const handleConfirm = async () => {
    try {
      setIsSaving(true)
      await onRoleChange(user.id, selectedRole)
      setHasChanges(false)
      setIsModalOpen(false)
    } catch (error) {
      console.error("Ошибка при сохранении роли:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const getRoleDisplayName = (role: UserRole): string => {
    switch (role) {
      case "Student":
        return "Студент"
      case "Teacher":
        return "Преподаватель"
      case "DeansEmployee":
        return "Сотрудник деканата"
      case "Admin":
        return "Администратор"
      default:
        return role
    }
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
          disabled={isSaving}
        >
          <option value="Student">Студент</option>
          <option value="Teacher">Преподаватель</option>
          <option value="DeansEmployee">Сотрудник деканата</option>
          <option value="Admin">Администратор</option>
        </select>
        <button
          className={`save-button ${hasChanges ? "active" : ""}`}
          onClick={handleSave}
          disabled={!hasChanges || isSaving}
        >
          {isSaving ? "Сохранение..." : "Сохранить"}
        </button>
      </div>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirm}
        title="Подтверждение изменения роли"
        message={`Вы уверены, что хотите изменить роль пользователя ${user.fullName} на "${getRoleDisplayName(selectedRole)}"?`}
        confirmText="Сохранить"
        cancelText="Отмена"
      />
    </div>
  )
}

