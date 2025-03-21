import axios from "axios"
import type { Attachment } from "../components/pass-list-item"

const baseUrl = "https://vizit.90.188.95.63.sslip.io/api/"

export const updatePassEndDate = async (id: string, endDate: string, reason: string): Promise<void> => {
  try {
    const token = localStorage.getItem("token")

    if (!token) {
      throw new Error("Отсутствует токен авторизации")
    }

    await axios.put(
      `${baseUrl}absence/${id}`,
      { absencePeriodFinish: endDate, reason: reason },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    )

    console.log(`Пропуску с ID ${id} успешно обновлена дата окончания на ${endDate}`)
  } catch (error) {
    console.error("Ошибка при обновлении даты окончания пропуска:", error)
    throw error
  }
}

export const updatePassStatus = async (id: string, status: "Approved" | "Declined") => {
  try {
    const token = localStorage.getItem("token")

    if (!token) {
      throw new Error("Отсутствует токен авторизации")
    }

    const response = await axios.put(
      `${baseUrl}absence/${id}/status`,
      {
        status: status,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    )

    return response.data
  } catch (error) {
    console.error(`Ошибка при ${status === "Approved" ? "подтверждении" : "отклонении"} пропуска:`, error)
    throw error
  }
}

// Get pass attachments from the full pass details
export const getPassAttachments = async (id: string): Promise<Attachment[]> => {
  try {
    const token = localStorage.getItem("token")

    if (!token) {
      throw new Error("Отсутствует токен авторизации")
    }

    // Get the full pass details
    const response = await axios.get(`${baseUrl}absence/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })

    // Extract the attachments from the response
    const pass = response.data
    if (!pass.attachments || !Array.isArray(pass.attachments)) {
      return []
    }

    // Return the attachments with their IDs
    return pass.attachments.map((attachment: any, index: number) => ({
      id: attachment.id,
      fileName: `Файл ${index + 1}`, // Default name since we don't have actual filenames
    }))
  } catch (error) {
    console.error("Ошибка при получении списка вложений:", error)
    throw error
  }
}

// Download attachment directly as a blob
export const downloadAttachment = async (attachmentId: string): Promise<Blob> => {
  try {
    const token = localStorage.getItem("token")

    if (!token) {
      throw new Error("Отсутствует токен авторизации")
    }

    // Get the file content directly as a blob
    const response = await axios.get(`${baseUrl}document/${attachmentId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: "blob",
    })

    return response.data
  } catch (error) {
    console.error("Ошибка при скачивании вложения:", error)
    throw error
  }
}

// Upload a file to a pass
export const uploadFile = async (passId: string, file: File): Promise<void> => {
  try {
    const token = localStorage.getItem("token")

    if (!token) {
      throw new Error("Отсутствует токен авторизации")
    }

    const formData = new FormData()
    formData.append("file", file)

    await axios.post(`${baseUrl}absence/${passId}/attach`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    })

    console.log(`Файл ${file.name} успешно прикреплен к пропуску ${passId}`)
  } catch (error) {
    console.error("Ошибка при прикреплении файла:", error)
    throw error
  }
}

// Delete a file from a pass
export const deleteFile = async (passId: string, fileId: string): Promise<void> => {
  try {
    const token = localStorage.getItem("token")

    if (!token) {
      throw new Error("Отсутствует токен авторизации")
    }

    await axios.delete(`${baseUrl}absence/${fileId}/delete`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    console.log(`Файл ${fileId} успешно удален из пропуска ${passId}`)
  } catch (error) {
    console.error("Ошибка при удалении файла:", error)
    throw error
  }
}

