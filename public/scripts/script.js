const updateBtn = document.getElementById("update");
const editBtn = document.getElementById("edit");
const form = document.getElementById("form");

if (form && editBtn && updateBtn) {
    editBtn.addEventListener("click", () => {
        const docType = form.parentElement.id.slice(0,-4);
        
        // Show updateBtn
        updateBtn.classList.remove("hidden");

        // Enable specific inputs
        let enabledInputs = [];
        switch (docType) {
            case "anime":
                enabledInputs = ["title", "status", "genres", "type", "premiered", "episodes"];
                break;

            case "reviews":
                enabledInputs = ["rating", "comment"];
                break;

            case "users":
                enabledInputs = ["name", "email", "password"];
                break;
        
            default:
                break;
        }
        enabledInputs.forEach(input => form.elements[input].disabled = false);
    });
}