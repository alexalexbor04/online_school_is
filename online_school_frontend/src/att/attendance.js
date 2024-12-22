import {getAuthHeaders, updateRowCount, deleteRecord, loadStudents, loadSchedules, closeModal} from "../app_funcs.js";

const apiUrl = "http://localhost:8086/attendance";

export { fetchAttendance, renderTable, resetFilters, filterAttendance, deleteAttendance,
    sortAttendanceByDate, sortAttendanceByStudent, sortAttendanceByCourse, showAddForm, saveAttendance,
    saveEditedAttendance, openEditModal};

window.filterAttendance = filterAttendance;
window.resetFilters = resetFilters;
window.fetchAttendance = fetchAttendance;
window.renderTable = renderTable;
window.deleteAttendance = deleteAttendance;
window.sortAttendanceByCourse = sortAttendanceByCourse;
window.sortAttendanceByStudent = sortAttendanceByStudent;
window.sortAttendanceByDate = sortAttendanceByDate;
window.showAddForm = showAddForm;
window.saveAttendance = saveAttendance;
window.saveEditedAttendance = saveEditedAttendance;
window.openEditModal = openEditModal;

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
            window.location.href = "/auth/login";
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
                        item.schedule.course_id.course_name.toLowerCase().includes(keyword) ||
                        item.id.toLowerCase().includes(keyword)
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

function showAddForm() {
    document.getElementById("modal-title").textContent = "Добавить посещение";
    document.getElementById("attendance-id").value = ""; // Очистка поля ID
    document.getElementById("student-id").value = "";
    document.getElementById("schedule-id").value = "";
    document.getElementById("status").value = "Присутствовал";

    loadStudents("student-id");

    loadSchedules("schedule-id");

    document.getElementById("modal_add").style.display = "block";
}

function saveAttendance() {
    const studentId = document.getElementById("student-id").value;
    const scheduleId = document.getElementById("schedule-id").value;
    const status = document.getElementById("status").value;

    const attendance = {
        student: { id: parseInt(studentId) },
        schedule: { id: parseInt(scheduleId) },
        status: status // Статус
    };

    const url = `${apiUrl}/new`;
    fetch(url, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(attendance),
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => { throw new Error(err.message || "Ошибка сохранения"); });
            }
            fetchAttendance();
            closeModal("modal_add");
        })
        .catch(error => console.error("Ошибка сохранения посещения:", error));
}

function openEditModal(id) {
    const url = `${apiUrl}/edit/${id}`;

    fetch(url, {
        method: "GET",
        headers: getAuthHeaders(),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Ошибка получения данных для редактирования");
            }
            return response.json();
        })
        .then(data => {
            document.getElementById("edit-attendance-id").value = data.id || "";
            loadStudents("edit-student-id", data.student?.id);
            loadSchedules("edit-schedule-id", data.schedule?.id);
            document.getElementById("edit-status").value = data.status || "Присутствовал";
            document.getElementById("edit-modal").style.display = "block";
        })
        .catch(error => console.error("Error fetching attendance for edit:", error));
}

function saveEditedAttendance() {
    const id = document.getElementById("edit-attendance-id").value;
    const studentId = document.getElementById("edit-student-id").value;
    const scheduleId = document.getElementById("edit-schedule-id").value;
    const status = document.getElementById("edit-status").value;

    const updatedAttendance = {
        student: { id: parseInt(studentId) },
        schedule: { id: parseInt(scheduleId) },
        status: status
    };

    const url = `${apiUrl}/edit/${id}`;

    fetch(url, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(updatedAttendance)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Ошибка сохранения изменений");
            }
            fetchAttendance();
            closeModal("edit-modal");
        })
        .catch(error => console.error("Error saving edited attendance:", error));
}

function deleteAttendance(id) {
    deleteRecord(id, apiUrl, fetchAttendance);
}

document.addEventListener("DOMContentLoaded", () => {
    fetchAttendance();
});
