import { type Pass, PassListItem } from "./pass-list-item"
import "../styles/pass-list.css"

interface PassListProps {
  passes: Pass[]
}

export const PassList = ({ passes }: PassListProps) => {
  if (passes.length === 0) {
    return <div className="pass-list-empty">Пользователи не найдены</div>
  }

  return (
    <div className="pass-list">
      {passes.map((pass) => (
        <PassListItem key={pass.toString()} pass={pass} />
      ))}
    </div>
  )
}