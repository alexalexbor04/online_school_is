export {getAuthHeaders, loadStudents, loadSchedules, updateRowCount, closeModal,
    deleteRecord, loadCourse, loadTeacher, getUserRole, configureAttGradesByRole,
    configureSchCourByRole, configureMatByRole, configUserLink}

window.getAuthHeaders = getAuthHeaders;
window.loadStudents = loadStudents;
window.loadSchedules = loadSchedules;
window.updateRowCount = updateRowCount;
window.closeModal = closeModal;
window.deleteRecord = deleteRecord;
window.loadCourse = loadCourse;
window.loadTeacher = loadTeacher;
window.getUserRole = getUserRole;
window.configureAttGradesByRole = configureAttGradesByRole;
window.configureSchCourByRole = configureSchCourByRole;
window.configureMatByRole = configureMatByRole;
window.configUserLink = configUserLink;


function getAuthHeaders() {
    const token = localStorage.getItem("token");
    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
    };
}

function getUserRole() {
    const token = localStorage.getItem("token");
    if (!token) return null;
    const payload = JSON.parse(atob(token.split(".")[1]));

    return payload.roles.name;
}

function configureAttGradesByRole() {
    const userRole = getUserRole();

    const addButton = document.querySelector(".can-add");
    const editLinks = document.querySelectorAll(".can-edit");
    const deleteLinks = document.querySelectorAll(".can-delete");

    if (userRole === "admin") {
        if (addButton) addButton.style.display = "none";
        editLinks.forEach(link => (link.style.display = "inline"));
        deleteLinks.forEach(link => (link.style.display = "inline"));
    } else if (userRole === "teacher") {
        if (addButton) addButton.style.display = "block";
        editLinks.forEach(link => (link.style.display = "inline"));
        deleteLinks.forEach(link => (link.style.display = "inline"));
    } else if (userRole === "student") {
        if (addButton) addButton.style.display = "none";
        editLinks.forEach(link => (link.style.display = "none"));
        deleteLinks.forEach(link => (link.style.display = "none"));
    }
}

function configureMatByRole() {
    const userRole = getUserRole();

    const addButton = document.querySelector(".can-add");
    const editLinks = document.querySelectorAll(".can-edit");
    const deleteLinks = document.querySelectorAll(".can-delete");

    if (userRole === "admin" || userRole === "teacher") {
        if (addButton) addButton.style.display = "block";
        editLinks.forEach(link => (link.style.display = "inline"));
        deleteLinks.forEach(link => (link.style.display = "inline"));
    } else if (userRole === "student") {
        if (addButton) addButton.style.display = "none";
        editLinks.forEach(link => (link.style.display = "none"));
        deleteLinks.forEach(link => (link.style.display = "none"));
    }
}



function configureSchCourByRole() {
    const userRole = getUserRole();

    const addButton = document.querySelector(".can-add");
    const editLinks = document.querySelectorAll(".can-edit");
    const deleteLinks = document.querySelectorAll(".can-delete");

    if (userRole === "admin") {
        if (addButton) addButton.style.display = "block";
        editLinks.forEach(link => (link.style.display = "inline"));
        deleteLinks.forEach(link => (link.style.display = "inline"));
    } else if (userRole === "teacher" || userRole === "student") {
        if (addButton) addButton.style.display = "none";
        editLinks.forEach(link => (link.style.display = "none"));
        deleteLinks.forEach(link => (link.style.display = "none"));
    }
}


function loadStudents(studentSelectId, selectedStudentId = null) {
    const studentSelect = document.getElementById(studentSelectId);
    const url = "http://localhost:8086/students";

    fetch(url, {
        method: "GET",
        headers: getAuthHeaders(),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Ошибка загрузки списка студентов");
            }
            return response.json();
        })
        .then(students => {
            studentSelect.innerHTML = '<option value="">Выберите студента</option>';
            students.forEach(student => {
                const option = document.createElement("option");
                option.value = student.id;
                option.textContent = `${student.id} - ${student.full_name}`;
                studentSelect.appendChild(option);
            });

            if (selectedStudentId) {
                studentSelect.value = selectedStudentId;
            }
        })
        .catch(error => {
            console.error("Ошибка загрузки студентов:", error);
        });
}

function loadSchedules(scheduleSelectId, selectedScheduleId = null) {
    const scheduleSelect = document.getElementById(scheduleSelectId);
    const url_sch = "http://localhost:8086/schedule/all";

    fetch(url_sch, {
        method: "GET",
        headers: getAuthHeaders(),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Ошибка загрузки списка расписания");
            }
            return response.json();
        })
        .then(schedules => {
            scheduleSelect.innerHTML = '<option value="">Выберите курс и дату</option>';
            schedules.forEach(schedule => {
                const option = document.createElement("option");
                option.value = schedule.id;
                option.textContent = `${schedule.id} - ${schedule.course_id.course_name} (${schedule.date})`;
                scheduleSelect.appendChild(option);
            });

            if (selectedScheduleId) {
                scheduleSelect.value = selectedScheduleId;
            }
        })
        .catch(error => {
            console.error("Ошибка загрузки расписания:", error);
        });
}

function loadCourse(courseSelectId, selectedCourseId = null) {
    const courseSelect = document.getElementById(courseSelectId);
    const url = "http://localhost:8086/courses/all";

    fetch(url, {
        method: "GET",
        headers: getAuthHeaders(),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Ошибка загрузки списка");
            }
            return response.json();
        })
        .then(courses => {
            courseSelect.innerHTML = '<option value="">Выберете курс</option>';
            courses.forEach(courses => {
                const option = document.createElement("option");
                if (courseSelectId === "filter-course") {
                    option.value = courses.id;
                    option.textContent = `${courses.course_name}`;
                } else {
                    option.value = courses.id;
                    option.textContent = `${courses.id} - ${courses.course_name}`;
                }
                courseSelect.appendChild(option);
            });

            if (selectedCourseId) {
                courseSelect.value = selectedCourseId;
            }
        })
        .catch(error => {
            console.error("Ошибка загрузки:", error);
        });
}

function loadTeacher(teachSelectId, selTeachID = null) {
    const teacherSel = document.getElementById(teachSelectId);
    const url = "http://localhost:8086/teachers";

    fetch(url, {
        method: "GET",
        headers: getAuthHeaders(),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Ошибка загрузки списка студентов");
            }
            return response.json();
        })
        .then(teachers => {
            teacherSel.innerHTML = '<option value="">Выберите учителя</option>';
            teachers.forEach(teachers => {
                const option = document.createElement("option");
                option.value = teachers.id;
                option.textContent = `${teachers.id} - ${teachers.full_name}`;
                teacherSel.appendChild(option);
            });

            if (selTeachID) {
                teacherSel.value = selTeachID;
            }
        })
        .catch(error => {
            console.error("Ошибка загрузки студентов:", error);
        });
}

function deleteRecord(id, apiUrl, fetchCallback) {
    const confirmDelete = confirm("Вы уверены, что хотите удалить эту запись?");
    if (!confirmDelete) return;

    const url = `${apiUrl}/${id}`;

    fetch(url, {
        method: "DELETE",
        headers: getAuthHeaders(),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Ошибка удаления записи");
            }
            alert("Запись успешно удалена");
            if (fetchCallback && typeof fetchCallback === "function") {
                fetchCallback();
            }
        })
        .catch(error => console.error("Ошибка удаления:", error));
}

function configUserLink () {
    const userRole = getUserRole();
    console.log("User role:", userRole); // Для отладки

    const adminUsersLink = document.getElementById("admin-users-link");

    if (userRole === "admin") {
        adminUsersLink.style.display = "inline";
    } else {
        adminUsersLink.style.display = "none";
    }
}

document.getElementById("logout-button").addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "/auth/login";
});


function updateRowCount(count) {
    document.getElementById("row-count").textContent = count;
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = "none";
}

// document.addEventListener('DOMContentLoaded', () => {
//     const validRoutes = ['/attendance', '/schedule', '/admin/users', '/courses', '/grades', '/materials', '/about'];
//     const currentPath = window.location.pathname;
//
//     if (!validRoutes.includes(currentPath) && !currentPath.startsWith('/error')) {
//         window.location.href = '/error';
//     }
// });

