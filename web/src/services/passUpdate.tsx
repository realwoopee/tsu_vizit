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
      const token = localStorage.getItem("token");
  
      if (!token) {
        throw new Error("Отсутствует токен авторизации");
      }
  
      const response = await axios.put(
        `${baseUrl}absence/${id}/status`,
        {
          status: status
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      return response.data;
    } catch (error) {
      console.error(`Ошибка при ${status === "Approved" ? "подтверждении" : "отклонении"} пропуска:`, error);
      throw error;
    }
  };
  

export const getPassAttachments = async (id: string): Promise<Attachment[]> => {
  try {
    const token = localStorage.getItem("token")

    if (!token) {
      throw new Error("Отсутствует токен авторизации")
    }

    const response = await axios.get(`${baseUrl}absence/${id}/attachments`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })

    return response.data
  } catch (error) {
    console.error("Ошибка при получении списка вложений:", error)
    throw error
  }
}

export const downloadAttachment = async (id: string, attachmentId: string): Promise<Blob> => {
  try {
    const token = localStorage.getItem("token")

    if (!token) {
      throw new Error("Отсутствует токен авторизации")
    }

    const response = await axios.get(`${baseUrl}absence/${id}/attachments/${attachmentId}`, {
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