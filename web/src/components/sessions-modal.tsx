"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X, AlertCircle, Loader2 } from "lucide-react"
import "../styles/confirmation-modal.css"
import ConfirmationModal from "./confirmation-modal"

interface Session {
  id: string
  lastIp: string
  expiresAfter: string
}

interface SessionsModalProps {
  onClose: () => void
}

const SessionsModal = ({ onClose }: SessionsModalProps) => {
  const [sessions, setSessions] = useState<Session[]>([])
  const [currentSessionId, setCurrentSessionId] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Заглушка для Bearer токена
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJ0c3Utdml6aXQiLCJpc3MiOiJ0c3Utdml6aXQiLCJleHAiOjE3NDI0MjUxMTgsIlVzZXJJZCI6IjAxOTU5MTRlLWRkMGYtN2Q5Ny04YjdkLWIzMGU4NzA1NTQyZSIsIlNlc3Npb25JZCI6ImE3NTJmYzNhLTMyY2UtNDhkYi1iNTAyLTEyZjAyNjEwNzc0YyIsImlhdCI6MTc0MjQyMTUxOCwibmJmIjoxNzQyNDIxNTE4fQ.GAvG25PkIrwlBNMiEUBbRKJGdAfM3hoCgXzhXKvpUOI"

  const fetchSessions = async () => {
    try {
      const response = await fetch("https://vizit.90.188.95.63.sslip.io/api/session", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Не удалось загрузить список сессий")
      }

      const data = await response.json()
      setSessions(data)
    } catch (error) {
      console.error("Ошибка при загрузке сессий:", error)
      setError("Не удалось загрузить список сессий")
    }
  }

  const fetchCurrentSession = async () => {
    try {
      const response = await fetch("https://vizit.90.188.95.63.sslip.io/api/session/current", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Не удалось получить текущую сессию")
      }

      const data = await response.json()
      setCurrentSessionId(data.id)
    } catch (error) {
      console.error("Ошибка при получении текущей сессии:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      await Promise.all([fetchSessions(), fetchCurrentSession()])
    }

    loadData()
  }, [])

  const deleteSession = async () => {
    if (!sessionToDelete) return

    setIsDeleting(true)
    try {
      const response = await fetch(`https://vizit.90.188.95.63.sslip.io/api/session/${sessionToDelete}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Не удалось удалить сессию")
      }

      setSessions(sessions.filter((session) => session.id !== sessionToDelete))
      setSessionToDelete(null)
    } catch (error) {
      console.error("Ошибка при удалении сессии:", error)
      setError("Не удалось удалить сессию")
    } finally {
      setIsDeleting(false)
    }
  }

  const handleDeleteRequest = (sessionId: string) => {
    setSessionToDelete(sessionId)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handleModalClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).classList.contains("modal-overlay")) {
      if (!sessionToDelete) {
        onClose()
      }
    }
  }

  return (
    <div className="modal-overlay" onClick={handleModalClick}>
      <div className="modal-content sessions-modal">
        <div className="modal-header">
          <h2>Активные сессии</h2>
          <button className="close-button" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {loading ? (
            <div className="loading-container">
              <Loader2 className="loading-spinner" size={36} />
              <p>Загрузка данных...</p>
            </div>
          ) : error ? (
            <div className="error-message">
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          ) : sessions.length === 0 ? (
            <p className="no-sessions">Нет активных сессий</p>
          ) : (
            <ul className="sessions-list">
              {sessions.map((session) => (
                <li
                  key={session.id}
                  className={`session-item ${session.id === currentSessionId ? "current-session" : ""}`}
                >
                  <div className="session-info">
                    {session.id === currentSessionId && <span className="current-session-badge">Текущая сессия</span>}
                    <div className="session-details">
                      <div>IP: {session.lastIp}</div>
                      <div>Истекает: {formatDate(session.expiresAfter)}</div>
                    </div>
                  </div>
                  <button
                    className="delete-session-button"
                    onClick={() => handleDeleteRequest(session.id)}
                    disabled={session.id === currentSessionId}
                  >
                    <X size={16} />
                    <span>Завершить</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <ConfirmationModal
            isOpen={!!sessionToDelete}
            onClose={() => setSessionToDelete(null)}
            onConfirm={deleteSession}
            title="Подтверждение изменения роли"
            message={"Вы действительно хотите удалить сессию?"}
            confirmText="Удалить"
            cancelText="Отмена"
        />
      </div>
    </div>
  )
}

export default SessionsModal

