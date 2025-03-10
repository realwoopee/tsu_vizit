import { useState } from "react"
import { Calendar, File, Menu } from "lucide-react"
import "../styles/pass-list-item.css"

type PassStatus = "На проверке" | "Принято" | "Отклонено"

interface PassListItemProps {
  status: PassStatus
  fullName: string
  reason: string
  startDate: string
  endDate: string
}

export const PassListItem = ({ status, fullName, reason, startDate, endDate }: PassListItemProps) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [currentEndDate, setCurrentEndDate] = useState(endDate)

  const getStatusClass = (status: PassStatus) => {
    switch (status) {
      case "На проверке":
        return "status-review"
      case "Принято":
        return "status-accepted"
      case "Отклонено":
        return "status-rejected"
      default:
        return ""
    }
  }

  const toggleCalendar = () => {
    setIsCalendarOpen(!isCalendarOpen)
  }

  return (
    <div className="pass-list-item">
      <div className="pass-left-section">
        <div className={`pass-status ${getStatusClass(status)}`}>{status}</div>
        <div className="pass-fullname">{fullName}</div>
      </div>

      <div className="pass-right-section">
        <div className="pass-reason">{reason}</div>
        <div className="pass-date">{startDate}</div>
        <div className="pass-date-separator">—</div>
        <div className="pass-end-date" onClick={toggleCalendar}>
          {currentEndDate}
          <Calendar className="calendar-icon" size={18} />
        </div>
        <button className="pass-file-button">
          <File size={20} />
        </button>
        <button className="pass-menu-button">
          <Menu size={20} />
        </button>
      </div>
    </div>
  )
}