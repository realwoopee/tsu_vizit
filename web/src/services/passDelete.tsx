import axios from "axios";

const baseUrl = "https://vizit.90.188.95.63.sslip.io/api/";

export const deletePass = async (id: string) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Отсутствует токен авторизации");
    }

    await axios.delete(`${baseUrl}absence/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    console.log(`Пропуск с ID ${id} успешно удалён`);
  } catch (error) {
    console.error("Ошибка при удалении пропуска:", error);
    throw error;
  }
};
