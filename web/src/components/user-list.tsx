import { type User, UserListItem } from "./user-list-item"
import "../styles/user-list.css"

interface UserListProps {
  users: User[]
  onRoleChange: (userId: number, role: keyof User["roles"], value: boolean) => void
}

export const UserList = ({ users, onRoleChange }: UserListProps) => {
  if (users.length === 0) {
    return <div className="user-list-empty">Пользователи не найдены</div>
  }

  return (
    <div className="user-list">
      {users.map((user) => (
        <UserListItem key={user.id} user={user} onRoleChange={onRoleChange} />
      ))}
    </div>
  )
}

