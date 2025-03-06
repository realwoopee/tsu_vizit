"use client"

import type React from "react"

import { useEffect, useRef } from "react"
import { Check, FileUp, Trash2, X } from "lucide-react"
import "../styles/dropdown-menu.css"

type UserRole = "student" | "teacher" | "admin"

interface DropdownMenuProps {
  isOpen: boolean
  onClose: () => void
  userRole: UserRole
  toggleRef?: React.RefObject<HTMLButtonElement> // Добавляем ref для кнопки-переключателя
}

export const DropdownMenu = ({ isOpen, onClose, userRole, toggleRef }: DropdownMenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Проверяем, что клик не по меню И не по кнопке-переключателю
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !(toggleRef?.current && toggleRef.current.contains(event.target as Node))
      ) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, onClose, toggleRef])

  if (!isOpen) return null

  const handleAction = (action: string) => {
    console.log(`Action: ${action}`)
    onClose()
  }

  const renderMenuItems = () => {
    switch (userRole) {
      case "student":
        return (
          <>
            <button className="dropdown-item" onClick={() => handleAction("attach")}>
              <span>Прикрепить файл</span>
              <FileUp size={16} className="icon-right" />
            </button>
            <button className="dropdown-item delete" onClick={() => handleAction("delete-file")}>
              <span>Удалить файл</span>
              <Trash2 size={16} className="icon-right" />
            </button>
          </>
        )
      case "teacher":
        return (
          <>
            <button className="dropdown-item" onClick={() => handleAction("confirm")}>
              <span>Подтвердить</span>
              <Check size={16} className="icon-right" />
            </button>
            <button className="dropdown-item" onClick={() => handleAction("reject")}>
              <span>Отклонить</span>
              <X size={16} className="icon-right" />
            </button>
          </>
        )
      case "admin":
        return (
          <>
            <button className="dropdown-item" onClick={() => handleAction("confirm")}>
              <span>Подтвердить</span>
              <Check size={16} className="icon-right" />
            </button>
            <button className="dropdown-item" onClick={() => handleAction("reject")}>
              <span>Отклонить</span>
              <X size={16} className="icon-right" />
            </button>
            <button className="dropdown-item delete" onClick={() => handleAction("delete-record")}>
              <span>Удалить запись</span>
              <Trash2 size={16} className="icon-right" />
            </button>
          </>
        )
      default:
        return null
    }
  }

  return (
    <div className="dropdown-menu" ref={menuRef}>
      {renderMenuItems()}
    </div>
  )
}

