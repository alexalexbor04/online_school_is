document.addEventListener("DOMContentLoaded", () => {
    // Проверяем статус /auth/login
    fetch("http://localhost:8086/auth/login")
        .then(response => {
            if (response.ok) {
                console.log("Статус входа получен: Ожидание входа");
                renderLoginForm();
            } else {
                console.error("Ошибка при получении статуса входа:", response.status);
                alert("Не удалось загрузить страницу входа.");
            }
        })
        .catch(error => {
            console.error("Ошибка подключения к серверу:", error);
            alert("Ошибка подключения к серверу.");
        });
});

// Функция для отображения формы входа
function renderLoginForm() {
    const container = document.body; // Можно заменить на конкретный div

    container.innerHTML = `
        <h1>Вход</h1>
        <form id="login-form">
            <label for="username">Имя пользователя:</label>
            <input type="text" id="username" name="username" required>
            <br>
            <label for="password">Пароль:</label>
            <input type="password" id="password" name="password" required>
            <br>
            <button type="submit">Войти</button>
        </form>
    `;

    const loginForm = document.getElementById("login-form");
    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        try {
            const response = await fetch("http://localhost:8086/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password })
            });

            if (response.ok) {
                alert("Вход выполнен успешно!");
                window.location.href = "/attendance"; // Перенаправление на другую страницу
            } else {
                const error = await response.text();
                alert(`Ошибка: ${error}`);
            }
        } catch (error) {
            console.error("Ошибка:", error);
            alert("Ошибка подключения к серверу.");
        }
    });
}
