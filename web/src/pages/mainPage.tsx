import { PassListItem } from "../components/pass-list-item"
import { NavBar } from "../components/navigation/nav-bar"
import 'bootstrap/dist/css/bootstrap.min.css';
import "../styles/main.css"
import React, {useState} from "react";
import axios from 'axios';
import { DatePicker } from "../components/date-picker";
import { Calendar } from "lucide-react";


export const MainPage = () => {

  const baseUrl = 'https://vizit.90.188.95.63.sslip.io/api/'

  type PassStatus = "На проверке" | "Принято" | "Отклонено"

  interface Pass {
    id: number
    fullName: string
    reason: string
    startDate: string
    endDate: string
    status: PassStatus
  }

  const [passes, setPasses] = useState<Pass[]>([])
  const [newPass, setNewPass] = useState<Omit<Pass, 'id'>>({
    fullName: "",
    reason: "",
    startDate: "",
    endDate: "",
    status: "На проверке"
  })

  const [error, setError] = useState<string | null>(null); 

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewPass({ ...newPass, [name]: value })
  }

  const handleCreatePass = async () => {
    if (newPass.fullName && newPass.reason && newPass.startDate && newPass.endDate) {
      try {
        const absenceId = Date.now();
        const formData = new FormData();
        formData.append("fullName", newPass.fullName);
        formData.append("reason", newPass.reason);
        formData.append("startDate", newPass.startDate);
        formData.append("endDate", newPass.endDate);
        formData.append("status", newPass.status);

        const response = await axios.post(`${baseUrl}/absence/${absenceId}/attach`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        const createdPass = response.data;
        setPasses([...passes, { ...createdPass, absenceId}]);

        setNewPass({
          fullName: "",
          reason: "",
          startDate: "",
          endDate: "",
          status: "На проверке"
        });
        setError(null);
        alert("Пропуск успешно создан!");
      } catch (error) {
        console.error("Ошибка при создании пропуска:", error);
        setError("Произошла ошибка при создании пропуска. Пожалуйста, попробуйте снова.");
      }
    } else {
      setError("Пожалуйста, заполните все поля");
    }
  };

    return (
      <>
       <NavBar userRole="admin" />
      <div className="test-container">
        <div className="row">
          <div className="col">
            <div className="pass-form">
              <input
                type="text"
                name="fullName"
                placeholder="ФИО"
                value={newPass.fullName}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="reason"
                placeholder="Причина"
                value={newPass.reason}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="startDate"
                placeholder="Дата начала (ДД.ММ.ГГГГ)"
                value={newPass.startDate}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="endDate"
                placeholder="Дата окончания (ДД.ММ.ГГГГ)"
                value={newPass.endDate}
                onChange={handleInputChange}
              />
              <div className="pass-end-date-container">
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
          </div>

              <button onClick={handleCreatePass}>Создать пропуск</button>
              {error && <div className="error-message">{error}</div>}
            </div>
          </div>
        </div>
        {passes.map((pass, index) => (
          <div className="row mt-3" key={index}>
            <div className="col">
              <PassListItem
                status={pass.status}
                fullName={pass.fullName}
                reason={pass.reason}
                startDate={pass.startDate}
                endDate={pass.endDate}
              />
            </div>
          </div>
        ))}
      </div>
    </>
    )
  }

export default MainPage;