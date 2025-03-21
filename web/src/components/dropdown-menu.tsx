"use client"

import React, { useEffect, useRef, useState } from "react"
import { Check, FileUp, Trash2, X, Save } from 'lucide-react'
import { Dropdown } from "react-bootstrap"

type UserRole = "student" | "teacher" | "admin"

interface DropdownMenuProps {
  isOpen: boolean
  onClose: () => void
  toggleRef?: React.RefObject<HTMLButtonElement>
  onFilesSelected: (files: File[]) => void
  onSaveDate?: () => void
  onApprove?: () => void
  onReject?: () => void
}

export const DropdownMenu = ({ 
  isOpen, 
  onClose, 
  toggleRef, 
  onFilesSelected,
  onSaveDate,
  onApprove,
  onReject
}: DropdownMenuProps) => {
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
      onClose()
    }
  }

  const handleAttachFile = () => {
    console.log("Попытка открыть выбор файла")
    if (fileInputRef.current) {
      console.log("fileInputRef.current найден:", fileInputRef.current) 
      fileInputRef.current.value = ""
      fileInputRef.current.click()
    } else {
      console.log("fileInputRef.current == null")
    }
  }

  const handleAction = (action: string) => {
    if (action === "attach") {
      handleAttachFile()
    } else if (action === "delete-file") {
      setSelectedFiles([]) // Очистка списка файлов в локальном состоянии
      onFilesSelected([]) // Обновляем родительский компонент
      onClose()
    } else if (action === "save-date") {
      if (onSaveDate) onSaveDate()
      onClose()
    } else if (action === "confirm") {
      if (onApprove) onApprove()
      onClose()
    } else if (action === "reject") {
      if (onReject) onReject()
      onClose()
    } else {
      console.log(`Action: ${action}`)
      onClose()
    }
  }

  return (
    <Dropdown.Menu show={isOpen} ref={menuRef} className="dropdown-menu">
      {localStorage.getItem("canCreate") === "true" && (
        <>
          <Dropdown.Item onClick={() => handleAction("save-date")}>
            <span>Сохранить дату</span>
            <Save size={16} className="icon-right" />
          </Dropdown.Item>
          <Dropdown.Item onClick={() => handleAction("attach")}>
            <span>Прикрепить файл</span>
            <FileUp size={16} className="icon-right" />
          </Dropdown.Item>
        </>
      )}
      {localStorage.getItem("canApprove") === "true" && (
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
      )}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
        multiple
      />
    </Dropdown.Menu>
  )
}