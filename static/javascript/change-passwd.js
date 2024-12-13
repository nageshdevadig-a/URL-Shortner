const passwdForm = document.getElementById("passwd-cng");
const dispMsg = document.getElementById("disp-msg");
const cngBtn = document.getElementById("change-passwd-btn");


cngBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    let npasswd = document.getElementById("new_password").value;
    let cnfpasswd = document.getElementById("confirm_password").value;

    if (npasswd === cnfpasswd) {
        const formData = new FormData(passwdForm);
        const response = await fetch("", {
            method: "POST",
            body: formData,
            headers: {
                "X-CSRFToken": getCookie("csrftokenpwd")
            }
        });

        const data = await response.json();
        if (data.success) {
            dispMsg.innerText = data.Msg;
            dispMsg.classList.remove("d-none")
            dispMsg.classList.replace("alert-danger","alert-success");
            setTimeout(() => {
                window.location.href = "/";
            }, 2000);
        }
        else {
            dispMsg.innerText = data.Msg;
            dispMsg.classList.remove("d-none")
            setTimeout(() => {
                dispMsg.classList.add("d-none")
            }, 1500);
        }
    }
    else if (npasswd !== cnfpasswd) {
        dispMsg.innerText = "Password must match!";
        dispMsg.classList.remove("d-none")
        setTimeout(() => {
            dispMsg.classList.add("d-none")
        }, 1500);
    }

});

