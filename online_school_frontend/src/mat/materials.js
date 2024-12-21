const apiUrl = "http://localhost:8086/materials";

export { getAuthHeaders, fetchMat, filterMat, resetFilters, showAddForm, saveMat, openEditModal,
    saveEditedMat, closeEditModal, sortMatByTitle, sortMatByCourse, deleteMat};

window.getAuthHeaders = getAuthHeaders;
window.fetchMat= fetchMat;
window.filterMat = filterMat;
window.resetFilters = resetFilters;
window.saveMat = saveMat;
window.showAddForm = showAddForm;
window.closeModal = closeModal;
window.openEditModal = openEditModal;
window.saveEditedMat = saveEditedMat;
window.closeEditModal = closeEditModal;
window.deleteMat = deleteMat;
window.sortMatByTitle = sortMatByTitle;
window.sortMatByCourse = sortMatByCourse;


let matData = [];

function getAuthHeaders() {
    const token = localStorage.getItem("token");
    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
    };
}

function fetchMat() {
    fetch(apiUrl + "/", { headers: getAuthHeaders() })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Ошибка запроса: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            matData = data;
            renderTable(matData);
        })
        .catch(error => {
            console.error("Ошибка загрузки материалов:", error);
            alert("Ошибка загрузки данных. Проверьте авторизацию.");
            window.location.href = "/auth/login";
        });
}

function renderTable(data) {
    const tableBody = document.querySelector("#mat-table tbody");
    tableBody.innerHTML = "";

    if (data.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="4">Нет доступных данных</td></tr>`;
        updateRowCount(0);
        return;
    }

    data.forEach((mat) => {
        const row = `
      <tr>
        <td>${mat.id}</td>
        <td>${mat.course_id.course_name}</td>
        <td>${mat.title}</td>
        <td>${mat.file_path}</td>
        <td>
          <a href="#" onclick="openEditModal(${mat.id})">Редактировать</a>
          <a href="#" onclick="deleteMat(${mat.id})">Удалить</a>
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

function filterMat() {
    const keyword = document.getElementById("keyword").value.toLowerCase();
    const course = document.getElementById("filter-course-mat").value;

    const filteredData = matData.filter(item => {
        return (
            (!keyword ||
                item.file_path.toLowerCase().includes(keyword) ||
                item.course_id.course_name.toLowerCase().includes(keyword) ||
                item.title.toLowerCase().includes(keyword)) &&
            (!course || item.course_name === course)
        );
    });

    renderTable(filteredData);
}

function resetFilters() {
    document.getElementById("keyword").value = "";
    document.getElementById("filter-course-mat").value = "";
    renderTable(matData);
}

function sortMatByTitle() {
    const sorted = [...matData].sort((a, b) => a.title.localeCompare(b.title));
    renderTable(sorted);
}

function sortMatByCourse() {
    const sorted = [...matData].sort((a, b) => a.course_id.course_name.localeCompare(b.course_id.course_name));
    renderTable(sorted);
}

// Показ формы добавления
function showAddForm() {
    document.getElementById("modal_add").style.display = "block";
    fetchMat(); // Запрос списка курсов
}

// Закрыть форму добавления
function closeModal() {
    document.getElementById("modal_add").style.display = "none";
}

// Сохранение нового расписания
function saveMat() {
    const newMat = {
        course_id: { id: document.getElementById("course-id").value },
        title: document.getElementById("title-id").value,
        file_path: document.getElementById("file-path").value
    };

    fetch(apiUrl + "/new", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(newMat),
    })
        .then(response => response.json())
        .then(() => {
            alert("Материал добавлен!");
            closeModal();
            fetchMat();
        })
        .catch(error => console.error("Ошибка добавления:", error));
}

// Открыть форму редактирования
function openEditModal(id) {
    const mat = matData.find(mt => mt.id === id);
    if (!mat) return;

    document.getElementById("edit-mat-id").value = mat.id;
    document.getElementById("edit-course-id").value = mat.course_id.id;
    document.getElementById("edit-title").value = mat.title;
    document.getElementById("edit-file-path").value = mat.date;

    document.getElementById("edit-modal").style.display = "block";
}

// Сохранить изменения курса
function saveEditedMat() {
    const gardeId = document.getElementById("edit-mat-id").value;

    const updatedMat = {
        title: document.getElementById("edit-title").value,
        file_path: document.getElementById("edit-file-path").value,
        course_id: { id: document.getElementById("edit-course-id").value },
    };

    fetch(`${apiUrl}/edit/${gardeId}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(updatedMat),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Ошибка обновления материала");
            }
            alert("Материал успешно обновлена!");
            closeEditModal();
            fetchMat();
        })
        .catch((error) => {
            console.error("Ошибка обновления материала:", error);
            alert("Ошибка сохранения изменений.");
        });
}

function closeEditModal() {
    document.getElementById("edit-modal").style.display = "none";
}

function deleteMat(matID) {
    const confirmDelete = confirm("Вы уверены, что хотите удалить этот курс?");
    if (!confirmDelete) return;

    fetch(`${apiUrl}/${matID}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Ошибка удаления оценки");
            }
            fetchMat();
        })
        .catch((error) => {
            console.error("Ошибка удаления материала", error);
            alert("Ошибка при удалении материала.");
        });
}

document.addEventListener("DOMContentLoaded", () => {
    fetchMat();
});