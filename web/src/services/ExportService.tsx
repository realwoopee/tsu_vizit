import axios from "axios"

interface ExportOptions {
  fileName?: string
  includeTimestamp?: boolean
  dateFormat?: string
  filters?: Record<string, string | number | boolean | null>
}

interface ExportableData {
  [key: string]: any
}

export class ExportService {
  private static baseUrl = "https://vizit.90.188.95.63.sslip.io/api/"

  public static async exportToCSV(endpoint: string, options: ExportOptions = {}): Promise<void> {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("Authentication token not found. Please log in again.")
      }

      let queryParams = ""
      if (options.filters && Object.keys(options.filters).length > 0) {
        const params = new URLSearchParams()

        Object.entries(options.filters).forEach(([key, value]) => {
          if (value !== null && value !== undefined && value !== "") {
            params.append(key, String(value))
          }
        })

        const paramsString = params.toString()
        if (paramsString) {
          queryParams = `?${paramsString}`
        }
      }

      const response = await axios.get(`${this.baseUrl}${endpoint}${queryParams}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      let data: ExportableData[] = []
      data = response.data.absenceRequests

      const csvContent = this.convertToCSV(data)

      const fileName = this.generateFileName(options)

      this.downloadCSV(csvContent, fileName)
    } catch (error) {
      console.error("Error exporting data:", error)
      if (error instanceof Error) {
        alert(`Export failed: ${error.message}`)
      } else {
        alert("Export failed. Please try again later.")
      }
    }
  }

  private static convertToCSV(data: ExportableData[]): string {
    if (data.length === 0) {
      return ""
    }

    let csv = "\ufeff"

    const headers = Array.from(new Set(data.flatMap((item) => Object.keys(item))))

    csv += headers.join(",") + "\n"

    data.forEach((item) => {
      const row = headers
        .map((header) => {
          const value = item[header]
          if (value === null || value === undefined) {
            return ""
          } else if (typeof value === "string") {
            return `"${value.replace(/"/g, '""')}"`
          } else if (typeof value === "object") {
            return `"${JSON.stringify(value).replace(/"/g, '""')}"`
          }
          return value
        })
        .join(",")
      csv += row + "\n"
    })

    return csv
  }

  //Генерация имени файла по дате
  private static generateFileName(options: ExportOptions): string {
    const baseName = options.fileName || "export"

    if (options.includeTimestamp !== false) {
      const now = new Date()
      const timestamp = this.formatDate(now, options.dateFormat)
      return `${baseName}_${timestamp}.csv`
    }

    return `${baseName}.csv`
  }

  //Форматирование даты для генерации имени файла
  private static formatDate(date: Date, format?: string): string {
    if (format) {
      return format
        .replace("YYYY", date.getFullYear().toString())
        .replace("MM", (date.getMonth() + 1).toString().padStart(2, "0"))
        .replace("DD", date.getDate().toString().padStart(2, "0"))
        .replace("HH", date.getHours().toString().padStart(2, "0"))
        .replace("mm", date.getMinutes().toString().padStart(2, "0"))
        .replace("ss", date.getSeconds().toString().padStart(2, "0"))
    }

    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}_${date.getHours().toString().padStart(2, "0")}-${date.getMinutes().toString().padStart(2, "0")}-${date.getSeconds().toString().padStart(2, "0")}`
  }

  private static downloadCSV(csvContent: string, fileName: string): void {
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" })

    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", fileName)
    link.style.visibility = "hidden"

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    setTimeout(() => {
      URL.revokeObjectURL(url)
    }, 100)
  }

  public static exportAbsenceRecords(
    filters?: Record<string, string | number | boolean | null>,
    options: ExportOptions = {},
  ): Promise<void> {
    // Объект для сохранения фильтров
    const exportFilters: Record<string, string | number | boolean | null> = {
      CreatedById: null,
      FinalisedById: null,
      CreatedBy: null,
      FinalStatus: null,
      Reason: null,
      Sorting: null,
      "Pagination.Offset": null,
      "Pagination.Limit": null,
    }
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== "") {
          exportFilters[key] = value
        }
      })
    }

    return this.exportToCSV("absence", {
      fileName: "absence_records",
      includeTimestamp: true,
      filters: exportFilters,
      ...options,
    })
  }
}

