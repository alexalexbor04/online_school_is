// Загрузка данных при открытии страницы
document.addEventListener('DOMContentLoaded', () => {
    loadAttendance();

    // Добавление обработчиков событий для кнопок
    document.getElementById('searchButton').addEventListener('click', filterAttendance);
    document.getElementById('filterDateButton').addEventListener('click', filterByDate);
    document.getElementById('filterStatusButton').addEventListener('click', filterByStatus);
});

// Функция для загрузки данных из REST API
async function loadAttendance() {
    try {
        const response = await fetch('http://localhost:8086/attendance'); // Замените на ваш API URL
        const data = await response.json();
        updateTable(data);
    } catch (error) {
        console.error('Error loading attendance:', error);
    }
}

// Функция фильтрации по ключевому слову
async function filterAttendance() {
    const keyword = document.getElementById('keyword').value;
    try {
        const response = await fetch(`http://localhost:8086/attendance?keyword=${keyword}`);
        const data = await response.json();
        updateTable(data);
    } catch (error) {
        console.error('Error filtering attendance:', error);
    }
}

// Функция фильтрации по дате
async function filterByDate() {
    const date = document.getElementById('filterDate').value;
    try {
        const response = await fetch(`http://localhost:8086/attendance/filterByDate?date=${date}`);
        const data = await response.json();
        updateTable(data);
    } catch (error) {
        console.error('Error filtering by date:', error);
    }
}

// Функция фильтрации по статусу
async function filterByStatus() {
    const status = document.getElementById('filterStatus').value;
    try {
        const response = await fetch(`http://localhost:8086/attendance/filterByStatus?status=${status}`);
        const data = await response.json();
        updateTable(data);
    } catch (error) {
        console.error('Error filtering by status:', error);
    }
}

// Функция обновления таблицы
function updateTable(data) {
    const tableBody = document.getElementById('attendanceTable');
    tableBody.innerHTML = ''; // Очистка таблицы

    data.forEach((attendance) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${attendance.id}</td>
            <td>${attendance.student_id.name}</td>
            <td>${attendance.schedule_id.description}</td>
            <td>${attendance.status}</td>
            <td>${attendance.date}</td>
            <td>
                <a href="/attendance/edit/${attendance.id}" class="btn">Edit</a>
                <button class="btn" onclick="deleteAttendance(${attendance.id})">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Функция удаления записи
async function deleteAttendance(id) {
    try {
        const response = await fetch(`http://localhost:8086/attendance/${id}`, {method: 'DELETE'});
        if (response.ok) {
            alert('Attendance deleted');
            loadAttendance(); // Перезагрузка данных
        } else {
            alert('Failed to delete attendance');
        }
    } catch (error) {
        console.error('Error deleting attendance:', error);
    }
}
