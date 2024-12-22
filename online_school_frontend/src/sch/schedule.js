const apiUrl = "http://localhost:8086/schedule";

import {getAuthHeaders, updateRowCount, closeModal, deleteRecord} from "../app_funcs.js";

export { fetchSchedule, renderTable, resetFilters, showAddForm, saveSchedule, openEditModal,
    saveEditedSchedule, deleteSchedule, filterAndSortSch
};

window.fetchSchedule = fetchSchedule;
window.filterAndSortSch = filterAndSortSch;
window.resetFilters = resetFilters;
window.showAddForm = showAddForm;
window.saveSchedule = saveSchedule;
window.openEditModal = openEditModal;
window.saveEditedSchedule = saveEditedSchedule;
window.deleteSchedule = deleteSchedule;

let scheduleData = [];

function fetchSchedule() {
    fetch(apiUrl + "/", { headers: getAuthHeaders() })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Ошибка запроса: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            scheduleData = data;
            renderTable(scheduleData);
        })
        .catch(error => {
            console.error("Ошибка загрузки расписания:", error);
            alert("Ошибка загрузки данных. Проверьте авторизацию.");
            window.location.href = "/auth/login";
        });
}

function formatTime(timeString) {
    return timeString ? timeString.substring(0, 5) : "";
}

function renderTable(data) {
    const tableBody = document.querySelector("#schedule-table tbody");
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
                <td>${item.course_id.course_name}</td>
                <td>${item.date}</td>
                <td>${formatTime(item.start_time)}</td>
                <td>${formatTime(item.end_time)}</td>
                <td>${item.room}</td>
                <td>
                    <a href="#" onclick="openEditModal(${item.id})">Редактировать</a>
                    <a href="#" onclick="deleteSchedule(${item.id})">Удалить</a>
                </td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
    updateRowCount(data.length);
}

function filterAndSortSch(sortBy = null) {
    const keyword = document.getElementById("keyword").value.toLowerCase();
    const date = document.getElementById("filter-date").value;
    const course = parseInt(document.getElementById("filter-course").value, 10);

    let filteredData = scheduleData;

    filteredData = filteredData.filter(item => {
        return (
            (!keyword || item.course_id.course_name.toLowerCase().includes(keyword) ||
                item.end_time.toLowerCase().includes(keyword) ||
                item.start_time.toLowerCase().includes(keyword) ||
                item.room.toLowerCase().includes(keyword)) &&
            (!date || item.date === date) &&
            (!course || item.course_id.id === course)
        );
    });

    if (sortBy) {
        switch (sortBy) {
            case "date":
                filteredData.sort((a, b) => new Date(a.date) - new Date(b.date));
                break;
            case "startTime":
                filteredData.sort((a, b) => a.start_time.localeCompare(b.start_time));
                break;
            case "course":
                filteredData.sort((a, b) => a.course_id.course_name.localeCompare(b.course_id.course_name));
                break;
            default:
                break;
        }
    }

    renderTable(filteredData);
}


function resetFilters() {
    document.getElementById("keyword").value = "";
    document.getElementById("filter-date").value = "";
    document.getElementById("filter-course").value = "";
    renderTable(scheduleData);
}

function showAddForm() {
    document.getElementById("schedule-id").value = "";
    document.getElementById("date-sch").value = "";
    document.getElementById("start_time").value = "";
    document.getElementById("end_time").value = "";
    document.getElementById("room").value = "";

    loadCourse("course-id");

    document.getElementById("modal_add").style.display = "block";
    fetchSchedule();
}

function saveSchedule() {
    const newSchedule = {
        course_id: { id: document.getElementById("course-id").value },
        date: document.getElementById("date-sch").value,
        start_time: document.getElementById("start_time").value,
        end_time: document.getElementById("end_time").value,
        room: document.getElementById("room").value,
    };

    fetch(apiUrl + "/new", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(newSchedule),
    })
        .then(response => response.json())
        .then(() => {
            alert("Расписание добавлено!");
            closeModal("modal_add");
            fetchSchedule();
        })
        .catch(error => console.error("Ошибка добавления:", error));
}

function openEditModal(id) {
    const schedule = scheduleData.find(sch => sch.id === id);
    if (!schedule) return;

    document.getElementById("edit-schedule-id").value = schedule.id;
    loadCourse("edit-course-id", schedule.course_id.id);
    document.getElementById("edit-date-sch").value = schedule.date;
    document.getElementById("edit-start_time").value = schedule.start_time;
    document.getElementById("edit-end_time").value = schedule.end_time;
    document.getElementById("edit-room").value = schedule.room;

    document.getElementById("edit-modal").style.display = "block";
}

function saveEditedSchedule() {
    const id = document.getElementById("edit-schedule-id").value;

    const updatedSchedule = {
        course_id: { id: document.getElementById("edit-course-id").value },
        date: document.getElementById("edit-date-sch").value,
        start_time: document.getElementById("edit-start_time").value,
        end_time: document.getElementById("edit-end_time").value,
        room: document.getElementById("edit-room").value,
    };

    fetch(`${apiUrl}/edit/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(updatedSchedule),
    })
        .then(() => {
            alert("Расписание обновлено!");
            closeModal("edit-modal");
            fetchSchedule();
        })
        .catch(error => console.error("Ошибка обновления расписания:", error));
}


function deleteSchedule(id) {
    deleteRecord(id, apiUrl, fetchSchedule);
}

document.addEventListener("DOMContentLoaded", () => {
    loadCourse("filter-course");
});

document.addEventListener("DOMContentLoaded", () => {
    fetchSchedule();
});
