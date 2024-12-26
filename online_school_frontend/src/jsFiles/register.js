document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.getElementById("register-form");

    registerForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        const full_name = document.getElementById("full_name").value;
        const email = document.getElementById("email").value;
        const phone = document.getElementById("phone").value;

        try {
            const response = await fetch("http://localhost:8086/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password, full_name, email, phone})
            });

            if (response.ok) {
                alert("Регистрация прошла успешно!");
                window.location.href = "/auth/login";
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
