const API_URL = "/api/user";

async function logout() {
    try {
        await fetch(`${API_URL}/logout`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        });
        document.location.href = "/";
    } catch (err) {
        console.log(err);
    }
}

async function sign(url) {
    let email = document.getElementById("email");
    let password = document.getElementById("password");

    if (email.value && password.value) {
        let user = {
            email: email.value,
            password: password.value,
        };

        return fetch(url, {
            method: "POST",
            body: JSON.stringify(user),
            headers: {
                "Content-Type": "application/json",
            },
        });
    }
}

async function login() {
    let login = "/login";
    let url = API_URL + login;
    try {
        let res = await sign(url);
        if (res.status === 200) {
            document.location.href = "/";
        } else {
            document.location.href = login;
        }
    } catch (err) {
        console.log("err:", err);
    }
}

async function signup() {
    let password = document.getElementById("password");
    let passwordRe = document.getElementById("password2");
    let signup = "/signup";
    let url = API_URL + signup;
    if (password.value === passwordRe.value) {
        try {
            let res = await sign(url);
            if (res.status === 200) {
                document.location.href = "/";
            } else {
                document.location.href = signup;
            }
        } catch (err) {
            console.log("err:", err);
        }
    } else {
        document.location.href = signup;
    }
}
