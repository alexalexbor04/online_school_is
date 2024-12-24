import {getAuthHeaders, deleteRecord, updateRowCount, closeModal, configUserLink} from "../app_funcs.js"

const apiUrl = "http://localhost:8086/admin/users";

export { fetchUsers, renderTable, openEditModal, saveUserRole, deleteUser,
    resetFilters, filterAndSortUsers };

window.getAuthHeaders = getAuthHeaders;
window.fetchAttendance = fetchUsers;
window.renderTable = renderTable;
window.openEditModal = openEditModal;
window.saveUserRole = saveUserRole;
window.deleteUser = deleteUser;
window.resetFilters = resetFilters;
window.filterAndSortUsers = filterAndSortUsers;

let usersData = [];

function fetchUsers() {
    const userRole = getUserRole();
    if (userRole !== "admin") {
        alert("Страница недоступна.")
        window.location.href = "/schedule";
    } else {
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
                window.location.href = "/auth/login";
            });
    }

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
                <td>${item.id || "Нет"}</td>
                <td>${item.username || "Нет"}</td>
                <td>${item.roles.name || "Нет"}</td>
                <td>${item.full_name || "Нет"}</td>
                <td>${item.email || "Нет"}</td>
                <td>${item.phone || "Нет"}</td>
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
            .then(user => {
                document.getElementById("edit-user-id").value = user.id;
                document.getElementById("edit-username").value = user.username;
                document.getElementById("edit-role").value = user.roles.name;

                document.getElementById("edit-modal-users").style.display = "block";
            })
            .catch(error => {
                console.error("Error fetching users for edit:", error);
                alert("Ошибка запроса на редактирование.")
            });
    }
}

function saveUserRole() {
    const userId = document.getElementById("edit-user-id").value;
    const newRole = document.getElementById("edit-role").value;

    const userRole = getUserRole();
    if (userRole !== "admin" && userRole !== "teacher") {
        alert("У вас нет прав на редактирование.");
    } else {
        fetch(`${apiUrl}/${userId}/changeRole`, {
            method: "PUT",
            headers: getAuthHeaders(),
            body: JSON.stringify({role: newRole})
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Ошибка при обновлении роли пользователя.");
                }
                alert("Роль пользователя обновлена.");
                closeModal("edit-modal-users");
                fetchAttendance();
            })
            .catch(error => {
                console.error("Ошибка сохранения роли пользователя:", error);
                alert("Ошибка сохранения изменений.");
            });
    }
}

function deleteUser(userId) {
    const userRole = getUserRole();
    if (userRole !== "admin") {
        alert("У вас нет прав на удаление пользователей.");
    } else {
        deleteRecord(userId, apiUrl, fetchUsers);
    }
}

function filterAndSortUsers(sortBy = null) {
    const keyword = document.getElementById("keyword").value.toLowerCase();
    const selectedRole = document.getElementById("filter-status").value;

    let filteredData = usersData;

    filteredData = filteredData.filter(user => {
        return (
            (!keyword ||
                user.username.toLowerCase().includes(keyword) ||
                user.full_name.toLowerCase().includes(keyword) ||
                user.email.toLowerCase().includes(keyword) ||
                user.phone.includes(keyword)) &&
            (!selectedRole || user.roles.name === selectedRole)
        );
    });

    if (sortBy) {
        switch (sortBy) {
            case "fullName":
                filteredData.sort((a, b) => a.full_name.localeCompare(b.full_name));
                break;
            case "role":
                filteredData.sort((a, b) => a.roles.name.localeCompare(b.roles.name));
                break;
            default:
                break;
        }
    }

    renderTable(filteredData);
}

function resetFilters() {
    document.getElementById("keyword").value = "";
    document.getElementById("filter-status").value = "";
    renderTable(usersData);
}

document.addEventListener("DOMContentLoaded", () => {
    fetchUsers();
    configUserLink();
});