const apiUrl = "http://localhost:8086/attendance";

export { fetchAttendance, renderTable, resetFilters, filterAttendance, deleteAttendance,
    getAuthHeaders, sortAttendanceByDate, sortAttendanceByStudent, sortAttendanceByCourse };
window.filterAttendance = filterAttendance;
window.resetFilters = resetFilters;
window.fetchAttendance = fetchAttendance;
window.renderTable = renderTable;
window.deleteAttendance = deleteAttendance;
window.getAuthHeaders = getAuthHeaders;
window.sortAttendanceByCourse = sortAttendanceByCourse;
window.sortAttendanceByStudent = sortAttendanceByStudent;
window.sortAttendanceByDate = sortAttendanceByDate;

function getAuthHeaders() {
    const token = localStorage.getItem("token");
    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
    };
}

let attendanceData = [];

function fetchAttendance() {
    fetch(apiUrl, {
        method: "GET",
        headers: getAuthHeaders(),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Ошибка запроса: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            attendanceData = data;
            renderTable(attendanceData)
        })
        .catch(error => {
            console.error("Error fetching attendance data:", error);
            alert("Ошибка загрузки данных. Пожалуйста, проверьте авторизацию.");
            // редирект
        });
}

function sortAttendanceByDate() {
    attendanceData.sort((a, b) => new Date(a.schedule.date) - new Date(b.schedule.date));
    renderTable(attendanceData);
}

function sortAttendanceByStudent() {
    attendanceData.sort((a, b) => a.student.full_name.localeCompare(b.student.full_name));
    renderTable(attendanceData);
}

function sortAttendanceByCourse() {
    attendanceData.sort((a, b) => a.schedule.course_id.course_name.localeCompare(b.schedule.course_id.course_name));
    renderTable(attendanceData);
}

function renderTable(data) {
    const tableBody = document.querySelector("#attendance-table tbody");
    tableBody.innerHTML = "";

    if (data.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="6">Нет доступных данных</td></tr>`;
        updateRowCount(0);
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
    updateRowCount(data.length);
}

function updateRowCount(count) {
    document.getElementById("row-count").textContent = count;
}

function resetFilters() {
    document.getElementById("keyword").value = "";
    document.getElementById("filter-date").value = "";
    document.getElementById("filter-status").value = "";
    fetchAttendance();
}

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
        .catch(error => console.error("Ошибка фильтров:", error));
}

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
        .catch(error => console.error("Ошибка удаления:", error));
}

document.addEventListener("DOMContentLoaded", () => {
    fetchAttendance();
});
