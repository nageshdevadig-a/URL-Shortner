//cookie getting

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// Get references to the form and the target element
const shortUrlField = document.getElementById('short-url');
const target = document.getElementById('pre-url');

// Add focus and blur event listeners
shortUrlField.addEventListener('focus', () => {
    target.style.border = "2px solid #0159c5";
    target.style.borderRight = "none";

});

shortUrlField.addEventListener('blur', () => {
    target.style.border = "1px solid #0073ff";
    target.style.borderRight = "none";
});



// Scipt code for URl form

const shortUrlInput = document.getElementById("short-url");
const availabilityMessage = document.getElementById("availability-message");
const generateRandomButton = document.getElementById("generate-random");
const form = document.getElementById("url-form");

// Function to simulate URL availability check
async function checkAvailability(urlSuffix) {
    try {
        const response = await fetch("check-available", {
            method: "POST",
            body: JSON.stringify({ "urlSuffix": urlSuffix }),
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": getCookie("csrftokenhm")
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data.avalb;
    } catch (error) {
        console.error("Error while checking availability:", error);
        return false;
    }
}

// Debounce function to limit the frequency of calls
function debounce(func, delay) {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
}

// Event Listener for Short URL Input
shortUrlInput.addEventListener(
    "input",
    debounce(async () => {
        const enteredValue = shortUrlInput.value.trim();

        if (enteredValue.includes(" ")) {
            availabilityMessage.textContent = "Spaces are not allowed!";
            availabilityMessage.style.color = "red";
            availabilityMessage.style.visibility = "visible";
            document.getElementById("url-form-btn").disabled = true;
            return;
        }

        if (enteredValue.length >= 8) {
            const isAvailable = await checkAvailability(enteredValue);
            availabilityMessage.textContent = isAvailable
                ? "✔️ Available!"
                : "❌ Not available.";
            availabilityMessage.style.color = isAvailable ? "green" : "red";
            document.getElementById("url-form-btn").disabled = isAvailable? false : true;
            availabilityMessage.style.visibility = "visible";
        } else if (enteredValue) {
            availabilityMessage.textContent = "Minimum 8 characters required!";
            availabilityMessage.style.color = "#0159c5";
            availabilityMessage.style.visibility = "visible";
            document.getElementById("url-form-btn").disabled = true;
        } else {
            availabilityMessage.style.visibility = "hidden";
            document.getElementById("url-form-btn").disabled = true;
        }
    }, 300) // Debounce delay of 300ms
);

// Generate Random Suffix
generateRandomButton.addEventListener("click", async () => {
    let randomSuffix;
    let isAvailable = false;

    do {
        randomSuffix = Math.random().toString(36).substring(2, 10);
        isAvailable = await checkAvailability(randomSuffix);
    } while (!isAvailable);

    shortUrlInput.value = randomSuffix;
    availabilityMessage.textContent = "✔️ Available!";
    availabilityMessage.style.color = "green";
    document.getElementById("url-form-btn").disabled = false;
    availabilityMessage.style.visibility = "visible";
});


//submit button change to reset form code

function formRstBtncb() {
    const submitBtn = document.getElementById("url-form-btn");
    const cancelSubmit = document.getElementById("url-form-rstbtn")
    if (submitBtn) {
        submitBtn.innerText = "Create New";
        submitBtn.id = "url-form-rstbtn";
        return true;
    }
    else if(cancelSubmit){
        window.location.reload();
    }
}
// Form Submission
form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (formRstBtncb()) {
        const longUrl = document.getElementById("long-url").value.trim();
        const shortUrl = shortUrlInput.value.trim();
        document.getElementById("long-url").disabled = true;
        shortUrlInput.disabled = true;
        if (longUrl && shortUrl) {
            try {
                const response = await fetch("submit-url",
                    {
                        method: "POST",
                        body: JSON.stringify({
                            "longUrl": longUrl,
                            "shortUrl": shortUrl
                        }),
                        headers: {
                            "Content-Type": "application/json",
                            "X-CSRFToken": getCookie("csrftokenhm")
                        }
                    }
                );
                if (response.ok) {
                    const data = await response.json();
                    document.getElementById("gen-url").value = `http://127.0.0.1:8000/${data.shortUrl}`;
                    document.getElementById("gen-url-cs").classList.remove("d-none");
                    availabilityMessage.style.visibility = "hidden";
                    document.getElementById("cp-url").addEventListener("click", () => {
                        const urlText = document.getElementById("gen-url");
                        urlText.select();
                        document.execCommand("copy");

                        const copyMessage = document.getElementById("cpid");
                        copyMessage.style.visibility = "visible";
                        setTimeout(() => {
                            copyMessage.style.visibility = "hidden";
                        }, 3000);
                    });
                }

            } catch (error) {
                availabilityMessage.textContent = "❌ Failed to create link. Try again.";
                availabilityMessage.style.color = "red";

            }

        }
    }
});













