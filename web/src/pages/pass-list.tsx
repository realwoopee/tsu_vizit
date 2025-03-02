import { PassListItem } from "../components/pass-list-item"
import "../styles/pass-list.css"

export const TestPage = () => {
    return (
      <div className="test-container">
        <PassListItem
          status="На проверке"
          fullName="Иванов Иван Иванович"
          reason="Болезнь"
          startDate="01.01.2024"
          endDate="05.01.2024"
        />
        <PassListItem
          status="Отклонено"
          fullName="Иванов Иван Иванович"
          reason="Болезнь"
          startDate="01.01.2024"
          endDate="05.01.2024"
        />
        <PassListItem
          status="Принято"
          fullName="Иванов Иван Иванович"
          reason="Болезнь"
          startDate="01.01.2024"
          endDate="05.01.2024"
        />
      </div>
      
    )
  }

export default TestPage;