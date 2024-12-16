const apiUrl = "http://localhost:8086/attendance";

export { fetchAttendance, renderTable, resetFilters, filterAttendance, deleteAttendance, getAuthHeaders };
window.filterAttendance = filterAttendance;
window.resetFilters = resetFilters;
window.fetchAttendance = fetchAttendance;
window.renderTable = renderTable;
window.deleteAttendance = deleteAttendance;
window.getAuthHeaders = getAuthHeaders;

// Функция получения токена из localStorage
function getAuthHeaders() {
    const token = localStorage.getItem("token");
    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
    };
}

// Получение данных о посещаемости
function fetchAttendance() {
    fetch(apiUrl, {
        method: "GET",
        headers: getAuthHeaders(), // Добавляем заголовки с токеном
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Ошибка запроса: ${response.status}`);
            }
            // if (response.status === 401) {
            //     alert("Сессия завершена. Пожалуйста, авторизуйтесь снова.");
            //     localStorage.removeItem("token"); // Удаляем токен из localStorage
            //     window.location.href = "http://localhost:8086/"; // Редирект на страницу логина
            //     throw new Error("Unauthorized");
            // }
            return response.json();
        })
        .then(data => renderTable(data))
        .catch(error => {
            console.error("Error fetching attendance data:", error);
            alert("Ошибка загрузки данных. Пожалуйста, проверьте авторизацию.");
        });
}

// Отображение данных в таблице
function renderTable(data) {
    const tableBody = document.querySelector("#attendance-table tbody");
    tableBody.innerHTML = "";

    if (data.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="6">No data available</td></tr>`;
        return;
    }

    data.forEach(item => {
        const row = `
            <tr>
                <td>${item.id}</td>
                <td>${item.student.full_name}</td>
                <td>${item.schedule.course_id.course_name}</td>
                <td>${item.schedule.date}</td>
                <td>${item.status}</td>
                <td>
                    <a href="#" onclick="openEditModal(${item.id})">Редактировать</a>
                    <a href="#" onclick="deleteAttendance(${item.id})">Удалить</a>
                </td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

// Сброс фильтров
function resetFilters() {
    document.getElementById("keyword").value = "";
    document.getElementById("filter-date").value = "";
    document.getElementById("filter-status").value = "";
    fetchAttendance();
}

// Фильтрация по ключевому слову, дате и статусу
function filterAttendance() {
    const keyword = document.getElementById("keyword").value.toLowerCase();
    const date = document.getElementById("filter-date").value;
    const status = document.getElementById("filter-status").value;

    fetch(apiUrl, {
        method: "GET",
        headers: getAuthHeaders(),
    })
        .then(response => response.json())
        .then(data => {
            let filteredData = data;

            if (keyword) {
                filteredData = filteredData.filter(
                    item =>
                        item.student.full_name.toLowerCase().includes(keyword) ||
                        item.schedule.course_id.course_name.toLowerCase().includes(keyword)
                );
            }

            if (date) {
                filteredData = filteredData.filter(item => item.schedule.date === date);
            }

            if (status) {
                filteredData = filteredData.filter(item => item.status === status);
            }

            renderTable(filteredData);
        })
        .catch(error => console.error("Error filtering attendance:", error));
}

// Удаление записи
function deleteAttendance(id) {
    const confirmDelete = confirm("Вы уверены, что хотите удалить эту запись?");
    if (!confirmDelete) return;

    const url = `${apiUrl}/${id}`;

    fetch(url, {
        method: "DELETE",
        headers: getAuthHeaders(),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Ошибка удаления записи");
            }
            alert("Запись успешно удалена");
            fetchAttendance(); // Обновить таблицу после удаления
        })
        .catch(error => console.error("Error deleting attendance:", error));
}

// Инициализация
document.addEventListener("DOMContentLoaded", () => {
    fetchAttendance();
});
