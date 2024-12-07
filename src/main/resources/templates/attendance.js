// Функция для загрузки данных посещаемости
async function loadAttendance(keyword = "") {
    try {
        const response = await fetch(`http://localhost:8086/attendance?keyword=${keyword}`);
        if (!response.ok) {
            throw new Error("Ошибка при загрузке данных");
        }

        const attendanceList = await response.json();
        const container = document.getElementById("attendance-container");

        // Очищаем контейнер
        container.innerHTML = "";

        // Генерируем элементы для каждой записи
        attendanceList.forEach(attendance => {
            const template = document.getElementById("attendance-template").content.cloneNode(true);

            template.querySelector(".student-name").textContent = attendance.studentName || "Не указано";
            template.querySelector(".attendance-date").textContent = attendance.date || "Не указана";
            template.querySelector(".attendance-status").textContent = attendance.status || "Не указан";

            template.querySelector(".edit-btn").setAttribute("onclick", `editAttendance(${attendance.id})`);
            template.querySelector(".delete-btn").setAttribute("onclick", `deleteAttendance(${attendance.id})`);

            container.appendChild(template);
        });
    } catch (error) {
        console.error("Ошибка:", error);
        alert("Не удалось загрузить список посещаемости.");
    }
}

// Функция для поиска
function search() {
    const keyword = document.getElementById("search").value;
    loadAttendance(keyword);
}

// Функция для показа формы добавления
function showAddForm() {
    const form = document.getElementById("add-form");
    form.style.display = "block";
}

// Функция для добавления новой записи
async function addAttendance(event) {
    event.preventDefault();
    const formData = new FormData(document.getElementById("add-attendance-form"));

    const newAttendance = {
        studentName: formData.get("student"),
        date: formData.get("date"),
        status: formData.get("status")
    };

    try {
        const response = await fetch("/attendance/new", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newAttendance)
        });

        if (!response.ok) {
            throw new Error("Ошибка при добавлении записи");
        }

        alert("Запись успешно добавлена");
        loadAttendance(); // Обновляем список
        document.getElementById("add-form").style.display = "none"; // Скрываем форму
    } catch (error) {
        console.error("Ошибка:", error);
        alert("Не удалось добавить запись.");
    }
}

// Функция для удаления записи
async function deleteAttendance(id) {
    if (!confirm("Вы уверены, что хотите удалить запись?")) return;

    try {
        const response = await fetch(`/attendance/${id}`, { method: "DELETE" });
        if (!response.ok) {
            throw new Error("Ошибка при удалении записи");
        }

        alert("Запись успешно удалена");
        loadAttendance(); // Обновляем список
    } catch (error) {
        console.error("Ошибка:", error);
        alert("Не удалось удалить запись.");
    }
}

// Функция для редактирования записи (заглушка)
function editAttendance(id) {
    alert(`Функция редактирования записи с ID ${id} ещё не реализована.`);
}

// Загружаем данные при загрузке страницы
document.addEventListener("DOMContentLoaded", () => {
    loadAttendance();
    document.getElementById("add-attendance-form").addEventListener("submit", addAttendance);
});
