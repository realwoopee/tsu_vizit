import { PassListItem } from "../components/pass-list-item"
import "../styles/pass-list.css"

export const TestPage = () => {
    return (
      <div className="test-container">
        <PassListItem
          status="На проверке"
          fullName="Николаев Николай Николаевич"
          reason="Болезнь"
          startDate="01.01.2024"
          endDate="05.01.2024"
          isEditable={false}
        />
        <PassListItem
          status="Отклонено"
          fullName="Иванов Иван Иванович"
          reason="Семейные обстоятельства"
          startDate="01.01.2024"
          endDate="05.01.2024"
          isEditable={true}
          userRole="teacher"
        />
        <PassListItem
          status="Принято"
          fullName="Иванов Иван Ивановичччччччччччччччччччччччччччччччччччччччччччч"
          reason="Учебная деятельность"
          startDate="01.01.2024"
          endDate="05.01.2024"
          isEditable={true}
          userRole="admin"
        />
      </div>
      
    )
  }

export default TestPage;