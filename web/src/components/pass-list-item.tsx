"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Calendar, File, Menu } from "lucide-react"
import { DatePicker } from "./date-picker"
import { DropdownMenu } from "./dropdown-menu"
import "../styles/pass-list-item.css"

type PassStatus = "На проверке" | "Принято" | "Отклонено"
type UserRole = "student" | "teacher" | "admin"

interface PassListItemProps {
  status: PassStatus
  fullName: string
  reason: string
  startDate: string
  endDate: string
  isEditable?: boolean
  userRole?: UserRole
}

export const PassListItem = ({
  status,
  fullName,
  reason,
  startDate,
  endDate,
  isEditable = true,
  userRole = "student",
}: PassListItemProps) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [currentEndDate, setCurrentEndDate] = useState(endDate)
  const [inputValue, setInputValue] = useState(endDate)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])

  const handleFilesSelected = (files: File[]) => {
    console.log("Выбранные файлы:", files)
    setSelectedFiles(files)
  }

  const handleDownloadFile = (file: File) => {
    const url = URL.createObjectURL(file)
    const link = document.createElement("a")
    link.href = url
    link.download = file.name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  // Функция для применения маски даты
  const applyDateMask = (value: string): string => {
    // Удаляем все нецифровые символы
    const digits = value.replace(/\D/g, "")

    // Применяем маску DD.MM.YYYY
    let result = ""

    if (digits.length > 0) {
      // Добавляем первые две цифры (день)
      result += digits.substring(0, Math.min(2, digits.length))

      // Добавляем точку и следующие две цифры (месяц)
      if (digits.length > 2) {
        result += "." + digits.substring(2, Math.min(4, digits.length))

        // Добавляем точку и последние цифры (год)
        if (digits.length > 4) {
          result += "." + digits.substring(4, Math.min(8, digits.length))
        }
      }
    }

    return result
  }

  // Проверка валидности даты
  const isValidDate = (dateString: string): boolean => {
    // Проверка формата DD.MM.YYYY
    if (!/^\d{2}\.\d{2}\.\d{4}$/.test(dateString)) {
      return false
    }

    const [day, month, year] = dateString.split(".").map(Number)

    // Проверка диапазонов
    if (
      isNaN(day) ||
      isNaN(month) ||
      isNaN(year) ||
      month < 1 ||
      month > 12 ||
      day < 1 ||
      day > 31 ||
      year < 1900 ||
      year > 2100
    ) {
      return false
    }

    // Проверка количества дней в месяце
    const daysInMonth = new Date(year, month, 0).getDate()
    if (day > daysInMonth) {
      return false
    }

    return true
  }

  // Обновляем currentEndDate при изменении inputValue, если дата валидна
  useEffect(() => {
    if (isValidDate(inputValue)) {
      setCurrentEndDate(inputValue)
    }
  }, [inputValue])

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
    if (isEditable) {
      setIsCalendarOpen(!isCalendarOpen)
    }
  }

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const maskedValue = applyDateMask(e.target.value)
    setInputValue(maskedValue)
  }

  const handleDateSelect = (date: string) => {
    setInputValue(date)
    setCurrentEndDate(date)
    setIsCalendarOpen(false)
  }

  const handleInputBlur = () => {
    // Если дата невалидна, возвращаем последнюю валидную дату
    if (!isValidDate(inputValue)) {
      setInputValue(currentEndDate)
    }
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

        {isEditable ? (
          <div className="pass-end-date-container">
            <div className="pass-end-date" onClick={toggleCalendar}>
              <input
                type="text"
                className="date-input"
                value={inputValue}
                onChange={handleDateChange}
                onBlur={handleInputBlur}
                onClick={(e) => e.stopPropagation()}
                placeholder="ДД.ММ.ГГГГ"
                maxLength={10}
              />
              <Calendar className="calendar-icon" size={18} />
            </div>

            <DatePicker
              selectedDate={currentEndDate}
              onChange={handleDateSelect}
              isOpen={isCalendarOpen}
              onClose={() => setIsCalendarOpen(false)}
            />
          </div>
        ) : (
          <div className="pass-end-date-static">{currentEndDate}</div>
        )}

        <button className="pass-file-button">
          <File size={20} />
          {selectedFiles.length > 0 && (
            <div className="file-list">
              {selectedFiles.map((file, index) => (
                <div key={index} className="file-item" onClick={() => handleDownloadFile(file)}>
                  {file.name}
                </div>
              ))}
            </div>
          )}
        </button>
        <div className="menu-container">
          <button className="pass-menu-button" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <Menu size={20} />
          </button>
          <DropdownMenu isOpen={isMenuOpen}
            onClose={() => setIsMenuOpen(false)}
            userRole={userRole}
            onFilesSelected={handleFilesSelected} />
        </div>
      </div>
    </div>
  )
}