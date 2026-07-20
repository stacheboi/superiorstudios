const galleryGrid = document.querySelector("#gallery-grid");
const printSelect = document.querySelector("#print-photo");
const dialog = document.querySelector("#photo-dialog");
const dialogImage = document.querySelector("#dialog-image");
const dialogTitle = document.querySelector("#dialog-title");
const dialogDetail = document.querySelector("#dialog-detail");
const dialogPrintButton = document.querySelector("[data-dialog-print]");
const closeDialogButton = document.querySelector("[data-close-dialog]");

function renderGallery() {
  window.galleryItems.forEach((item) => {
    const card = document.createElement("article");
    card.className = "photo-card";
    card.innerHTML = `
      <button class="photo-button" type="button" aria-label="View ${item.title}">
        <img loading="lazy" src="${item.image}" alt="${item.alt}">
      </button>
      <div class="photo-meta">
        <div>
          <h3>${item.title}</h3>
          <p>${item.location} / ${item.year}</p>
        </div>
        <button class="text-button" type="button" data-print-id="${item.id}">Request Print</button>
      </div>
      <p class="price">${item.price}</p>
    `;

    card.querySelector(".photo-button").addEventListener("click", () => openPhoto(item));
    card.querySelector("[data-print-id]").addEventListener("click", () => selectPrint(item));
    galleryGrid.append(card);

    const option = document.createElement("option");
    option.value = item.title;
    option.textContent = item.title;
    printSelect.append(option);
  });
}

function openPhoto(item) {
  dialogImage.src = item.image;
  dialogImage.alt = item.alt;
  dialogTitle.textContent = item.title;
  dialogDetail.textContent = `${item.location} / ${item.year} / ${item.price}`;
  dialogPrintButton.onclick = () => {
    selectPrint(item);
    dialog.close();
  };
  dialog.showModal();
}

function selectPrint(item) {
  printSelect.value = item.title;
  document.querySelector("#prints").scrollIntoView({ behavior: "smooth", block: "start" });
}

function attachFormHandlers() {
  document.querySelectorAll("form").forEach((form) => {
    form.addEventListener("submit", (event) => {
      if (!form.checkValidity()) {
        return;
      }

      const isLocalPreview =
        window.location.protocol === "file:" ||
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1";

      if (isLocalPreview) {
        event.preventDefault();
        form.reset();
        const status = form.querySelector("[data-form-status]");
        status.textContent =
          "Request captured for preview. On a hosted site, this form will submit to your configured form service.";
      }
    });
  });
}

closeDialogButton.addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) {
    dialog.close();
  }
});

renderGallery();
attachFormHandlers();
