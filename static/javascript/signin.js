// sign in form
document.getElementById('signInForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const si_errorMessage = document.getElementById('si-error-message');
    const signInForm = document.getElementById('signInForm');
    const signInFormData = new FormData(signInForm);
    fetch("/sign-in", {
        method: "POST",
        body: signInFormData,
        headers: {
            "X-CSRFToken": getCookie("csrftokenhm") 
        }
})
        .then(response => {return response.json();})
        .then(data => {
            console.log("response text is",data);
            if (data.success) {
                si_errorMessage.style.display = 'none';
                location.reload();
                // Close the modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('signInModal'));
                modal.hide();
            } else{
                si_errorMessage.style.display = 'block';
                signInForm.reset()
            }
            
        })
        .catch(error => {
            console.error("Error:", error);
        }
        );
});
