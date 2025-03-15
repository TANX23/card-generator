let selectedCard = null;

document.querySelector(".custom-file-label").addEventListener("click", function (event) {
    event.preventDefault(); // Prevent double triggering
    document.getElementById("image").click(); // Manually trigger file selection
});

document.getElementById("image").addEventListener("change", function () {
    let fileName = this.files.length > 0 ? this.files[0].name : "No file chosen";
    document.getElementById("file-name").textContent = fileName;
});

document.getElementById("image").addEventListener("change", function (event) {
    let reader = new FileReader();
    reader.onload = function () {
        let img = document.getElementById("image-preview");
        let label = document.getElementById("preview-label");

        img.src = reader.result;
        img.style.display = "block";
        label.style.top = "10px"; // Geser label ke atas
        label.style.fontSize = "12px";
        label.style.color = "#222";
    };
    reader.readAsDataURL(event.target.files[0]);
});

function addCard() {
    let title = document.getElementById('title').value.trim();
    let description = document.getElementById('description').value.trim();
    let imageSrc = document.getElementById('image').src;
    let label = document.getElementById('preview-label');

    if (title === "" || description === "" || imageSrc === "") {
        showPopup("Tidak boleh ada yang kosong!");
        return;
    }

    let newCard = { title, description, imageSrc };
    let cards = JSON.parse(localStorage.getItem("cards")) || [];
    cards.push(newCard);
    localStorage.setItem("cards", JSON.stringify(cards));

    createCardElement(title, description, imageSrc);

    document.getElementById('title').value = "";
    document.getElementById('description').value = "";
    document.getElementById('image').value = "";
    document.getElementById('image-preview').src = "";
    document.getElementById('image-preview').style.display = "none";
    document.getElementById("file-name").textContent = "No Choosen File";

    label.style.top = "50%";
    label.style.fontSize = "14px";
    label.style.color = "#555";

}

function showPopup(message) {
    let popup = document.createElement("div");
    popup.className = "popup-message";
    popup.textContent = message;

    document.body.appendChild(popup);

    setTimeout(() => {
        popup.remove();
    }, 3000);
}

function createCardElement(title, description, imageSrc) {
    let cardContainer = document.getElementById("card-container");

    let card = document.createElement("div");
    card.classList.add("card");

    let cardImage = document.createElement("img");
    cardImage.src = imageSrc;

    let cardTitle = document.createElement("h3");
    cardTitle.textContent = title;

    let cardDesc = document.createElement("p");
    cardDesc.textContent = description;

    let editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.onclick = function () { openEditPopup(card, title, description); };

    let deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.onclick = function () { openDeletePopup(card); };

    card.appendChild(cardImage);
    card.appendChild(cardTitle);
    card.appendChild(cardDesc);
    card.appendChild(editButton);
    card.appendChild(deleteButton);
    cardContainer.appendChild(card);
}

function openEditPopup(card, title, description) {
    selectedCard = card;
    document.getElementById("edit-title").value = title;
    document.getElementById("edit-description").value = description;
    document.getElementById("edit-popup").style.display = "block";
}

function saveEdit() {
    if (selectedCard) {
        selectedCard.querySelector("h3").textContent = document.getElementById("edit-title").value;
        selectedCard.querySelector("p").textContent = document.getElementById("edit-description").value;

        updateLocalStorage();
        closePopup("edit-popup");
    }
}

function openDeletePopup(card) {
    selectedCard = card;
    document.getElementById("delete-popup").style.display = "block";
}

function confirmDelete() {
    if (selectedCard) {
        selectedCard.remove();
        updateLocalStorage();
        closePopup("delete-popup");
    }
}

function closePopup(id) {
    document.getElementById(id).style.display = "none";
}

function updateLocalStorage() {
    let cards = [];
    document.querySelectorAll(".card").forEach(card => {
        let title = card.querySelector("h3").textContent;
        let description = card.querySelector("p").textContent;
        let imageSrc = card.querySelector("img").src;
        cards.push({ title, description, imageSrc });
    });
    localStorage.setItem("cards", JSON.stringify(cards));
}

window.onload = function () {
    let savedCards = JSON.parse(localStorage.getItem("cards")) || [];
    savedCards.forEach(card => createCardElement(card.title, card.description, card.imageSrc));
};
