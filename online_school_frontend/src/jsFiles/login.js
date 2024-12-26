document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");

    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        event.stopPropagation();

        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        try {
            const response = await fetch("http://localhost:8086/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password })
            });

            const errorMessage = document.getElementById("error-message");

            if (response.ok) {
                const responseData = await response.json();
                const token = responseData.token;
                localStorage.setItem("token", token);
                alert("Авторизация прошла успешно!");
                window.location.href = "/attendance";
            } else if (response.status === 401) {
                errorMessage.textContent = "Неправильное имя пользователя или пароль.";
                errorMessage.style.display = "block";
            } else {
                errorMessage.textContent = "Неизвестная ошибка! Попробуйте снова.";
                errorMessage.style.display = "block";
            }
        } catch (error) {
            console.error("Ошибка:", error);
            alert("Ошибка подключения к серверу");
        }

    });
});
