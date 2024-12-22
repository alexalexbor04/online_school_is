import {getAuthHeaders, loadTeacher, closeModal, deleteRecord, updateRowCount} from "../app_funcs.js"

const apiUrl = "http://localhost:8086/courses";

export {
    fetchCourses,
    renderTable,
    sortCoursesByName,
    filterCourses,
    resetFilters,
    saveCourses,
    saveEditedCourse,
    showAddForm,
    openEditModal
};

window.fetchCourses = fetchCourses;
window.renderTable = renderTable;
window.sortCoursesByName = sortCoursesByName;
window.filterCourses = filterCourses;
window.resetFilters = resetFilters;
window.saveCourses = saveCourses;
window.saveEditedCourse = saveEditedCourse;
window.showAddForm = showAddForm;
window.openEditModal = openEditModal;

let coursesData = [];

function fetchCourses() {
    fetch(apiUrl + "/", { headers: getAuthHeaders() })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Ошибка запроса: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            coursesData = data;
            renderTable(coursesData);
        })
        .catch(error => {
            console.error("Ошибка загрузки курсов:", error);
            alert("Ошибка загрузки данных. Проверьте авторизацию.");
            window.location.href = "/auth/login";
        });
}

function renderTable(data) {
    const tableBody = document.querySelector("#courses-table tbody");
    tableBody.innerHTML = "";

    if (data.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="4">Нет доступных данных</td></tr>`;
        updateRowCount(0);
        return;
    }

    data.forEach((course) => {
        const row = `
      <tr>
        <td>${course.id}</td>
        <td>${course.course_name}</td>
        <td>${course.description}</td>
        <td>${course.teacher_id.full_name}</td>
        <td>
          <a href="#" onclick="openEditModal(${course.id})">Редактировать</a>
          <a href="#" onclick="deleteCourse(${course.id})">Удалить</a>
        </td>
      </tr>
    `;
        tableBody.innerHTML += row;
    });
    updateRowCount(data.length);
}

function sortCoursesByName() {
    coursesData.sort((a, b) => a.course_name.localeCompare(b.course_name));
    renderTable(coursesData);
}

function filterCourses() {
    const keyword = document.getElementById("keyword").value.toLowerCase();

    const filteredData = coursesData.filter(
        (course) =>
            course.course_name.toLowerCase().includes(keyword) ||
            course.description.toLowerCase().includes(keyword) ||
            course.teacher_id.full_name.toLowerCase().includes(keyword)
    );

    renderTable(filteredData);
}

function resetFilters() {
    document.getElementById("keyword").value = "";
    fetchCourses();
}

function showAddForm() {
    document.getElementById("course-id").value = "";
    document.getElementById("course-name").value = "";
    document.getElementById("description").value = "";
    loadTeacher("teacher-id");
    document.getElementById("modal_add").style.display = "block";
    fetchCourses();
}

document.addEventListener("DOMContentLoaded", () => {
    fetchCourses();
});

function saveCourses() {
    const name = document.getElementById("course-name").value;
    const description = document.getElementById("description").value;
    const teacherId = document.getElementById("student-id").value;

    const newCourse = {
        name,
        description,
        teacher: { id: parseInt(teacherId) },
    };

    fetch(`${apiUrl}/new`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(newCourse),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Ошибка добавления курса");
            }
            closeModal("modal_add");
            fetchCourses();
        })
        .catch((error) => {
            console.error("Ошибка добавления курса", error);
            alert("Ошибка сохранения курса.");
        });
}

function openEditModal(id) {
    const course = coursesData.find(cour => cour.id === id);
    if (!course) return;

    document.getElementById("edit-course-id").value = course.id;
    document.getElementById("edit-course-name").value = course.course_name;
    document.getElementById("edit-description").value = course.description;
    loadTeacher("edit-teacher-id", course.teacher_id.id);

    document.getElementById("edit-modal").style.display = "block";
}

function saveEditedCourse() {
    const courseId = document.getElementById("edit-course-id").value;

    const updatedCourse = {
        course_name: document.getElementById("edit-course-name").value,
        description: document.getElementById("edit-description").value,
        teacher_id: { id: document.getElementById("edit-teacher-id").value },
    };

    fetch(`${apiUrl}/edit/${courseId}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(updatedCourse),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Ошибка обновления курса");
            }
            alert("Курс успешно обновлен!");
            closeModal("edit-modal");
            fetchCourses();
        })
        .catch((error) => {
            console.error("Ошибка обновления курса:", error);
            alert("Ошибка сохранения изменений.");
        });
}

function deleteCourse(courseId) {
    deleteRecord(id, apiUrl, fetchCourses);
}
