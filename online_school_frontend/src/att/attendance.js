import axios from "axios";

const data = axios
    .get("http://localhost:8086/attendance", { withCredentials: true })
    .then((res) => {
        const body = document.getElementById('body_id');
        body.innerHTML = JSON.stringify(res.data, null, 2);
        console.log(res.data)
    });


