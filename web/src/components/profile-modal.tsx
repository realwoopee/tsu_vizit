"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X, Check, AlertCircle, Loader2 } from "lucide-react"
import "../styles/navbar-modal.css"
import "../styles/confirmation-modal.css"
import ConfirmationModal from "./confirmation-modal"

interface UserProfile {
  fullName: string
  email: string
  studentCardId: string
  role: string
}

interface ProfileModalProps {
  onClose: () => void
  onProfileUpdated: () => void
}

const ProfileModal = ({ onClose, onProfileUpdated }: ProfileModalProps) => {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [editedFullName, setEditedFullName] = useState("")
  const [editedEmail, setEditedEmail] = useState("")
  const [isEditing, setIsEditing] = useState(false)

  const [showConfirmModal, setShowConfirmModal] = useState(false)

  const [isSaving, setIsSaving] = useState(false)

  const token = localStorage.getItem("token")
  const fetchProfile = async () => {
    try {
      const response = await fetch("https://vizit.90.188.95.63.sslip.io/api/account/profile", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Не удалось загрузить данные профиля")
      }

      const data = await response.json()
      setProfile(data)
      setEditedFullName(data.fullName)
      setEditedEmail(data.email)
    } catch (error) {
      console.error("Ошибка при загрузке профиля:", error)
      setError("Не удалось загрузить данные профиля")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  const updateProfile = async () => {
    setIsSaving(true)
    try {
      const response = await fetch("https://vizit.90.188.95.63.sslip.io/api/account/profile", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: editedFullName,
          email: editedEmail,
        }),
      })

      if (!response.ok) {
        throw new Error("Не удалось обновить профиль")
      }

      setProfile((prev) => (prev ? { ...prev, fullName: editedFullName, email: editedEmail } : null))

      onProfileUpdated()
    } catch (error) {
      console.error("Ошибка при обновлении профиля:", error)
      setError("Не удалось обновить профиль")
    } finally {
      setShowConfirmModal(false)
      setIsEditing(false)
      setIsSaving(false)
    }
  }

  const handleCancelEdit = () => {
    setEditedFullName(profile?.fullName || "")
    setEditedEmail(profile?.email || "")
    setIsEditing(false)
  }

  const handleConfirmSave = () => {
    setShowConfirmModal(true)
  }

  const handleModalClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).classList.contains("modal-overlay")) {
      if (!showConfirmModal) {
        onClose()
      }
    }
  }

  return (
    <div className="modal-overlay" onClick={handleModalClick}>
      <div className="modal-content profile-modal">
        <div className="modal-header">
          <h2>Профиль пользователя</h2>
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
          ) : (
            <div className="profile-form">
              <div className="form-group">
                <label htmlFor="fullName">ФИО:</label>
                {isEditing ? (
                  <input
                    type="text"
                    id="fullName"
                    value={editedFullName}
                    onChange={(e) => setEditedFullName(e.target.value)}
                  />
                ) : (
                  <div className="profile-value">{profile?.fullName}</div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="email">Email:</label>
                {isEditing ? (
                  <input type="email" id="email" value={editedEmail} onChange={(e) => setEditedEmail(e.target.value)} />
                ) : (
                  <div className="profile-value">{profile?.email}</div>
                )}
              </div>

              <div className="form-group">
                <label>Номер студенческого билета:</label>
                <div className="profile-value">{profile?.studentCardId || "Не указан"}</div>
              </div>

              <div className="form-group">
                <label>Роль:</label>
                <div className="profile-value">{profile?.role}</div>
              </div>
            </div>
          )}
        </div>

        {!loading && !error && (
          <div className="modal-footer">
            {isEditing ? (
              <>
                <button className="cancel-button" onClick={handleCancelEdit}>
                  <X size={16} />
                  <span>Отмена</span>
                </button>
                <button className="save-button" onClick={handleConfirmSave}>
                  <Check size={16} />
                  <span>Сохранить</span>
                </button>
              </>
            ) : (
              <button className="edit-button" onClick={() => setIsEditing(true)}>
                Редактировать
              </button>
            )}
          </div>
        )}

        <ConfirmationModal
          isOpen={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          onConfirm={updateProfile}
          title="Подтверждение изменения роли"
          message={"Вы действительно хотите сохранить данные пользователя?"}
          confirmText="Сохранить"
          cancelText="Отмена"
        />
      </div>
    </div>
  )
}

export default ProfileModal

