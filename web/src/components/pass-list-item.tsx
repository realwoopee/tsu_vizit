"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Calendar, File, Menu, Check, X } from 'lucide-react'
import { DatePicker } from "./date-picker"
import { DropdownMenu } from "./dropdown-menu"
import "../styles/pass-list-item.css"
import { deletePass } from "../services/passDelete"
import { updatePassEndDate, updatePassStatus, getPassAttachments, downloadAttachment } from "../services/passUpdate"
import ConfirmationModal from "./confirmation-modal"

export type PassStatus = "Unknown" | "Approved" | "Declined"
export type PassReason = "Personal" | "Family" | "Sick"

export interface Attachment {
  id: string
  fileName: string
  contentType: string
}

export interface Pass{
  id: string
  absencePeriodStart: string
  absencePeriodFinish: string
  timeCreated: string
  timeFinalised: string
  createdById: string
  createdBy: string
  finalStatus: PassStatus
  reason: PassReason
  attachments: Array<string>
}

interface PassListItemProps {
  pass: Pass
  onPassUpdated: () => void
}

export const PassListItem = ({
  pass, onPassUpdated}: PassListItemProps) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [currentEndDate, setCurrentEndDate] = useState(pass.absencePeriodFinish)
  const [inputValue, setInputValue] = useState(pass.absencePeriodFinish)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [isFileListOpen, setIsFileListOpen] = useState(false)
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [confirmAction, setConfirmAction] = useState<{
    title: string;
    message: string;
    action: () => Promise<void>;
  } | null>(null)
  
  const fileButtonRef = useRef<HTMLButtonElement | null>(null);
  const fileListRef = useRef<HTMLDivElement | null>(null);
  
  // Fetch attachments when component mounts or when pass changes
  useEffect(() => {
    const fetchAttachments = async () => {
      try {
        setIsLoading(true);
        const data = await getPassAttachments(pass.id);
        setAttachments(data);
      } catch (error) {
        console.error("Failed to fetch attachments:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAttachments();
  }, [pass.id]);

  const toggleFileList = () => {
    setIsFileListOpen(!isFileListOpen)
  }
  
  const handleFilesSelected = (files: File[]) => {
    console.log("Выбранные файлы:", files)
    setSelectedFiles(files)
  }

  const handleDownloadAttachment = async (attachmentId: string, fileName: string) => {
    try {
      setIsLoading(true);
      const blob = await downloadAttachment(pass.id, attachmentId);
      
      // Create a download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading attachment:", error);
      setError("Не удалось скачать файл");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        fileButtonRef.current &&
        fileListRef.current &&
        !fileButtonRef.current.contains(event.target as Node) &&
        !fileListRef.current.contains(event.target as Node)
      ) {
        setIsFileListOpen(false);
      }
    };
  
    if (isFileListOpen) {
      document.addEventListener("click", handleClickOutside);
    }
  
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isFileListOpen]);

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

  // Convert date from DD.MM.YYYY to YYYY-MM-DD format for API
  const formatDateForApi = (dateString: string): string => {
    if (!isValidDate(dateString)) return "";
    
    const [day, month, year] = dateString.split(".").map(Number);
    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  };

  // Обновляем currentEndDate при изменении inputValue, если дата валидна
  useEffect(() => {
    if (isValidDate(inputValue)) {
      setCurrentEndDate(inputValue)
    }
  }, [inputValue])

  const getStatusClass = (status: PassStatus) => {
    switch (status) {
      case "Unknown":
        return "status-review"
      case "Approved":
        return "status-accepted"
      case "Declined":
        return "status-rejected"
      default:
        return ""
    }
  }
  const getStatusDisplay = (status: PassStatus) => {
    switch (status) {
      case "Unknown":
        return "На проверке"
      case "Approved":
        return "Принято"
      case "Declined":
        return "Отклонено"
      default:
        return ""
    }

  }
  const getReasonDisplay = (reason: PassReason) => {
    switch (reason) {
      case "Family":
        return "Семейные обстоятельства"
      case "Sick":
        return "Болезнь"
      case "Personal":
        return "Учебная"
    }
  }
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

  const handleDeletePass = async (passId: string) => {
    setConfirmAction({
      title: "Подтверждение удаления",
      message: "Вы уверены, что хотите удалить этот пропуск?",
      action: async () => {
        try {
          await deletePass(passId);
          onPassUpdated();
        } catch (error) {
          console.error("Ошибка при удалении пропуска:", error);
          setError("Не удалось удалить пропуск");
        }
      }
    });
    setShowConfirmModal(true);
  };

  const handleSaveDate = async () => {
    if (!isValidDate(inputValue)) {
      setError("Пожалуйста, введите корректную дату");
      return;
    }

    setConfirmAction({
      title: "Подтверждение изменения даты",
      message: "Вы уверены, что хотите изменить дату окончания пропуска?",
      action: async () => {
        try {
          const formattedDate = formatDateForApi(inputValue);
          await updatePassEndDate(pass.id, formattedDate, pass.reason);
          onPassUpdated();
        } catch (error) {
          console.error("Ошибка при сохранении даты:", error);
          setError("Не удалось сохранить дату");
        }
      }
    });
    setShowConfirmModal(true);
  };

  const handleApprovePass = async () => {
    setConfirmAction({
      title: "Подтверждение пропуска",
      message: "Вы уверены, что хотите подтвердить этот пропуск?",
      action: async () => {
        try {
          await updatePassStatus(pass.id, "Approved");
          onPassUpdated();
        } catch (error) {
          console.error("Ошибка при подтверждении пропуска:", error);
          setError("Не удалось подтвердить пропуск");
        }
      }
    });
    setShowConfirmModal(true);
  };

  const handleRejectPass = async () => {
    setConfirmAction({
      title: "Отклонение пропуска",
      message: "Вы уверены, что хотите отклонить этот пропуск?",
      action: async () => {
        try {
          await updatePassStatus(pass.id, "Declined");
          onPassUpdated();
        } catch (error) {
          console.error("Ошибка при отклонении пропуска:", error);
          setError("Не удалось отклонить пропуск");
        }
      }
    });
    setShowConfirmModal(true);
  };

  return (
    <div className="pass-list-item">
      <div className="pass-left-section">
        <div className={`pass-status ${getStatusClass(pass.finalStatus)}`}>{getStatusDisplay(pass.finalStatus)}</div>
        <div className="pass-fullname">{pass.createdBy}</div>
      </div>

      <div className="pass-right-section">
        <div className="pass-reason">{getReasonDisplay(pass.reason)}</div>
        <div className="pass-date">{pass.absencePeriodStart}</div>
        <div className="pass-date-separator">—</div>

        
          {localStorage.getItem("canCreate")==="false" ? (<div className="pass-date">{pass.absencePeriodFinish}</div>) : (<div className="pass-end-date-container">
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
          </div>)}

        <button ref={fileButtonRef} className="pass-file-button" onClick={toggleFileList}>
          <File size={20} />
          {isFileListOpen && attachments.length > 0 && (
            <div ref={fileListRef} className="file-list">
              {isLoading ? (
                <div className="file-item loading">Загрузка...</div>
              ) : (
                attachments.map((attachment) => (
                  <div 
                    key={attachment.id} 
                    className="file-item" 
                    onClick={() => handleDownloadAttachment(attachment.id, attachment.fileName)}
                  >
                    {attachment.fileName}
                  </div>
                ))
              )}
            </div>
          )}
        </button>
        <div className="menu-container">
          <button className="pass-menu-button" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <Menu size={20} />
          </button>
          <DropdownMenu 
            isOpen={isMenuOpen}
            onClose={() => setIsMenuOpen(false)}
            onFilesSelected={handleFilesSelected}
            onSaveDate={handleSaveDate}
            onApprove={handleApprovePass}
            onReject={handleRejectPass}
          />
        </div>
        {localStorage.getItem("canCreate")==="true" ? (<button className="pass-delete-button" onClick={() => handleDeletePass(pass.id)}>
          Удалить
        </button>) : ""}
      </div>

      {showConfirmModal && confirmAction && (
        <ConfirmationModal
          isOpen={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          onConfirm={confirmAction.action}
          title={confirmAction.title}
          message={confirmAction.message}
          confirmText="Подтвердить"
          cancelText="Отмена"
        />
      )}

      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError(null)} className="close-error">×</button>
        </div>
      )}
    </div>
  )
}