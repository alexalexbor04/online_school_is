import {
    getAuthHeaders,
    loadTeacher,
    closeModal,
    deleteRecord,
    updateRowCount,
    configureSchCourByRole,
    getUserRole
} from "../app_funcs.js"

const apiUrl = "http://localhost:8086/courses";

export {
    fetchCourses,
    renderTable,
    resetFilters,
    saveCourses,
    saveEditedCourse,
    showAddForm,
    openEditModal,
    filterAndSortCourses,
    deleteCourse
};

window.fetchCourses = fetchCourses;
window.renderTable = renderTable;
window.resetFilters = resetFilters;
window.saveCourses = saveCourses;
window.saveEditedCourse = saveEditedCourse;
window.showAddForm = showAddForm;
window.openEditModal = openEditModal;
window.filterAndSortCourses = filterAndSortCourses;
window.deleteCourse = deleteCourse;

let coursesData = [];

function fetchCourses() {
    //отладка временно
    const userRole = getUserRole();
    console.log(userRole);

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
            configureSchCourByRole();
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
          <a href="#" class="can-edit" style="display: none;" onclick="openEditModal(${course.id})">Редактировать</a>
          <a href="#" class="can-delete" style="display: none;" onclick="deleteCourse(${course.id})">Удалить</a>
        </td>
      </tr>
    `;
        tableBody.innerHTML += row;
    });
    updateRowCount(data.length);
}

function filterAndSortCourses(sortBy = null) {
    const keyword = document.getElementById("keyword").value.toLowerCase();
    let filteredData = coursesData;

    filteredData = filteredData.filter(course => {
        return (
            course.course_name.toLowerCase().includes(keyword) ||
            course.description.toLowerCase().includes(keyword) ||
            course.teacher_id.full_name.toLowerCase().includes(keyword)
        );
    });

    if (sortBy) {
        switch (sortBy) {
            case "name":
                filteredData.sort((a, b) => a.course_name.localeCompare(b.course_name));
                break;
            default:
                break;
        }
    }

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


function saveCourses() {
    const userRole = getUserRole();
    if (userRole !== "admin") {
        alert("У вас нет прав на добавление расписания.");
        return;
    }

    const course_name = document.getElementById("course-name").value;
    const description = document.getElementById("description").value;
    const teacherId = document.getElementById("teacher-id").value;

    const newCourse = {
        course_name,
        description,
        teacher_id: { id: parseInt(teacherId) },
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
            alert("Новый курс добавлен!");
            closeModal("modal_add");
            fetchCourses();
        })
        .catch((error) => {
            console.error("Ошибка добавления курса", error);
            alert("Ошибка сохранения курса.");
        });
}

function openEditModal(id) {
    const url = `${apiUrl}/edit/${id}`;

    const userRole = getUserRole();
    if (userRole !== "admin") {
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
            .then(course => {
                document.getElementById("edit-course-id").value = course.id;
                document.getElementById("edit-course-name").value = course.course_name;
                document.getElementById("edit-description").value = course.description;
                loadTeacher("edit-teacher-id", course.teacher_id.id);

                document.getElementById("edit-modal").style.display = "block";
            })
            .catch(error => console.error("Ошибка редактирования расписания: ", error));
    }
}

function saveEditedCourse() {
    const userRole = getUserRole();
    const courseId = document.getElementById("edit-course-id").value;

    const updatedCourse = {
        course_name: document.getElementById("edit-course-name").value,
        description: document.getElementById("edit-description").value,
        teacher_id: { id: document.getElementById("edit-teacher-id").value },
    };

    if (userRole !== "admin") {
        alert("У вас нет прав на редактирование.");
    } else {
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
}

function deleteCourse(id) {
    const userRole = getUserRole();
    if (userRole !== "admin") {
        alert("У вас нет прав на удаление курсов.");
    } else {
        deleteRecord(id, apiUrl, fetchCourses);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    configureSchCourByRole();
    fetchCourses();
});

