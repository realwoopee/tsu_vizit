import { type User, UserListItem } from "./user-list-item"
import "../styles/user-list.css"

interface UserListProps {
  users: User[]
  onRoleChange: (userId: string | number, newRole: User["role"]) => void
}

export const UserList = ({ users, onRoleChange }: UserListProps) => {
  if (users.length === 0) {
    return <div className="user-list-empty">Пользователи не найдены</div>
  }

  return (
    <div className="user-list">
      {users.map((user) => (
        <UserListItem key={user.id.toString()} user={user} onRoleChange={onRoleChange} />
      ))}
    </div>
  )
}

