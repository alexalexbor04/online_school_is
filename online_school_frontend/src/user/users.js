const apiUrl = "http://localhost:8086/admin/users";

export { getAuthHeaders, fetchUsers, renderTable, openEditModal, saveUserRole, deleteUser, closeEditModal,
    resetFilters, sortUsersByFullName, sortUsersByRole, filterUsers };

window.getAuthHeaders = getAuthHeaders;
window.fetchAttendance = fetchUsers;
window.renderTable = renderTable;
window.openEditModal = openEditModal;
window.saveUserRole = saveUserRole;
window.deleteUser = deleteUser;
window.closeEditModal = closeEditModal;
window.resetFilters = resetFilters;
window.sortUsersByFullName = sortUsersByFullName;
window.sortUsersByRole = sortUsersByRole;
window.filterUsers = filterUsers;


function getAuthHeaders() {
    const token = localStorage.getItem("token");
    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
    };
}

let usersData = [];

function fetchUsers() {
    fetch(apiUrl, {
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
            usersData = data;
            renderTable(usersData)
        })
        .catch(error => {
            console.error("Ошибка загрузки данных юзеров", error);
            alert("Ошибка загрузки данных. Пожалуйста, проверьте авторизацию.");
            // переход на страницу логина
        });
}

function renderTable(data) {
    const tableBody = document.querySelector("#users-table tbody");
    tableBody.innerHTML = "";

    if (data.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="6">Нет доступных данных</td></tr>`;
        updateRowCount(0);
        return;
    }

    data.forEach(item => {
        const row = `
            <tr>
                <td>${item.id}</td>
                <td>${item.username}</td>
                <td>${item.roles.name}</td>
                <td>${item.full_name}</td>
                <td>${item.email}</td>
                <td>${item.phone}</td>
                <td>
                    <a href="#" onclick="openEditModal(${item.id})">Редактировать</a>
                    <a href="#" onclick="deleteUser(${item.id})">Удалить</a>
                </td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
    updateRowCount(data.length);
}

// Функция открытия модального окна для редактирования роли
function openEditModal(userId) {
    const user = usersData.find(u => u.id === userId);
    if (!user) {
        alert("Пользователь не найден!");
        return;
    }

    document.getElementById("edit-user-id").value = user.id;
    document.getElementById("edit-username").value = user.username;
    document.getElementById("edit-role").value = user.roles.name;

    document.getElementById("edit-modal-users").style.display = "block";
}

// Функция сохранения измененной роли
function saveUserRole() {
    const userId = document.getElementById("edit-user-id").value;
    const newRole = document.getElementById("edit-role").value;

    fetch(`${apiUrl}/${userId}/changeRole`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ role: newRole })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Ошибка при обновлении роли пользователя.");
            }
            alert("Роль пользователя обновлена.");
            closeEditModal();
            fetchAttendance();
        })
        .catch(error => {
            console.error("Ошибка сохранения роли пользователя:", error);
            alert("Ошибка сохранения изменений.");
        });
}

// Закрыть модальное окно
function closeEditModal() {
    document.getElementById("edit-modal-users").style.display = "none";
}

// Функция удаления пользователя
function deleteUser(userId) {
    const confirmDelete = confirm("Вы уверены, что хотите удалить этого пользователя?");
    if (!confirmDelete) return;

    fetch(`${apiUrl}/${userId}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Ошибка при удалении пользователя.");
            }
            alert("Пользователь успешно удален.");
            fetchAttendance();
        })
        .catch(error => {
            console.error("Ошибка удаления пользователя:", error);
            alert("Ошибка при удалении пользователя.");
        });
}

// Сортировка по имени
function sortUsersByFullName() {
    const sortedData = [...usersData].sort((a, b) => a.full_name.localeCompare(b.full_name));
    renderTable(sortedData);
}

// Сортировка по роли
function sortUsersByRole() {
    const sortedData = [...usersData].sort((a, b) => a.roles.name.localeCompare(b.roles.name));
    renderTable(sortedData);
}

function updateRowCount(count) {
    document.getElementById("row-count").textContent = count;
}

// Фильтрация пользователей
function filterUsers() {
    const keyword = document.getElementById("keyword").value.toLowerCase();
    const selectedRole = document.getElementById("filter-status").value;

    let filteredData = usersData;

    // Фильтрация по ключевому слову
    if (keyword) {
        filteredData = filteredData.filter(user =>
            user.username.toLowerCase().includes(keyword) ||
            user.full_name.toLowerCase().includes(keyword) ||
            user.email.toLowerCase().includes(keyword) ||
            user.phone.includes(keyword)
        );
    }

    // Фильтрация по роли
    if (selectedRole) {
        filteredData = filteredData.filter(user => user.roles.name === selectedRole);
    }

    renderTable(filteredData);
}

// Сброс фильтров
function resetFilters() {
    document.getElementById("keyword").value = "";
    document.getElementById("filter-status").value = "";
    renderTable(usersData);
}

document.addEventListener("DOMContentLoaded", () => {
    fetchUsers();
});