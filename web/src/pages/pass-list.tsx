import { PassListItem } from "../components/pass-list-item"
import "../styles/pass-list.css"
import { NavBar } from "../components/nav-bar"

export const TestPage = () => {
    return (
      <>
        <NavBar userRole="admin" />
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
            fullName="Иванов Иван Ивановичччччччччччччччччччччччччччччччччччччччччччч"
            reason="Болезнь"
            startDate="01.01.2024"
            endDate="05.01.2024"
          />
        </div>
      </>
    )
  }

export default TestPage;