import axios from 'axios';

export async function fetchAndSavePermissions() {
    const baseUrl = 'https://vizit.90.188.95.63.sslip.io/api/';
    try {
        const response = await axios.get(`${baseUrl}account/permissions`, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json"
            }
        });
        
        const data = response.data;
        
        Object.entries(data).forEach(([key, value]) => {
            localStorage.setItem(key, JSON.stringify(value));
        });

        console.log(localStorage.getItem("canApprove"));

        console.log('Права успешно сохранены в localStorage');
    } catch (error) {
        console.error('Ошибка при получении прав:', error);
    }
}
