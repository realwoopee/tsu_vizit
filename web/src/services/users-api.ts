import type { User, UserRole } from "../components/user-list-item"

const API_BASE_URL = "https://vizit.90.188.95.63.sslip.io/api"
//Заглушка, заменить использованием норамльного токена после слияния со страницей логина
const BEARER_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJ0c3Utdml6aXQiLCJpc3MiOiJ0c3Utdml6aXQiLCJleHAiOjE3NDIzNDA2MTcsIlVzZXJJZCI6IjAxOTU5ZmJkLTJlYTEtN2NhOS1hMjQyLTJkMGZiYmU0NzA4NiIsIlNlc3Npb25JZCI6IjFiODZhOWIwLWFkNWEtNGFhOS04YmY5LTM4MjAxYWJiYjhmNyIsImlhdCI6MTc0MjMzNzAxNywibmJmIjoxNzQyMzM3MDE3fQ.AFBAtNgHX_QJZWu8inyaoXN51p_ifmNiGInJx1R-PFg"

export interface SearchParams {
  studentIdNumber?: string
  fullName?: string
  email?: string
  role?: UserRole
  sorting?: string
  offset?: number
  limit?: number
}

export interface UsersResponse {
  users: User[]
  totalCount: number
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

export const fetchUsers = async (params: SearchParams): Promise<UsersResponse> => {
  try {
    const queryString = buildQueryString(params)
    const url = `${API_BASE_URL}/account/profiles${queryString ? `?${queryString}` : ""}`

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`,
      },
      method: "GET",
    })

    if (!response.ok) {
      throw new Error(`Ошибка API: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

    if (data && Array.isArray(data.users)) {
      return {
        users: data.users.map((user: any) => ({
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          studentIdNumber: user.studentCardId,
          role: user.role,
        })),
        totalCount: data.totalCount || 0,
      }
    }

    return { users: [], totalCount: 0 }
  } catch (error) {
    console.error("Ошибка при получении пользователей:", error)
    throw error
  }
}

export const updateUserRole = async (userId: string | number, newRole: UserRole): Promise<void> => {
  try {
    const id = typeof userId === "number" ? userId.toString() : userId
    const queryParams = new URLSearchParams()
    queryParams.append("userRole", newRole)
    const url = `${API_BASE_URL}/account/${id}/profile/role?${queryParams.toString()}`

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Ошибка API: ${response.status} ${response.statusText}`)
    }
  } catch (error) {
    console.error("Ошибка при обновлении роли пользователя:", error)
    throw error
  }
}

