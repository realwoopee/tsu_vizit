"use client"
import "../styles/user-list-item.css"

export interface User {
  id: number
  fullName: string
  roles: {
    isStudent: boolean
    isTeacher: boolean
    isDean: boolean
    isAdmin: boolean
  }
}

interface UserListItemProps {
  user: User
  onRoleChange: (userId: number, role: keyof User["roles"], value: boolean) => void
}

export const UserListItem = ({ user, onRoleChange }: UserListItemProps) => {
  const handleRoleChange = (role: keyof User["roles"]) => {
    onRoleChange(user.id, role, !user.roles[role])
  }

  return (
    <div className="user-list-item">
      <div className="user-name">{user.fullName}</div>
      <div className="user-roles">
        <label className="role-checkbox">
          <input type="checkbox" checked={user.roles.isStudent} onChange={() => handleRoleChange("isStudent")} />
          <span className="role-label">Студент</span>
        </label>
        <label className="role-checkbox">
          <input type="checkbox" checked={user.roles.isTeacher} onChange={() => handleRoleChange("isTeacher")} />
          <span className="role-label">Преподаватель</span>
        </label>
        <label className="role-checkbox">
          <input type="checkbox" checked={user.roles.isDean} onChange={() => handleRoleChange("isDean")} />
          <span className="role-label">Деканат</span>
        </label>
        <label className="role-checkbox">
          <input type="checkbox" checked={user.roles.isAdmin} onChange={() => handleRoleChange("isAdmin")} />
          <span className="role-label">Администратор</span>
        </label>
      </div>
    </div>
  )
}

