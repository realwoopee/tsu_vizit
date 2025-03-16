import { PassListItem } from "../components/pass-list-item"
import { NavBar } from "../components/navigation/nav-bar"
import 'bootstrap/dist/css/bootstrap.min.css';
import "../styles/pass-list.css"

export const MainPage = () => {
    return (
      <>
      <NavBar userRole="admin" />
      <div className="test-container">
        <div className="row">
          <div className="col">
            <PassListItem
              status="На проверке"
              fullName="Иванов Иван Иванович"
              reason="Болезнь"
              startDate="01.01.2024"
              endDate="05.01.2024"
            /> 
          </div>
        </div>
        <div className="row mt-3">
          <div className="col">
            <PassListItem
              status="Отклонено"
              fullName="Иванов Иван Иванович"
              reason="Болезнь"
              startDate="01.01.2024"
              endDate="05.01.2024"
            />
          </div>
        </div>
        <div className="row mt-3">
          <div className="col">
            <PassListItem
              status="Принято"
              fullName="Иванов Иван Ивановичччччччччччччччччччччччччччччччччччччччччччч"
              reason="Болезнь"
              startDate="01.01.2024"
              endDate="05.01.2024"
            />
          </div>
        </div>
      </div>
    </>
    )
  }

export default MainPage;