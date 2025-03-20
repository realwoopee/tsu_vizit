import { PassListItem } from "../components/pass-list-item";
import { NavBar } from "../components/navigation/nav-bar";
import 'bootstrap/dist/css/bootstrap.min.css';
import "../styles/main.css";
import React, { useState, useRef, useEffect } from "react";
import axios from 'axios';
import { fetchAndSavePermissions } from "../components/profileData";


export const MainPage = () => {

   fetchAndSavePermissions();
  const baseUrl = 'https://vizit.90.188.95.63.sslip.io/api/';

  type PassStatus = "На проверке" | "Принято" | "Отклонено";

  interface Pass {
    id: string;
    fullName: string;
    reason: string;
    startDate: string;
    endDate: string;
    status: PassStatus;
  }

  const [passes, setPasses] = useState<Pass[]>([]);
  const [newPass, setNewPass] = useState<Omit<Pass, 'id'>>({
    fullName: "",
    reason: "",
    startDate: "",
    endDate: "",
    status: "На проверке"
  });

  const [error, setError] = useState<string | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [showFiles, setShowFiles] = useState<boolean>(false);
  const fileListRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (fileListRef.current && !fileListRef.current.contains(event.target as Node)) {
        setShowFiles(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      if (selectedFiles.length + files.length > 5) {
        setError("Вы можете загрузить не более 5 файлов.");
      } else {
        setFiles([...files, ...selectedFiles]);
        setError(null);
        setShowFiles(true);
      }
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewPass({ ...newPass, [name]: value });
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>, name: 'startDate' | 'endDate') => {
    console.log(e.target.value)
    setNewPass({ ...newPass, [name]: e.target.value });
  };

  const handleReasonChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setNewPass({ ...newPass, reason: value });
  };

  const handleCreatePass = async () => {
    console.log(newPass.fullName, newPass.reason, newPass.startDate, newPass.endDate, files.length)
    if (newPass.reason && newPass.startDate && newPass.endDate) {
      try {
        const formData = {
          absencePeriodStart: newPass.startDate,
          absencePeriodFinish: newPass.endDate,
          reason: newPass.reason,
        };

        console.log(formData)

        const response = await axios.post(`${baseUrl}absence`, formData, {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json"
          },
        });
        console.log(response.data.id)
        const createdPass = response.data;

        for (const file of files) {
          const fileFormData = new FormData();
          fileFormData.append("file", file);
          await axios.post(`${baseUrl}absence/${createdPass.id}/attach`, fileFormData, {
            headers: {
              "Authorization": `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "multipart/form-data"
            },
          });
        }

        setPasses([...passes, {
          id: createdPass.id,
          fullName: newPass.fullName,
          reason: createdPass.reason,
          startDate: createdPass.absencePeriodStart,
          endDate: createdPass.absencePeriodFinish,
          status: "На проверке"
        }]);

        setNewPass({
          fullName: "",
          reason: "",
          startDate: "",
          endDate: "",
          status: "На проверке"
        });
        setFiles([]);
        setError(null);
        alert("Пропуск успешно создан!");
      } catch (error) {
        console.error("Ошибка при создании пропуска:", error);
        setError("Произошла ошибка при создании пропуска. Пожалуйста, попробуйте снова.");
      }
    } else {
      setError("Пожалуйста, заполните все поля и добавьте файлы.");
    }
  };

  return (
    <>
      <NavBar userRole="admin" />
      <div className="test-container">
        <div className="row">
          <div className="col">
            <div className="pass-form">
              <select
                name="reason"
                value={newPass.reason}
                onChange={handleReasonChange}
                className="form-select"
              >
                <option value="" disabled>Выберите причину</option>
                <option value="Sick">Болезнь</option>
                <option value="Family">Семейные обстоятельства</option>
                <option value="Personal">Учебная деятельность</option>
              </select>
              <input
                type="date"
                name="startDate"
                value={newPass.startDate}
                onChange={(e) => handleDateChange(e, 'startDate',)}
                placeholder="Дата начала"
                className="form-control"
              />
              <input
                type="date"
                name="endDate"
                value={newPass.endDate}
                onChange={(e) => handleDateChange(e, 'endDate')}
                placeholder="Дата окончания"
                className="form-control"
              />
              <input type="file" onChange={handleFileChange} multiple />
              {showFiles && (
                <div className="file-list" ref={fileListRef}>
                  {files.map((file, index) => (
                    <div key={index} className="file-item">
                      <a href={URL.createObjectURL(file)} download={file.name}>{file.name}</a>
                      <button onClick={() => handleRemoveFile(index)}>Удалить</button>
                    </div>
                  ))}
                </div>
              )}
              <button onClick={handleCreatePass}>Создать пропуск</button>
              {error && <div className="error-message">{error}</div>}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default MainPage;
