const apiUrl = "http://localhost:8086/grades";

export { getAuthHeaders, fetchGrades, filterGrades, resetFilters, showAddForm, saveGrade, openEditModal,
    saveEditedGrade, closeEditModal, sortGradesByDate, sortGradesByStudent, sortGradeByCourse, sortGradesByGrade};

window.getAuthHeaders = getAuthHeaders;
window.fetchGrades = fetchGrades;
window.filterGrades = filterGrades;
window.resetFilters = resetFilters;
window.saveGrade = saveGrade;
window.showAddForm = showAddForm;
window.closeModal = closeModal;
window.openEditModal = openEditModal;
window.saveEditedGrade = saveEditedGrade;
window.closeEditModal = closeEditModal;
window.deleteGrade = deleteGrade;
window.sortGradesByDate = sortGradesByDate;
window.sortGradesByStudent = sortGradesByStudent;
window.sortGradesByGrade = sortGradesByGrade;
window.sortGradeByCourse = sortGradeByCourse;


let gradesData = [];

function getAuthHeaders() {
    const token = localStorage.getItem("token");
    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
    };
}

function fetchGrades() {
    fetch(apiUrl + "/", { headers: getAuthHeaders() })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Ошибка запроса: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            gradesData = data;
            renderTable(gradesData);
        })
        .catch(error => {
            console.error("Ошибка загрузки курсов:", error);
            alert("Ошибка загрузки данных. Проверьте авторизацию.");
            window.location.href = "/auth/login";
        });
}

function renderTable(data) {
    const tableBody = document.querySelector("#grade-table tbody");
    tableBody.innerHTML = "";

    if (data.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="4">Нет доступных данных</td></tr>`;
        updateRowCount(0);
        return;
    }

    data.forEach((grade) => {
        const row = `
      <tr>
        <td>${grade.id}</td>
        <td>${grade.course_id.course_name}</td>
        <td>${grade.grade}</td>
        <td>${grade.date}</td>
        <td>${grade.student_id.full_name}</td>
        <td>${grade.comment}</td>
        <td>
          <a href="#" onclick="openEditModal(${grade.id})">Редактировать</a>
          <a href="#" onclick="deleteGrade(${grade.id})">Удалить</a>
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

function filterGrades() {
    const keyword = document.getElementById("keyword").value.toLowerCase();
    const date = document.getElementById("filter-date").value;
    const grade = document.getElementById("filter-grade").value;
    const course = document.getElementById("filter-course").value;

    const filteredData = gradesData.filter(item => {
        return (
            (!keyword ||
                item.student_id.full_name.toLowerCase().includes(keyword) ||
                item.course_id.course_name.toLowerCase().includes(keyword) ||
                item.comment.toLowerCase().includes(keyword)) &&
            (!date || item.date === date) &&
            (!grade || item.grade === parseInt(grade)) &&
            (!course || item.course_name === course)
        );
    });

    renderTable(filteredData);
}

function resetFilters() {
    document.getElementById("keyword").value = "";
    document.getElementById("filter-date").value = "";
    document.getElementById("filter-grade").value = "";
    document.getElementById("filter-course").value = "";
    renderTable(gradesData);
}

function sortGradesByDate() {
    const sorted = [...gradesData].sort((a, b) => new Date(a.date) - new Date(b.date));
    renderTable(sorted);
}

function sortGradesByStudent() {
    const sorted = [...gradesData].sort((a, b) => a.student_id.full_name.localeCompare(b.student_id.full_name));
    renderTable(sorted);
}

function sortGradeByCourse() {
    const sorted = [...gradesData].sort((a, b) => a.course_id.course_name.localeCompare(b.course_id.course_name));
    renderTable(sorted);
}

function sortGradesByGrade() {
    const sorted = [...gradesData].sort((a, b) => a.grade - b.grade);
    renderTable(sorted);
}


// Показ формы добавления
function showAddForm() {
    document.getElementById("modal_add").style.display = "block";
    fetchGrades(); // Запрос списка курсов
}

// Закрыть форму добавления
function closeModal() {
    document.getElementById("modal_add").style.display = "none";
}

// Сохранение нового расписания
function saveGrade() {
    const newGrade = {
        course_id: { id: document.getElementById("course-id").value },
        student_id: { id: document.getElementById("student-id").value },
        date: document.getElementById("date-grade").value,
        grade: document.getElementById("grade").value,
        comment: document.getElementById("comment").value
    };

    fetch(apiUrl + "/new", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(newGrade),
    })
        .then(response => response.json())
        .then(() => {
            alert("Оценка добавлена!");
            closeModal();
            fetchGrades();
        })
        .catch(error => console.error("Ошибка добавления:", error));
}

// Открыть форму редактирования
function openEditModal(id) {
    const grade = gradesData.find(gr => gr.id === id);
    if (!grade) return;

    document.getElementById("edit-grades-id").value = grade.id;
    document.getElementById("edit-course-id").value = grade.course_id.id;
    document.getElementById("edit-grade").value = grade.grade;
    document.getElementById("edit-date-grade").value = grade.date;
    document.getElementById("edit-student-id").value = grade.student_id.id;
    document.getElementById("edit-comment").value = grade.comment;

    document.getElementById("edit-modal").style.display = "block";
}

// Сохранить изменения курса
function saveEditedGrade() {
    const gardeId = document.getElementById("edit-grades-id").value;

    const updatedGrade = {
        comment: document.getElementById("edit-comment").value,
        date: document.getElementById("edit-date-grade").value,
        grade: document.getElementById("edit-grade").value,
        course_id: { id: document.getElementById("edit-course-id").value },
        student_id: { id: document.getElementById("edit-student-id").value },
    };

    fetch(`${apiUrl}/edit/${gardeId}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(updatedGrade),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Ошибка обновления оценки");
            }
            alert("Оценка успешно обновлена!");
            closeEditModal();
            fetchGrades();
        })
        .catch((error) => {
            console.error("Ошибка обновления оценки:", error);
            alert("Ошибка сохранения изменений.");
        });
}

function closeEditModal() {
    document.getElementById("edit-modal").style.display = "none";
}

function deleteGrade(gradeID) {
    const confirmDelete = confirm("Вы уверены, что хотите удалить этот курс?");
    if (!confirmDelete) return;

    fetch(`${apiUrl}/${gradeID}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Ошибка удаления оценки");
            }
            fetchGrades();
        })
        .catch((error) => {
            console.error("Ошибка удаления оценки", error);
            alert("Ошибка при удалении оценки.");
        });
}

document.addEventListener("DOMContentLoaded", () => {
    fetchGrades();
});






