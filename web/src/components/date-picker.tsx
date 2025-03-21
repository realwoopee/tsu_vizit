import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Container, Row, Col, Button } from "react-bootstrap"

interface DatePickerProps {
  selectedDate: string // в формате DD.MM.YYYY
  onChange: (date: string) => void
  isOpen: boolean
  onClose: () => void
}

export const DatePicker = ({ selectedDate, onChange, isOpen, onClose }: DatePickerProps) => {
  const isValidDate = (dateString: string): boolean => {
    if (!/^\d{2}\.\d{2}\.\d{4}$/.test(dateString)) {
      return false
    }

    const [day, month, year] = dateString.split(".").map(Number)
    
    if (
      isNaN(day) || isNaN(month) || isNaN(year) ||
      month < 1 || month > 12 ||
      day < 1 || day > 31 ||
      year < 1900 || year > 2100
    ) {
      return false
    }

    const daysInMonth = new Date(year, month, 0).getDate()
    if (day > daysInMonth) {
      return false
    }

    return true
  }

  const parseDate = (dateString: string): Date => {
    if (isValidDate(dateString)) {
      const [day, month, year] = dateString.split(".").map(Number)
      return new Date(year, month - 1, day)
    }
    return new Date()
  }

  const formatDate = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, "0")
    const month = (date.getMonth() + 1).toString().padStart(2, "0")
    const year = date.getFullYear()
    return `${day}.${month}.${year}`
  }

  const parsedDate = parseDate(selectedDate)
  const [currentMonth, setCurrentMonth] = useState(parsedDate.getMonth())
  const [currentYear, setCurrentYear] = useState(parsedDate.getFullYear())

  useEffect(() => {
    const date = parseDate(selectedDate)
    setCurrentMonth(date.getMonth())
    setCurrentYear(date.getFullYear())
  }, [selectedDate])

  const monthNames = [
    "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
    "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
  ]

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay()
  }

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth)
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth)
    const firstDayAdjusted = firstDay === 0 ? 6 : firstDay - 1
    const days = []
    
    for (let i = 0; i < firstDayAdjusted; i++) {
      days.push(null)
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i)
    }
    
    return days
  }

  const isSelectedDay = (day: number) => {
    if (!isValidDate(selectedDate)) return false
    
    const date = parseDate(selectedDate)
    return (
      date.getDate() === day &&
      date.getMonth() === currentMonth &&
      date.getFullYear() === currentYear
    )
  }

  const handleDayClick = (day: number) => {
    const newDate = new Date(currentYear, currentMonth, day)
    onChange(formatDate(newDate))
    onClose()
  }

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
    <Container fluid className="date-picker-dropdown">
      <Row className="date-picker-header align-items-center">
        <Col>
          <Button variant="link" className="month-nav" onClick={prevMonth}>
            <ChevronLeft size={16} />
          </Button>
        </Col>
        <Col className="current-month text-center">
          {`${monthNames[currentMonth]} ${currentYear}`}
        </Col>
        <Col className="text-end">
          <Button variant="link" className="month-nav" onClick={nextMonth}>
            <ChevronRight size={16} />
          </Button>
        </Col>
      </Row>
      <Row className="date-picker-weekdays">
        <Col>Пн</Col>
        <Col>Вт</Col>
        <Col>Ср</Col>
        <Col>Чт</Col>
        <Col>Пт</Col>
        <Col>Сб</Col>
        <Col>Вс</Col>
      </Row>
      <Row className="date-picker-days">
        {generateCalendarDays().map((day, index) => (
          <Col
            key={index}
            className={`date-day ${day ? "" : "empty"} ${day && isSelectedDay(day) ? "selected" : ""}`}
            onClick={() => day && handleDayClick(day)}
          >
            {day}
          </Col>
        ))}
      </Row>
    </Container>
  )
}