document.getElementById('signUpForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent form submission
    const su_errorMessage = document.getElementById('su-error-message');
    const signUpForm = document.getElementById("signUpForm");
    const signUpFormData = new FormData(signUpForm);


    fetch("sign-up", {
        method: "POST",
        body: signUpFormData,
        headers: {
            "X-CSRFToken": getCookie("csrftokenhm") 
        }
    })
        .then(response => { return response.json() })
        .then(data => {
            if (data.success) {
                su_errorMessage.style.display = 'none';
                location.reload();
                const modal = bootstrap.Modal.getInstance(document.getElementById('signUpModal'));
                modal.hide();
            }
            else {
                su_errorMessage.style.display = 'block';
                signUpForm.reset();

            }

        });

});
