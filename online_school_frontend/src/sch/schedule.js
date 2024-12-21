const apiUrl = "http://localhost:8086/schedule";

export { fetchSchedule, renderTable, filterSch, resetFilters, sortScheduleByDate, sortScheduleByStartTime,
    sortScheduleByCourse, showAddForm, saveSchedule, closeModal, openEditModal, saveEditedSchedule, closeEditModal,
    deleteSchedule
};

window.fetchSchedule = fetchSchedule;
window.filterSch = filterSch;
window.resetFilters = resetFilters;
window.sortScheduleByDate = sortScheduleByDate;
window.sortScheduleByStartTime = sortScheduleByStartTime;
window.sortScheduleByCourse = sortScheduleByCourse;
window.showAddForm = showAddForm;
window.saveSchedule = saveSchedule;
window.closeModal = closeModal;
window.openEditModal = openEditModal;
window.saveEditedSchedule = saveEditedSchedule;
window.closeEditModal = closeEditModal;
window.deleteSchedule = deleteSchedule;

let scheduleData = [];

// Получаем заголовки для авторизации
function getAuthHeaders() {
    const token = localStorage.getItem("token");
    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
    };
}

// Загрузка данных расписания
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

// Обновить количество записей
function updateRowCount(count) {
    document.getElementById("row-count").textContent = count;
}

// Фильтрация данных
function filterSch() {
    const keyword = document.getElementById("keyword").value.toLowerCase();
    const date = document.getElementById("filter-date").value;
    const course = document.getElementById("filter-course").value;

    const filteredData = scheduleData.filter(item => {
        return (
            (!keyword || item.course_id.course_name.toLowerCase().includes(keyword) ||
                item.end_time.toLowerCase().includes(keyword) ||
                item.start_time.toLowerCase().includes(keyword) ||
                item.room.toLowerCase().includes(keyword)) &&
            (!date || item.date === date) &&
            (!course || item.course_id.course_name === course)
        );
    });
    renderTable(filteredData);
}

// Сброс фильтров
function resetFilters() {
    document.getElementById("keyword").value = "";
    document.getElementById("filter-date").value = "";
    document.getElementById("filter-course").value = "";
    renderTable(scheduleData);
}

// Сортировка по дате
function sortScheduleByDate() {
    const sorted = [...scheduleData].sort((a, b) => new Date(a.date) - new Date(b.date));
    renderTable(sorted);
}

// Сортировка по времени начала
function sortScheduleByStartTime() {
    const sorted = [...scheduleData].sort((a, b) => a.start_time.localeCompare(b.start_time));
    renderTable(sorted);
}

// Сортировка по названию курса
function sortScheduleByCourse() {
    const sorted = [...scheduleData].sort((a, b) => a.course_id.course_name.localeCompare(b.course_id.course_name));
    renderTable(sorted);
}

// Показ формы добавления
function showAddForm() {
    document.getElementById("modal_add").style.display = "block";
    fetchSchedule(); // Запрос списка курсов
}

// Закрыть форму добавления
function closeModal() {
    document.getElementById("modal_add").style.display = "none";
}

// Сохранение нового расписания
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
            closeModal();
            fetchSchedule();
        })
        .catch(error => console.error("Ошибка добавления:", error));
}

// Открыть форму редактирования
function openEditModal(id) {
    const schedule = scheduleData.find(sch => sch.id === id);
    if (!schedule) return;

    document.getElementById("edit-schedule-id").value = schedule.id;
    document.getElementById("edit-course-id").value = schedule.course_id.id;
    document.getElementById("edit-date-sch").value = schedule.date;
    document.getElementById("edit-start_time").value = schedule.start_time;
    document.getElementById("edit-end_time").value = schedule.end_time;
    document.getElementById("edit-room").value = schedule.room;

    document.getElementById("edit-modal").style.display = "block";
}

// Закрыть форму редактирования
function closeEditModal() {
    document.getElementById("edit-modal").style.display = "none";
}

// Сохранить изменения расписания
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
            closeEditModal();
            fetchSchedule();
        })
        .catch(error => console.error("Ошибка обновления расписания:", error));
}

// Удалить расписание
function deleteSchedule(id) {
    if (!confirm("Удалить запись?")) return;

    fetch(`${apiUrl}/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
    })
        .then(() => {
            alert("Запись удалена!");
            fetchSchedule();
        })
        .catch(error => console.error("Ошибка удаления расписания:", error));
}

// Запрос списка курсов для формы добавления
// function fetchCourses() {
//     // Замените путь на ваш API для получения курсов
//     fetch("http://localhost:8086/courses",
//         { headers: getAuthHeaders()})
//         .then(response => response.json())
//         .then(courses => {
//             const courseSelect = document.getElementById("course-id");
//             courseSelect.innerHTML = '<option value="">Выберите курс</option>';
//             courses.forEach(course => {
//                 courseSelect.innerHTML += `<option value="${course.id}">${course.course_name}</option>`;
//             });
//         });
// }

// Инициализация
document.addEventListener("DOMContentLoaded", () => {
    fetchSchedule();
});
