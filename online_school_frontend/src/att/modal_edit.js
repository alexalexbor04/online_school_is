import { fetchAttendance } from "./attendance.js";
const apiUrl = "http://localhost:8086/attendance";

export { openEditModal, saveEditedAttendance, closeEditModal };

window.openEditModal = openEditModal;
window.saveEditedAttendance = saveEditedAttendance;
window.closeEditModal = closeEditModal;

// Открыть модальное окно для редактирования
function openEditModal(id) {
    const url = `${apiUrl}/edit/${id}`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error("Ошибка получения данных для редактирования");
            }
            return response.json();
        })
        .then(data => {
            document.getElementById("edit-attendance-id").value = data.id || "";
            document.getElementById("edit-student-id").value = data.student?.id || "";
            document.getElementById("edit-schedule-id").value = data.schedule?.id || "";
            document.getElementById("edit-status").value = data.status || "Присутствовал";
            document.getElementById("edit-modal").style.display = "block";
        })
        .catch(error => console.error("Error fetching attendance for edit:", error));
}

// Сохранить изменения
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedAttendance)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Ошибка сохранения изменений");
            }
            fetchAttendance();
            closeEditModal();
        })
        .catch(error => console.error("Error saving edited attendance:", error));
}

// Закрыть модальное окно
function closeEditModal() {
    document.getElementById("edit-modal").style.display = "none";
}
