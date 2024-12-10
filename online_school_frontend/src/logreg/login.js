document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");

    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault(); // Предотвращаем стандартное поведение формы
        event.stopPropagation();

        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        try {
            const response = await fetch("http://localhost:8086/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }) // Отправляем данные пользователя
            });

            if (response.ok) {
                alert("Вход выполнен успешно!");
                window.location.href = "/attendance";
            } else {
                const error = await response.text();
                alert(`Ошибка: ${error}`);
            }
        } catch (error) {
            console.error("Ошибка:", error);
            alert("Ошибка подключения к серверу.");
        }
    });
});
