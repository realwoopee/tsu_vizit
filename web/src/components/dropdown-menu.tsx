"use client"

import React, { useEffect, useRef } from "react"
import { Check, FileUp, Trash2, X } from "lucide-react"
import { Dropdown } from "react-bootstrap"

type UserRole = "student" | "teacher" | "admin"

interface DropdownMenuProps {
  isOpen: boolean
  onClose: () => void
  userRole: UserRole
  toggleRef?: React.RefObject<HTMLButtonElement>
}

export const DropdownMenu = ({ isOpen, onClose, userRole, toggleRef }: DropdownMenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
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
            <Dropdown.Item onClick={() => handleAction("attach")}>
              <span>Прикрепить файл</span>
              <FileUp size={16} className="icon-right" />
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleAction("delete-file")} className="delete">
              <span>Удалить файл</span>
              <Trash2 size={16} className="icon-right" />
            </Dropdown.Item>
          </>
        )
      case "teacher":
        return (
          <>
            <Dropdown.Item onClick={() => handleAction("confirm")}>
              <span>Подтвердить</span>
              <Check size={16} className="icon-right" />
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleAction("reject")}>
              <span>Отклонить</span>
              <X size={16} className="icon-right" />
            </Dropdown.Item>
          </>
        )
      case "admin":
        return (
          <>
            <Dropdown.Item onClick={() => handleAction("confirm")}>
              <span>Подтвердить</span>
              <Check size={16} className="icon-right" />
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleAction("reject")}>
              <span>Отклонить</span>
              <X size={16} className="icon-right" />
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleAction("delete-record")} className="delete">
              <span>Удалить запись</span>
              <Trash2 size={16} className="icon-right" />
            </Dropdown.Item>
          </>
        )
      default:
        return null
    }
  }

  return (
    <Dropdown.Menu show={isOpen} ref={menuRef} className="dropdown-menu">
      {renderMenuItems()}
    </Dropdown.Menu>
  )
}