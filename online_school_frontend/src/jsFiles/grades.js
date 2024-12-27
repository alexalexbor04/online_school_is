import {
    loadStudents, closeModal, getAuthHeaders,
    loadCourse, updateRowCount, deleteRecord, configureAttGradesByRole, configUserLink
} from "../app_funcs.js";

const apiUrl = "http://localhost:8086/grades";

export { getAuthHeaders, fetchGrades, filterAndSortGrades, resetFilters,
    showAddForm, saveGrade, openEditModal, saveEditedGrade};

window.fetchGrades = fetchGrades;
window.filterAndSortGrades = filterAndSortGrades;
window.resetFilters = resetFilters;
window.saveGrade = saveGrade;
window.showAddForm = showAddForm;
window.openEditModal = openEditModal;
window.saveEditedGrade = saveEditedGrade;
window.deleteGrade = deleteGrade;

let gradesData = [];

function fetchGrades() {
    const userRole = getUserRole();
    // отладка временно
    console.log(userRole);

    fetch(apiUrl + "/", {
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
                gradesData = data.filter(item => item.student_id.username === userName);
            } else {
                // отладка временно
                const userName = JSON.parse(atob(localStorage.getItem("token").split(".")[1])).sub;
                // отладка временно
                console.log(userName)
                gradesData = data;
            }
            renderTable(gradesData);
            configureAttGradesByRole();
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
        <td>${grade.id || "Нет"}</td>
        <td>${grade.course_id.course_name || "Нет"}</td>
        <td>${grade.grade || "Нет"}</td>
        <td>${grade.date || "Нет"}</td>
        <td>${grade.student_id.full_name || "Нет"}</td>
        <td>${grade.comment || "Нет"}</td>
        <td>
          <a href="#" class="can-edit" style="display: none;" onclick="openEditModal(${grade.id})">Редактировать</a>
          <a href="#" class="can-delete" style="display: none;" onclick="deleteGrade(${grade.id})">Удалить</a>
        </td>
      </tr>
    `;
        tableBody.innerHTML += row;
    });
    updateRowCount(data.length);
    configureAttGradesByRole();
}

function filterAndSortGrades(sortBy = null) {
    const keyword = document.getElementById("keyword").value.toLowerCase();
    const date = document.getElementById("filter-date").value;
    const grade = document.getElementById("filter-grade").value;
    const course = parseInt(document.getElementById("filter-course").value, 10);

    const userRole = getUserRole();

    const userName = userRole === "student"
        ? JSON.parse(atob(localStorage.getItem("token").split(".")[1])).sub
        : null;

    let filteredData = gradesData;

    if (userRole === "student") {
        filteredData = filteredData.filter(item => item.student_id.username === userName);
    }

    filteredData = filteredData.filter(item => {
        return (
            (!keyword ||
                item.student_id.full_name.toLowerCase().includes(keyword) ||
                item.course_id.course_name.toLowerCase().includes(keyword) ||
                item.comment.toLowerCase().includes(keyword) ||
                item.date.toLowerCase().includes(keyword)) &&
            (!date || item.date === date) &&
            (!grade || item.grade === parseInt(grade)) &&
            (!course || item.course_id.id === course)
        );
    });

    if (sortBy) {
        switch (sortBy) {
            case "date":
                filteredData.sort((a, b) => new Date(a.date) - new Date(b.date));
                break;
            case "student":
                filteredData.sort((a, b) => a.student_id.full_name.localeCompare(b.student_id.full_name));
                break;
            case "course":
                filteredData.sort((a, b) => a.course_id.course_name.localeCompare(b.course_id.course_name));
                break;
            case "grade":
                filteredData.sort((a, b) => a.grade - b.grade);
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
    document.getElementById("filter-grade").value = "";
    document.getElementById("filter-course").value = "";
    renderTable(gradesData);
}

function showAddForm() {
    document.getElementById("grade-id").value = "";
    document.getElementById("comment").value = "";
    document.getElementById("date-grade").value = "";
    document.getElementById("grade").value = "";
    loadCourse("course-id");
    loadStudents("student-id");
    document.getElementById("modal_add").style.display = "block";
    fetchGrades();
}

function saveGrade() {
    const userRole = getUserRole();
    if (userRole !== "teacher") {
        alert("У вас нет прав на добавление оценок.");
        return;
    }

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
            closeModal("modal_add");
            fetchGrades();
        })
        .catch(error => console.error("Ошибка добавления:", error));
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
            .then(grade => {
                document.getElementById("edit-grades-id").value = grade.id;
                document.getElementById("edit-grade").value = grade.grade;
                document.getElementById("edit-date-grade").value = grade.date;
                document.getElementById("edit-comment").value = grade.comment;

                loadCourse("edit-course-id", grade.course_id.id);
                loadStudents("edit-student-id", grade.student_id.id);

                document.getElementById("edit-modal").style.display = "block";
            })
            .catch(error => console.error("Error fetching grades for edit:", error))
    }
}

function saveEditedGrade() {
    const gardeId = document.getElementById("edit-grades-id").value;

    const updatedGrade = {
        comment: document.getElementById("edit-comment").value,
        date: document.getElementById("edit-date-grade").value,
        grade: document.getElementById("edit-grade").value,
        course_id: { id: document.getElementById("edit-course-id").value },
        student_id: { id: document.getElementById("edit-student-id").value },
    };

    const userRole = getUserRole();
    if (userRole !== "admin" && userRole !== "teacher") {
        alert("У вас нет прав на редактирование.");
    } else {
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
                closeModal("edit-modal");
                fetchGrades();
            })
            .catch((error) => {
                console.error("Ошибка обновления оценки:", error);
                alert("Ошибка сохранения изменений.");
            });
    }
}

function deleteGrade(id) {
    const userRole = getUserRole();
    if (userRole !== "teacher" && userRole !== "admin") {
        alert("У вас нет прав на удаление посещений.");
    } else {
        deleteRecord(id, apiUrl, fetchGrades);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    configureAttGradesByRole();
    fetchGrades();
    loadCourse("filter-course");
    configUserLink();
});






