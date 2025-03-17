"use client"

import React, { useEffect, useRef, useState } from "react"
import { Check, FileUp, Trash2, X } from "lucide-react"
import { Dropdown } from "react-bootstrap"

type UserRole = "student" | "teacher" | "admin"


interface DropdownMenuProps {
  isOpen: boolean
  onClose: () => void
  userRole: UserRole
  toggleRef?: React.RefObject<HTMLButtonElement>
  onFilesSelected: (files: File[]) => void
}

export const DropdownMenu = ({ isOpen, onClose, userRole, toggleRef, onFilesSelected }: DropdownMenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])

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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Файл выбран")
    const files = event.target.files
    if (files && files.length > 0) {
      const filesArray = Array.from(files).slice(0, 5) 
      console.log("Выбранные файлы:", filesArray)
      setSelectedFiles(filesArray)
      onFilesSelected(filesArray)
    }
  }

  const handleAttachFile = () => {
    console.log("Попытка открыть выбор файла")
    if (fileInputRef.current) {
      console.log("fileInputRef.current найден:", fileInputRef.current) 
    fileInputRef.current.value = "";
    fileInputRef.current.click()
  } else {
    console.log("fileInputRef.current == null")
  }
}

  if (!isOpen) return null

  const handleAction = (action: string) => {
    if (action === "attach") {
      handleAttachFile()
    }else if (action === "delete-file") {
      setSelectedFiles([]) // Очистка списка файлов в локальном состоянии
      onFilesSelected([]) // Обновляем родительский компонент
    } else {
      console.log(`Action: ${action}`)
    }
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
    <>
    <Dropdown.Menu show={isOpen} ref={menuRef} className="dropdown-menu">
      {renderMenuItems()}
    </Dropdown.Menu>
    <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={(e) => {
          console.log("Файл выбран")
          handleFileChange(e)
        }}
         multiple
        accept="*"
      />
    </>
  )
}