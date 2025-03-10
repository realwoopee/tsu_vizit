import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from 'lucide-react'
import "../styles/date-picker.css"

interface DatePickerProps {
  selectedDate: string // в формате DD.MM.YYYY
  onChange: (date: string) => void
  isOpen: boolean
  onClose: () => void
}

export const DatePicker = ({ selectedDate, onChange, isOpen, onClose }: DatePickerProps) => {
  // Проверка валидности даты
  const isValidDate = (dateString: string): boolean => {
    // Проверка формата DD.MM.YYYY
    if (!/^\d{2}\.\d{2}\.\d{4}$/.test(dateString)) {
      return false
    }

    const [day, month, year] = dateString.split(".").map(Number)
    
    // Проверка диапазонов
    if (
      isNaN(day) || isNaN(month) || isNaN(year) ||
      month < 1 || month > 12 ||
      day < 1 || day > 31 ||
      year < 1900 || year > 2100
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

  // Парсим выбранную дату или используем текущую, если дата некорректна
  const parseDate = (dateString: string): Date => {
    if (isValidDate(dateString)) {
      const [day, month, year] = dateString.split(".").map(Number)
      return new Date(year, month - 1, day)
    }
    return new Date() // Возвращаем текущую дату, если входная дата некорректна
  }

  // Форматируем дату в строку DD.MM.YYYY
  const formatDate = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, "0")
    const month = (date.getMonth() + 1).toString().padStart(2, "0")
    const year = date.getFullYear()
    return `${day}.${month}.${year}`
  }

  const parsedDate = parseDate(selectedDate)
  const [currentMonth, setCurrentMonth] = useState(parsedDate.getMonth())
  const [currentYear, setCurrentYear] = useState(parsedDate.getFullYear())

  // Обновляем месяц и год при изменении выбранной даты
  useEffect(() => {
    const date = parseDate(selectedDate)
    setCurrentMonth(date.getMonth())
    setCurrentYear(date.getFullYear())
  }, [selectedDate])

  // Названия месяцев
  const monthNames = [
    "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
    "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
  ]

  // Переход к предыдущему месяцу
  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  // Переход к следующему месяцу
  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  // Получаем дни для текущего месяца
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  // Получаем день недели для первого дня месяца (0 - воскресенье, 1 - понедельник, и т.д.)
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay()
  }

  // Создаем массив дней для отображения в календаре
  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth)
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth)
    
    // Преобразуем день недели в формат, где понедельник - первый день (0)
    const firstDayAdjusted = firstDay === 0 ? 6 : firstDay - 1
    
    const days = []
    
    // Добавляем пустые ячейки для дней предыдущего месяца
    for (let i = 0; i < firstDayAdjusted; i++) {
      days.push(null)
    }
    
    // Добавляем дни текущего месяца
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i)
    }
    
    return days
  }

  // Проверяем, является ли день выбранным
  const isSelectedDay = (day: number) => {
    if (!isValidDate(selectedDate)) return false
    
    const date = parseDate(selectedDate)
    return (
      date.getDate() === day &&
      date.getMonth() === currentMonth &&
      date.getFullYear() === currentYear
    )
  }

  // Обработчик выбора дня
  const handleDayClick = (day: number) => {
    const newDate = new Date(currentYear, currentMonth, day)
    onChange(formatDate(newDate))
    onClose()
  }

  // Обработчик клика вне календаря
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (isOpen && !target.closest(".date-picker-dropdown")) {
        onClose()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="date-picker-dropdown">
      <div className="date-picker-header">
        <button className="month-nav" onClick={prevMonth}>
          <ChevronLeft size={16} />
        </button>
        <div className="current-month">{`${monthNames[currentMonth]} ${currentYear}`}</div>
        <button className="month-nav" onClick={nextMonth}>
          <ChevronRight size={16} />
        </button>
      </div>
      <div className="date-picker-weekdays">
        <div>Пн</div>
        <div>Вт</div>
        <div>Ср</div>
        <div>Чт</div>
        <div>Пт</div>
        <div>Сб</div>
        <div>Вс</div>
      </div>
      <div className="date-picker-days">
        {generateCalendarDays().map((day, index) => (
          <div
            key={index}
            className={`date-day ${day ? "" : "empty"} ${day && isSelectedDay(day) ? "selected" : ""}`}
            onClick={() => day && handleDayClick(day)}
          >
            {day}
          </div>
        ))}
      </div>
    </div>
  )
}
