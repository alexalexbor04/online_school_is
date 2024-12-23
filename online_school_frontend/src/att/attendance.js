import {getAuthHeaders, updateRowCount, deleteRecord, loadStudents, loadSchedules,
    closeModal, getUserRole, configureAttGradesByRole} from "../app_funcs.js";

const apiUrl = "http://localhost:8086/attendance";

export { fetchAttendance, renderTable, resetFilters,
    deleteAttendance,
    filterAndSortAttendance,
    showAddForm, saveAttendance,
    saveEditedAttendance, openEditModal};

window.resetFilters = resetFilters;
window.fetchAttendance = fetchAttendance;
window.renderTable = renderTable;
window.deleteAttendance = deleteAttendance;
window.showAddForm = showAddForm;
window.saveAttendance = saveAttendance;
window.saveEditedAttendance = saveEditedAttendance;
window.openEditModal = openEditModal;
window.filterAndSortAttendance = filterAndSortAttendance;

let attendanceData = [];

function fetchAttendance() {
    const userRole = getUserRole();
    console.log(userRole);

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
            if (userRole === "student") {
                const userName = JSON.parse(atob(localStorage.getItem("token").split(".")[1])).sub;
                // отладка временно
                console.log(userName)
                attendanceData = data.filter(item => item.student.username === userName);
            } else {
                // отладка временно
                const userName = JSON.parse(atob(localStorage.getItem("token").split(".")[1])).sub;
                // отладка временно
                console.log(userName)
                attendanceData = data;
            }
            renderTable(attendanceData);
            configureAttGradesByRole();
        })
        .catch(error => {
            console.error("Error fetching attendance data:", error);
            alert("Ошибка загрузки данных. Пожалуйста, проверьте авторизацию.");
            window.location.href = "/auth/login";
        });
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
                    <a href="#" class="can-edit" style="display: none;" onclick="openEditModal(${item.id})">Редактировать</a>
                    <a href="#" class="can-delete" style="display: none;"  onclick="deleteAttendance(${item.id})">Удалить</a>
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

function filterAndSortAttendance(sortBy = null) {
    const keyword = document.getElementById("keyword").value.toLowerCase();
    const date = document.getElementById("filter-date").value;
    const status = document.getElementById("filter-status").value;
    const course = parseInt(document.getElementById("filter-course").value, 10);

    const userRole = getUserRole();
    const userName = userRole === "student"
        ? JSON.parse(atob(localStorage.getItem("token").split(".")[1])).sub
        : null;

    fetch(apiUrl, {
        method: "GET",
        headers: getAuthHeaders(),
    })
        .then(response => response.json())
        .then(data => {
            let filteredData = data;

            if (userRole === "student") {
                filteredData = filteredData.filter(item => item.student.username === userName);
            }

            if (keyword) {
                filteredData = filteredData.filter(
                    item =>
                        item.student.full_name.toLowerCase().includes(keyword) ||
                        item.schedule.course_id.course_name.toLowerCase().includes(keyword) ||
                        item.id.toString().includes(keyword)
                );
            }

            if (date) {
                filteredData = filteredData.filter(item => item.schedule.date === date);
            }

            if (status) {
                filteredData = filteredData.filter(item => item.status === status);
            }

            if (course) {
                filteredData = filteredData.filter(item => item.schedule.course_id.id === course);
            }

            if (sortBy) {
                switch (sortBy) {
                    case "date":
                        filteredData.sort((a, b) => new Date(a.schedule.date) - new Date(b.schedule.date));
                        break;
                    case "student":
                        filteredData.sort((a, b) => a.student.full_name.localeCompare(b.student.full_name));
                        break;
                    case "course":
                        filteredData.sort((a, b) => a.schedule.course_id.course_name.localeCompare(b.schedule.course_id.course_name));
                        break;
                    default:
                        break;
                }
            }

            renderTable(filteredData);
        })
        .catch(error => console.error("Ошибка фильтров и сортировки:", error));
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
    const userRole = getUserRole();
    if (userRole !== "teacher") {
        alert("У вас нет прав на добавление посещений.");
        return;
    }

    const studentId = document.getElementById("student-id").value;
    const scheduleId = document.getElementById("schedule-id").value;
    const status = document.getElementById("status").value;

    const attendance = {
        student: { id: parseInt(studentId) },
        schedule: { id: parseInt(scheduleId) },
        status: status
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
            alert("Новая отметка о посещении добавлена!")
            fetchAttendance();
            closeModal("modal_add");
        })
        .catch(error => console.error("Ошибка сохранения посещения:", error));
}

function openEditModal(id) {
    const url = `${apiUrl}/edit/${id}`;

    const userRole = getUserRole();
    if (userRole !== "admin" && userRole !== "teacher") {
        alert("У вас нет прав на редактирование.");
    } else {
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
            alert("Отметка посещаемости обновлена!")
            fetchAttendance();
            closeModal("edit-modal");
        })
        .catch(error => console.error("Error saving edited attendance:", error));
}

function deleteAttendance(id) {
    const userRole = getUserRole();
    if (userRole !== "teacher" && userRole !== "admin") {
        alert("У вас нет прав на удаление посещений.");
        return;
    }
        deleteRecord(id, apiUrl, fetchAttendance);
}

document.addEventListener("DOMContentLoaded", () => {
    configureAttGradesByRole();
    fetchAttendance();
    loadCourse("filter-course");
});

