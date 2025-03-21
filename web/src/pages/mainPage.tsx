"use client"

import type { Pass, PassReason } from "../components/pass-list-item"
import { NavBar } from "../components/nav-bar"
import "bootstrap/dist/css/bootstrap.min.css"
import "../styles/main.css"
import { FileDown, ChevronDown, Search, AlertCircle } from "lucide-react"
import type React from "react"
import { useState, useRef, useEffect } from "react"
import axios from "axios"
import { ExportService } from "../services/ExportService"
import { Pagination } from "../components/users-pagination"
import { GettingPasses, type SearchParams } from "../services/gettingPasses"
import { PassList } from "../components/pass-list"
import "../styles/users.css"

// Заменим содержимое функции MainPage, добавив новые фильтры и исправив пагинацию
export const MainPage = () => {
  const [formInputs, setFormInputs] = useState<SearchParams>({
    "Pagination.Offset": 0,
    "Pagination.Limit": 10,
  })

  const [searchParams, setSearchParams] = useState<SearchParams>({
    "Pagination.Offset": 0,
    "Pagination.Limit": 10,
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const [passes, setPasses] = useState<Pass[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [fetchTrigger, setFetchTrigger] = useState(0)
  const [files, setFiles] = useState<File[]>([])
  const [showFiles, setShowFiles] = useState<boolean>(false)
  const fileListRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const getPasses = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const response = await GettingPasses(searchParams)
        setPasses(response.passes)
        const temp = await response.totalCount
        await setTotalCount(temp)
        setTotalPages(Math.ceil(temp / (searchParams["Pagination.Limit"] || 10)))

      } catch (err) {
        if (err instanceof Error && err.message.includes("401")) {
          setError("Ошибка авторизации. У Вас нет доступа к списку пропусков.")
          setPasses([])
        } else {
          setError("Не удалось загрузить список пропусков. Пожалуйста, попробуйте позже.")
        }
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    getPasses()
  }, [fetchTrigger])
console.log(totalCount,totalPages)
  const handleSearch = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault()
    }

    setCurrentPage(1)

    setSearchParams({
      ...formInputs,
      "Pagination.Offset": 0,
    })

    setFetchTrigger((prev) => prev + 1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)

    const offset = (page - 1) * (searchParams["Pagination.Limit"] || 10)

    setSearchParams((prev) => ({
      ...prev,
      "Pagination.Offset": offset,
    }))

    setFetchTrigger((prev) => prev + 1)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleSearch()
    }
  }

  const updateFormInput = (param: keyof SearchParams, value: string | number) => {
    setFormInputs((prev) => ({
      ...prev,
      [param]: value || undefined,
    }))
  }
  const baseUrl = "https://vizit.90.188.95.63.sslip.io/api/"

  const [newPass, setNewPass] = useState<Omit<Pass, "id">>({
    abscencePeriodStart: "",
    abscencePeriodFinish: "",
    timeCreated: "",
    timeFinalised: "",
    createdById: "",
    createdBy: "",
    finalStatus: "Unknown",
    reason: "Family",
    attachments: [],
  })

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (fileListRef.current && !fileListRef.current.contains(event.target as Node)) {
        setShowFiles(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      if (selectedFiles.length + files.length > 5) {
        setError("Вы можете загрузить не более 5 файлов.")
      } else {
        setFiles([...files, ...selectedFiles])
        setError(null)
        setShowFiles(true)
      }
    }
  }

  const handleRemoveFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewPass({ ...newPass, [name]: value })
  }

  const handleDateChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    name: "abscencePeriodStart" | "abscencePeriodFinish",
  ) => {
    console.log(e.target.value)
    setNewPass({ ...newPass, [name]: e.target.value })
  }

  const handleReasonChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target
    const tempValue: PassReason = value as PassReason
    setNewPass({ ...newPass, reason: tempValue })
  }

  const handleCreatePass = async () => {
    console.log(
      newPass.createdBy,
      newPass.reason,
      newPass.abscencePeriodStart,
      newPass.abscencePeriodFinish,
      files.length,
    )
    if (newPass.reason && newPass.abscencePeriodStart && newPass.abscencePeriodFinish) {
      try {
        const formData = {
          absencePeriodStart: newPass.abscencePeriodStart,
          absencePeriodFinish: newPass.abscencePeriodFinish,
          reason: newPass.reason,
        }

        console.log(formData)

        const response = await axios.post(`${baseUrl}absence`, formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        })
        console.log(response.data.id)
        const createdPass = response.data

        for (const file of files) {
          const fileFormData = new FormData()
          fileFormData.append("file", file)
          await axios.post(`${baseUrl}absence/${createdPass.id}/attach`, fileFormData, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "multipart/form-data",
            },
          })
        }

        setPasses([
          ...passes,
          {
            id: createdPass.id,
            abscencePeriodStart: createdPass.absencePeriodStart,
            abscencePeriodFinish: createdPass.absencePeriodFinish,
            timeCreated: createdPass.timeCreated,
            timeFinalised: createdPass.timeFinalisez,
            createdById: createdPass.createdById,
            createdBy: newPass.createdBy,
            finalStatus: "Unknown",
            reason: createdPass.reason,
            attachments: createdPass.attachments,
          },
        ])
        setNewPass({
          abscencePeriodStart: "",
          abscencePeriodFinish: "",
          timeCreated: "",
          timeFinalised: "",
          createdById: "",
          createdBy: "",
          finalStatus: "Unknown",
          reason: "Family",
          attachments: [],
        })
        setFiles([])
        setError(null)
        alert("Пропуск успешно создан!")
        setFetchTrigger((prev) => prev + 1) // Обновляем список пропусков
      } catch (error) {
        console.error("Ошибка при создании пропуска:", error)
        setError("Произошла ошибка при создании пропуска. Пожалуйста, попробуйте снова.")
      }
    } else {
      setError("Пожалуйста, заполните все поля и добавьте файлы.")
    }
  }

  // Функция для экспорта пропусков с учетом текущих фильтров
  const handleExportAbscences = () => {
    // Создаем объект с текущими фильтрами для экспорта
    const exportFilters = {
      CreatedBy: formInputs.CreatedBy,
      FinalStatus: formInputs.FinalStatus,
      Reason: formInputs.Reason,
      "Pagination.Limit": 1000, // Увеличиваем лимит для экспорта
      "Pagination.Offset": 0,
      Sorting: formInputs.Sorting,
    }

    ExportService.exportAbsenceRecords(exportFilters)
  }

  return (
    <>
      <NavBar />
      <div className="test-container">
        <div className="row">
          <div className="col">
            <div className="pass-form">
              <select name="reason" value={newPass.reason} onChange={handleReasonChange} className="form-select">
                <option value="" disabled>
                  Выберите причину
                </option>
                <option value="Sick">Болезнь</option>
                <option value="Family">Семейные обстоятельства</option>
                <option value="Personal">Учебная деятельность</option>
              </select>
              <input
                type="date"
                name="abscencePeriodStart"
                value={newPass.abscencePeriodStart}
                onChange={(e) => handleDateChange(e, "abscencePeriodStart")}
                placeholder="Дата начала"
                className="form-control"
              />
              <input
                type="date"
                name="abscencePeriodFinish"
                value={newPass.abscencePeriodFinish}
                onChange={(e) => handleDateChange(e, "abscencePeriodFinish")}
                placeholder="Дата окончания"
                className="form-control"
              />
              <input type="file" onChange={handleFileChange} multiple />
              {showFiles && (
                <div className="file-list" ref={fileListRef}>
                  {files.map((file, index) => (
                    <div key={index} className="file-item">
                      <a href={URL.createObjectURL(file)} download={file.name}>
                        {file.name}
                      </a>
                      <button onClick={() => handleRemoveFile(index)}>Удалить</button>
                    </div>
                  ))}
                </div>
              )}
              <button onClick={handleCreatePass}>Создать пропуск</button>
              {error && <div className="error-message">{error}</div>}
            </div>
            <button className="pass-export-button" onClick={handleExportAbscences}>
              <span>Экспортировать пропуски</span>
              <FileDown></FileDown>
            </button>
            <div className="passes-container">
              <h1 className="passes-title">Список пропусков</h1>

              <div className="search-section">
                <div className="search-header">
                  <div className="search-main">
                    <input
                      type="text"
                      className="search-input"
                      placeholder="Поиск по ФИО"
                      value={formInputs.CreatedBy || ""}
                      onChange={(e) => updateFormInput("CreatedBy", e.target.value)}
                      onKeyDown={handleKeyDown}
                    />
                    <button className="search-button" onClick={() => handleSearch()}>
                      <Search size={20} />
                    </button>
                  </div>

                  <div className="items-per-page">
                    <label htmlFor="limit">На странице:</label>
                    <input
                      id="limit"
                      type="number"
                      min="1"
                      max="100"
                      className="limit-input"
                      value={formInputs["Pagination.Limit"] || 10}
                      onChange={(e) => updateFormInput("Pagination.Limit", Number.parseInt(e.target.value) || 10)}
                      onKeyDown={handleKeyDown}
                    />
                  </div>

                  <button className="filters-toggle" onClick={() => setShowFilters(!showFilters)}>
                    Фильтры
                    <ChevronDown size={20} className={`chevron ${showFilters ? "rotated" : ""}`} />
                  </button>
                </div>

                {showFilters && (
                  <form className="filters-panel" onSubmit={handleSearch}>
                    <div className="filters-grid">
                      <div className="filter-group">
                        <label>Статус:</label>
                        <select
                          value={formInputs.FinalStatus || ""}
                          onChange={(e) => updateFormInput("FinalStatus", e.target.value)}
                        >
                          <option value="">Все статусы</option>
                          <option value="Unknown">На проверке</option>
                          <option value="Approved">Принято</option>
                          <option value="Denied">Отклонено</option>
                        </select>
                      </div>

                      <div className="filter-group">
                        <label>Причина:</label>
                        <select
                          value={formInputs.Reason || ""}
                          onChange={(e) => updateFormInput("Reason", e.target.value)}
                        >
                          <option value="">Все причины</option>
                          <option value="Sick">Болезнь</option>
                          <option value="Family">Семейные обстоятельства</option>
                          <option value="Personal">Учебная деятельность</option>
                        </select>
                      </div>

                      <div className="filter-group">
                        <label>Сортировка:</label>
                        <select
                          value={formInputs.Sorting || ""}
                          onChange={(e) => updateFormInput("Sorting", e.target.value)}
                        >
                          <option value="">По умолчанию</option>
                          <option value="TimeCreatedAsc">По дате создания (старые)</option>
                          <option value="TimeCreatedDesc">По дате создания (новые)</option>
                          <option value="NameAsc">По имени (А-Я)</option>
                          <option value="NameDesc">По имени (Я-А)</option>
                        </select>
                      </div>
                      <div className="filter-group">
                        <label>ФИО</label>
                        <input
                          value={formInputs.CreatedBy || ""}
                          onChange={(e) => updateFormInput("CreatedBy", e.target.value)}
                          placeholder="Введите ФИО"
                          onKeyDown={handleKeyDown}
                        />
                      </div>
                      <div className="filter-group">
                        <label>Id автора</label>
                        <input
                          value={formInputs.CreatedById || ""}
                          onChange={(e) => updateFormInput("CreatedById", e.target.value)}
                          placeholder="Введите Id автора заявки"
                          onKeyDown={handleKeyDown}
                        />
                      </div>
                        <div className="filter-group">
                          <label>Id проверяющего</label>
                          <input
                            value={formInputs.FinalisedById || ""}
                            onChange={(e) => updateFormInput("FinalisedById", e.target.value)}
                            placeholder="Введите Id проверяющего заявки"
                            onKeyDown={handleKeyDown}
                          />
                        </div>
                    </div>

                    <div className="filters-footer">
                      <button type="submit" className="apply-filters">
                        Применить фильтры
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {error && (
                <div className="error-message">
                  <AlertCircle size={20} />
                  <span>{error}</span>
                </div>
              )}

              {isLoading ? (
                <div className="loading-indicator">Загрузка...</div>
              ) : passes.length > 0 ? (
                <>
                  <PassList passes={passes} />
                  <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
                </>
              ) : (
                <div className="no-results">Пропуски не найдены</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default MainPage

