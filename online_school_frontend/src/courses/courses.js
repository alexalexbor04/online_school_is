const apiUrl = "http://localhost:8086/courses";

export {
    getAuthHeaders,
    fetchCourses,
    renderTable,
    sortCoursesByName,
    filterCourses,
    resetFilters,
    saveCourses,
    saveEditedCourse,
    closeModal,
    closeEditModal,
    showAddForm,
    openEditModal
};

window.getAuthHeaders = getAuthHeaders;
window.fetchCourses = fetchCourses;
window.renderTable = renderTable;
window.sortCoursesByName = sortCoursesByName;
window.filterCourses = filterCourses;
window.resetFilters = resetFilters;
window.saveCourses = saveCourses;
window.saveEditedCourse = saveEditedCourse;
window.closeModal = closeModal;
window.closeEditModal = closeEditModal;
window.showAddForm = showAddForm;
window.openEditModal = openEditModal;

let coursesData = [];

// Получение токена из localStorage
function getAuthHeaders() {
    const token = localStorage.getItem("token");
    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
    };
}

// Получение курсов с сервера
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

// Отображение таблицы курсов
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

// Сортировка по имени курса
function sortCoursesByName() {
    coursesData.sort((a, b) => a.course_name.localeCompare(b.course_name));
    renderTable(coursesData);
}

// Фильтрация курсов
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

// Сброс фильтров
function resetFilters() {
    document.getElementById("keyword").value = "";
    fetchCourses();
}

// Добавление нового курса
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
            closeModal();
            fetchCourses();
        })
        .catch((error) => {
            console.error("Ошибка добавления курса", error);
            alert("Ошибка сохранения курса.");
        });
}

// Открыть модальное окно редактирования
function openEditModal(id) {
    const course = coursesData.find(cour => cour.id === id);
    if (!course) return;

    document.getElementById("edit-course-id").value = course.id;
    document.getElementById("edit-course-name").value = course.course_name;
    document.getElementById("edit-description").value = course.description;
    document.getElementById("edit-teacher-id").value = course.teacher_id.id;

    document.getElementById("edit-modal").style.display = "block";
}

// Сохранить изменения курса
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
            closeEditModal();
            fetchCourses(); // Обновить список курсов после сохранения изменений
        })
        .catch((error) => {
            console.error("Ошибка обновления курса:", error);
            alert("Ошибка сохранения изменений.");
        });
}


// Удаление курса
function deleteCourse(courseId) {
    const confirmDelete = confirm("Вы уверены, что хотите удалить этот курс?");
    if (!confirmDelete) return;

    fetch(`${apiUrl}/${courseId}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Ошибка удаления курса");
            }
            fetchCourses();
        })
        .catch((error) => {
            console.error("Ошибка удаления курса", error);
            alert("Ошибка при удалении курса.");
        });
}

// Закрытие модальных окон
function closeModal() {
    document.getElementById("modal_add").style.display = "none";
}

function showAddForm() {
    document.getElementById("modal_add").style.display = "block";
    fetchCourses();
}

function closeEditModal() {
    document.getElementById("edit-modal").style.display = "none";
}

// Обновление количества строк в таблице
function updateRowCount(count) {
    document.getElementById("row-count").textContent = count;
}

// Инициализация
document.addEventListener("DOMContentLoaded", () => {
    fetchCourses();
});
