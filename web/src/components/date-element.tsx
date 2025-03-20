"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Calendar } from "lucide-react"
import { DatePicker } from "./date-picker"
import "../styles/pass-list-item.css"
import "../styles/date-element.css"
import "../styles/date-picker.css"

interface PassListItemProps {
  endDate: string
  placeholderVal: string
  onChange: (date: string) => void
}

export const DateElement = ({
  endDate,
  placeholderVal
}: PassListItemProps) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [currentEndDate, setCurrentEndDate] = useState(endDate)
  const [inputValue, setInputValue] = useState(endDate)


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

  const toggleCalendar = () => {
    setIsCalendarOpen(!isCalendarOpen)
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
    <div className="date-element">
          <div className="date-container">
            <div className="date" onClick={toggleCalendar}>
              <input
                type="text"
                className="date-element-input"
                value={inputValue}
                onChange={handleDateChange}
                onBlur={handleInputBlur}
                onClick={(e) => e.stopPropagation()}
                placeholder={placeholderVal}
                maxLength={10}
              />
              <Calendar className="date-calendar-icon" size={18} />
            </div>

            <DatePicker
              selectedDate={currentEndDate}
              onChange={handleDateSelect}
              isOpen={isCalendarOpen}
              onClose={() => setIsCalendarOpen(false)}
            />
          </div>
    </div>
  )
}