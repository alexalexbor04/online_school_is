export {getAuthHeaders, loadStudents, loadSchedules, updateRowCount, closeModal,
    deleteRecord, loadCourse, loadTeacher}

window.getAuthHeaders = getAuthHeaders;
window.loadStudents = loadStudents;
window.loadSchedules = loadSchedules;
window.updateRowCount = updateRowCount;
window.closeModal = closeModal;
window.deleteRecord = deleteRecord;
window.loadCourse = loadCourse;
window.loadTeacher = loadTeacher;


function getAuthHeaders() {
    const token = localStorage.getItem("token");
    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
    };
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


function updateRowCount(count) {
    document.getElementById("row-count").textContent = count;
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = "none";
}
