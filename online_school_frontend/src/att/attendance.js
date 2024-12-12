const apiUrl = "http://localhost:8086/attendance";

export { fetchAttendance, renderTable, resetFilters, filterAttendance, showAddForm, saveAttendance};
window.filterAttendance = filterAttendance;
window.resetFilters = resetFilters;
window.fetchAttendance = fetchAttendance;
window.renderTable = renderTable;
window.showAddForm = showAddForm;
window.saveAttendance = saveAttendance;



function fetchAttendance() {
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => renderTable(data))
        .catch(error => console.error("Error fetching attendance data:", error));
}

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
                <td>${item.date}</td>
                <td>${item.status}</td>
                <td>
                    <a href="#" onclick="editAttendance(${item.id})">Edit</a>
                    <a href="#" onclick="deleteAttendance(${item.id})">Delete</a>
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

    fetch(apiUrl)
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
                filteredData = filteredData.filter(item => item.date === date);
            }

            if (status) {
                filteredData = filteredData.filter(item => item.status === status);
            }

            renderTable(filteredData);
        })
        .catch(error => console.error("Error filtering attendance:", error));
}

// Инициализация
document.addEventListener("DOMContentLoaded", () => {
    fetchAttendance();
});

function showAddForm() {
    document.getElementById("modal-title").textContent = "Add Attendance";
    document.getElementById("attendance-id").value = ""; // Очистка поля ID
    document.getElementById("student-id").value = "";
    document.getElementById("course-id").value = "";
    document.getElementById("date").value = "";
    document.getElementById("status").value = "Присутствовал";
    document.getElementById("modal").style.display = "block"; // Показываем модальное окно
}

function saveAttendance() {
    const studentId = document.getElementById("student-id").value;
    const courseId = document.getElementById("course-id").value;
    const date = new Date(document.getElementById("date").value).toISOString().split("T")[0];
    const status = document.getElementById("status").value;

    const attendance = {
        student: { id: studentId },
        schedule: { course_id: { id: courseId } },
        date: date,
        status: status,
    };

    const method = "POST"; //создаём
    const url = `${apiUrl}/new`;

    fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(attendance),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Error saving attendance");
            }
            fetchAttendance();
            closeModal();
        })
        .catch(error => console.error("Error saving attendance:", error));
}

function closeModal() {
    document.getElementById("modal").style.display = "none";
}

