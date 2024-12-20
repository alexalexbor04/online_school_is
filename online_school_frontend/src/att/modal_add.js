import {fetchAttendance, getAuthHeaders} from "./attendance.js";
const apiUrl = "http://localhost:8086/attendance";

export { showAddForm, saveAttendance, closeModal };

window.showAddForm = showAddForm;
window.saveAttendance = saveAttendance;
window.closeModal = closeModal;

function showAddForm() {
    document.getElementById("modal-title").textContent = "Добавить посещение";
    document.getElementById("attendance-id").value = ""; // Очистка поля ID
    document.getElementById("student-id").value = "";
    document.getElementById("schedule-id").value = "";
    document.getElementById("status").value = "Присутствовал";
    document.getElementById("modal_add").style.display = "block";
}

function saveAttendance() {
    const studentId = document.getElementById("student-id").value;
    const scheduleId = document.getElementById("schedule-id").value;
    const status = document.getElementById("status").value;

    // Подготовка данных для отправки
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
            closeModal();
        })
        .catch(error => console.error("Error saving attendance:", error));
}

function closeModal() {
    document.getElementById("modal_add").style.display = "none";
}