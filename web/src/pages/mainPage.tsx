import { PassListItem } from "../components/pass-list-item";
import { NavBar } from "../components/navigation/nav-bar";
import 'bootstrap/dist/css/bootstrap.min.css';
import "../styles/main.css";
import React, { useState, useRef, useEffect } from "react";
import axios from 'axios';
import { DateElement } from "../components/date-element";

export const MainPage = () => {

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

  useEffect(() => {
    const fetchPasses = async () => {
      try {
        const response = await axios.get(`${baseUrl}absence`);
        setPasses(response.data);
      } catch (error) {
        console.error("Ошибка при загрузке пропусков:", error);
        setError("Не удалось загрузить список пропусков.");
      }
    };

    fetchPasses();
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

  const handleDateChange = (name: 'startDate' | 'endDate', value: string) => {
    setNewPass({ ...newPass, [name]: value });
  };

  const handleReasonChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setNewPass({ ...newPass, reason: value });
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
              <select
                name="reason"
                value={newPass.reason}
                onChange={handleReasonChange}
                className="form-select"
              >
                <option value="" disabled>Выберите причину</option>
                <option value="Болезнь">Болезнь</option>
                <option value="Семейные обстоятельства">Семейные обстоятельства</option>
                <option value="Учебная деятельность">Учебная деятельность</option>
              </select>
              <DateElement endDate="" placeholderVal="Дата начала" onChange={(value) => handleDateChange('startDate', value)} />
              <DateElement endDate="" placeholderVal="Дата окончания" onChange={(value) => handleDateChange('endDate', value)}/>
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
              {error && <div className="error-message">{error}</div>}
            </div>
            <div className="pass-list">
              <h3>Список пропусков</h3>
              {passes.map(pass => (
                <PassListItem key={pass.id} pass={pass} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default MainPage;
