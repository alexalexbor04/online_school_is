document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.getElementById("register-form");

    registerForm.addEventListener("submit", async (event) => {
        event.preventDefault(); // Отменяем стандартное поведение формы

        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        const email = document.getElementById("email").value;

        try {
            const response = await fetch("/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password, email })
            });

            if (response.ok) {
                alert("Регистрация прошла успешно!");
                window.location.href = "login.html"; // Перенаправление на страницу входа
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
