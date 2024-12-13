const editCancelButton = document.getElementById("edit-cancel-profile");
const updateButton = document.getElementById("p-update");
const inputs = document.querySelectorAll("#usr-form input");

let isEditMode = false;

editCancelButton.addEventListener("click", (e) => {
    if (!isEditMode) {
        isEditMode = true;
        inputs.forEach(element => {
            element.disabled = false;
        });
        editCancelButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16"><path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/></svg> Cancel';
        editCancelButton.classList.replace("btn-cl", "btn-danger");
        // document.getElementById("profile-details").style.marginRight = "500px";
        updateButton.style.visibility = "visible";

    } else {
        // Exit edit mode (Cancel action)
        isEditMode = false;
        inputs.forEach(input => input.disabled = true);
        editCancelButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square me-1" viewBox="0 0 16 16"><path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" /><path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" /></svg>edit profile';
        editCancelButton.classList.replace("btn-danger", "btn-cl");
        updateButton.style.visibility = "hidden";
        // document.getElementById("profile-details").style.marginRight = "550px";
        document.getElementById("usr-form").reset();

    }

})


document.getElementById("usr-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const upForm = document.getElementById("usr-form");
    const upFormData = new FormData(upForm);
    fetch("update-profile", {
        method: "POST",
        body: upFormData,
        headers: {
            "X-CSRFToken": getCookie("csrftokenpf")
        }
    })
        .then(resonse => { return resonse.json(); })
        .then(data => {
            let responseResult = data.success;
            const errMsg = document.getElementById("success-msg");
            errMsg.innerText = responseResult ? "Successfully saved" : "Failed to save";
            errMsg.style.visibility = "visible";
            errMsg.style.color = responseResult ? "green" : "red";
            setTimeout(() => {
                errMsg.style.visibility = "hidden";
                isEditMode = false;
                inputs.forEach(input => input.disabled = true);
                editCancelButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square me-1" viewBox="0 0 16 16"><path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" /><path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" /></svg>edit profile';
                editCancelButton.classList.replace("btn-danger", "btn-cl");
                updateButton.style.visibility = "hidden";
                // document.getElementById("profile-details").style.marginRight = "550px";
                location.reload();
            }, 1000)
        });
    // Exit edit mode after submission
});


//code for handel filterButton

const filterButton = document.getElementById("filter-btn");
const filterOption = document.getElementById("filter-search");
let isFilter = false;

filterButton.addEventListener("click", (e) => {
    if (!isFilter) {
        isFilter = true;
        filterOption.style.visibility = "visible";
    }
    else {
        isFilter = false;
        filterOption.style.visibility = "hidden";
    }

});


//handel search button stylesheet

const searchField = document.getElementById('searchInput');
const searchIcon = document.getElementById('searchIcon');

// Add focus and blur event listeners
searchField.addEventListener('focus', () => {
    searchIcon.style.border = "2px solid #001a6e";
    searchIcon.style.borderRight = "none";

});

searchField.addEventListener('blur', () => {
    searchIcon.style.border = "1px solid #074799";
    searchIcon.style.borderRight = "none";
});



//url edit on table
function editUrlFunction(row_id) {
    const editLongUrl = document.getElementById(`edit-long-url-${row_id}`);
    const editShortUrl = document.getElementById(`edit-short-url-${row_id}`);
    const editUrlButton = document.getElementById(`url-edit-button-${row_id}`);
    const cancelUrlButton = document.getElementById(`url-cancel-button-${row_id}`);
    const deleteUrlButton = document.getElementById(`delete-link-bin-${row_id}`);
    const saveButtonUrl = document.getElementById(`save-url-${row_id}`);
    if (editUrlButton) {
        editLongUrl.disabled = false;
        editShortUrl.disabled = false;
        deleteUrlButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check2-circle" viewBox="0 0 16 16">< path d = "M2.5 8a5.5 5.5 0 0 1 8.25-4.764.5.5 0 0 0 .5-.866A6.5 6.5 0 1 0 14.5 8a.5.5 0 0 0-1 0 5.5 5.5 0 1 1-11 0" /><path d="M15.354 3.354a.5.5 0 0 0-.708-.708L8 9.293 5.354 6.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0z" /></svg > ';
        deleteUrlButton.style.color = "green";
        deleteUrlButton.id = `save-url-${row_id}`;
        editUrlButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/></svg>';
        editUrlButton.style.color = "red"
        editUrlButton.id = `url-cancel-button-${row_id}`;
    } else if (cancelUrlButton) {
        // Exit edit mode (Cancel action)
        editLongUrl.disabled = true;
        editShortUrl.disabled = true;
        cancelUrlButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16"><path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" /> <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" /> </svg>';
        cancelUrlButton.style.color = "";
        saveButtonUrl.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16"> <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5" /> </svg>';
        saveButtonUrl.style.color = "";
        cancelUrlButton.id = `url-edit-button-${row_id}`;
        saveButtonUrl.id = `delete-link-bin-${row_id}`;


    }

}

function saveDeleteUrlButton(row_id) {
    const saveLongUrl = document.getElementById(`edit-long-url-${row_id}`);
    const saveShortUrl = document.getElementById(`edit-short-url-${row_id}`);
    const deleteButtonUrl = document.getElementById(`delete-link-bin-${row_id}`);
    const saveUrlButton = document.getElementById(`save-url-${row_id}`);

    if (deleteButtonUrl) {
        fetch("delete-url", {
            method: "DELETE",
            body: JSON.stringify({
                "urlID": row_id
            }),
            headers: {
                "X-CSRFToken": getCookie("csrftokenpf")
            }
        }).then(resonse => { return resonse.json(); })
            .then(data => {
                if (data.success) {
                    location.reload();
                }
                else {
                    alert("Unable to delete!");
                    location.reload();
                }

            });
    }
    else if (saveUrlButton) {
        const longurl = saveLongUrl.value;
        const shorturl = saveShortUrl.value;
        fetch("update-url", {
            method: "PUT",
            body: JSON.stringify({
                "long-url": longurl,
                "short-url": shorturl,
                "urlID": row_id
            }),
            headers: {
                "X-CSRFToken": getCookie("csrftokenpf")
            }
        }).then(response => { return response.json(); })
            .then(data => {
                if (data.success) {
                    location.reload();

                }
                else {
                    alert("Unable to update!");
                    location.reload();
                }
            }
            );
    }
}





document.getElementById("usr-form").addEventListener("submit", (e) => {
    e.preventDefault(); // Prevent actual submission for demo purposes
    // Here, you would send data to the server using fetch() or AJAX
    const upForm = document.getElementById("usr-form");
    const upFormData = new FormData(upForm);
    fetch("update-profile", {
        method: "POST",
        body: upFormData,
        headers: {
            "X-CSRFToken": getCookie("csrftokenpf")
        }
    })
        .then(resonse => { return resonse.json(); })
        .then(data => {
            let responseResult = data.success;
            const errMsg = document.getElementById("success-msg");
            errMsg.innerText = responseResult ? "Successfully saved" : "Failed to save";
            errMsg.style.visibility = "visible";
            errMsg.style.color = responseResult ? "green" : "red";
            setTimeout(() => {
                errMsg.style.visibility = "hidden";
                isEditMode = false;
                inputs.forEach(input => input.disabled = true);
                editCancelButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square me-1" viewBox="0 0 16 16"><path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" /><path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" /></svg>edit profile';
                editCancelButton.classList.replace("btn-danger", "btn-primary");
                updateButton.style.visibility = "hidden";
                document.getElementById("profile-details").style.marginRight = "550px";
                location.reload();
            }, 1000)
        });
    // Exit edit mode after submission
});


// search bar search opration:

function search() {
    const query = document.getElementById('searchInput').value.trim();

    if (query) {
        // Encode the query to ensure special characters are handled correctly
        const encodedQuery = encodeURIComponent(query);
        window.location.href = `/profile/search?q=${encodedQuery}`;
    } else {
        alert('Please enter a search term.');
    }
}

function filterSearch(query) {

    if (query) {
        // Encode the query to ensure special characters are handled correctly
        const encodedQuery = encodeURIComponent(query);
        window.location.href = `/profile/search?q=${encodedQuery}`;
    } else {
        alert('Please enter a search term.');
    }
}
// Upload profile photo to server

document.getElementById("p-edit").addEventListener('click', function () {
    document.getElementById('profilePhotoInput').click();
});

document.getElementById('profilePhotoInput').addEventListener('change', function () {
    const fileInput = document.getElementById('profilePhotoInput');
    const file = fileInput.files[0];

    if (file) {
        const formData = new FormData();
        formData.append('profile_photo', file);

        // Get CSRF token from the cookie
        const csrfToken = getCookie('csrftokenpf');
        if (!csrfToken) {
            console.error('CSRF token not found!');
            return;
        }

        fetch('upload-profile-photo/', {
            method: 'POST',
            headers: {
                'X-CSRFToken': csrfToken,
            },
            body: formData,
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Upload successful!');
                window.location.reload();
            } else {
                alert('Upload failed: ' + data.message);
                window.location.reload();
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
});