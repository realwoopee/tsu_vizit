import type { User, UserRole } from "../components/user-list-item"

const API_BASE_URL = "https://vizit.90.188.95.63.sslip.io/api"
//Заглушка, заменить использованием норамльного токена после слияния со страницей логина
const BEARER_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJ0c3Utdml6aXQiLCJpc3MiOiJ0c3Utdml6aXQiLCJleHAiOjE3NDE5Mjg5MjAsIlVzZXJJZCI6IjAxOTU5MTRlLWRkMGYtN2Q5Ny04YjdkLWIzMGU4NzA1NTQyZSIsIlNlc3Npb25JZCI6ImRhY2MyYzY0LTgzMDktNDJiMS05M2FiLWY1NDQzYmI5ODI5MSIsImlhdCI6MTc0MTkyNTMyMCwibmJmIjoxNzQxOTI1MzIwfQ.PP2Tf-FJvu9TKeBqnwxNomDx6B1UAYpgv2F12riJFTE"

export interface SearchParams {
  studentIdNumber?: string
  fullName?: string
  email?: string
  role?: UserRole
  sorting?: string
  offset?: number
  limit?: number
}

const buildQueryString = (params: SearchParams): string => {
  const queryParams = new URLSearchParams()

  if (params.studentIdNumber) {
    queryParams.append("StudentIdNumber", params.studentIdNumber)
  }

  if (params.fullName) {
    queryParams.append("FullName", params.fullName)
  }

  if (params.email) {
    queryParams.append("Email", params.email)
  }

  if (params.role) {
    queryParams.append("Role", params.role)
  }

  if (params.sorting) {
    queryParams.append("Sorting", params.sorting)
  }

  if (params.offset !== undefined) {
    queryParams.append("Pagination.Offset", params.offset.toString())
  }

  if (params.limit !== undefined) {
    queryParams.append("Pagination.Limit", params.limit.toString())
  }

  return queryParams.toString()
}

export const fetchUsers = async (params: SearchParams): Promise<User[]> => {
  try {
    const queryString = buildQueryString(params)
    const url = `${API_BASE_URL}/account/profiles${queryString ? `?${queryString}` : ""}`

    const response = await fetch(url, {
      headers:{
      Authorization: `Bearer ${BEARER_TOKEN}`
      },
      method: "GET"
    })

    if (!response.ok) {
      throw new Error(`Ошибка API: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Ошибка при получении пользователей:", error)
    throw error
  }
}

export const updateUserRole = async (userId: string, newRole: UserRole): Promise<void> => {
  try {
    const url = `${API_BASE_URL}/account/profiles/${userId}/role`

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`
      },
      body: JSON.stringify({ role: newRole }),
    })

    if (!response.ok) {
      throw new Error(`Ошибка API: ${response.status} ${response.statusText}`)
    }
  } catch (error) {
    console.error("Ошибка при обновлении роли пользователя:", error)
    throw error
  }
}

