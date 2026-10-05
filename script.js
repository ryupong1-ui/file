let files = [];
let currentCategory = "all";

const fileList = document.getElementById("fileList");
const searchInput = document.getElementById("searchInput");
const fileCount = document.getElementById("fileCount");
const emptyState = document.getElementById("emptyState");

const modal = document.getElementById("downloadModal");
const modalClose = document.getElementById("modalClose");

const modalIcon = document.getElementById("modalIcon");
const modalTitle = document.getElementById("modalTitle");
const modalDescription = document.getElementById("modalDescription");
const modalVersion = document.getElementById("modalVersion");
const modalSize = document.getElementById("modalSize");
const modalType = document.getElementById("modalType");
const downloadButton = document.getElementById("downloadButton");


// YEAR

document.getElementById("year").textContent =
    new Date().getFullYear();


// LOAD FILES

async function loadFiles() {

    try {

        const response = await fetch("files.json");

        if (!response.ok) {
            throw new Error("Cannot load files.json");
        }

        files = await response.json();

        renderFiles();

    } catch (error) {

        console.error(error);

        fileList.innerHTML = `
            <div class="empty-state" style="display:block">
                <div>⚠️</div>
                <h3>โหลดข้อมูลไม่ได้</h3>
                <p>ตรวจสอบไฟล์ files.json</p>
            </div>
        `;

    }

}


// RENDER

function renderFiles() {

    const search =
        searchInput.value
            .trim()
            .toLowerCase();

    const filtered =
        files.filter(file => {

            const matchCategory =
                currentCategory === "all" ||
                file.category === currentCategory;

            const text =
                `${file.name}
                ${file.description}
                ${file.version}
                ${file.type}`.toLowerCase();

            const matchSearch =
                text.includes(search);

            return matchCategory && matchSearch;

        });


    fileCount.textContent =
        `${filtered.length} ไฟล์`;


    fileList.innerHTML = "";


    if (filtered.length === 0) {

        emptyState.style.display = "block";

        return;

    }


    emptyState.style.display = "none";


    filtered.forEach(file => {

        const card =
            document.createElement("div");

        card.className = "file-card";


        card.innerHTML = `

            <div class="file-icon">
                ${file.icon || "📦"}
            </div>

            <div class="file-info">

                <h3>${escapeHTML(file.name)}</h3>

                <p>
                    ${escapeHTML(file.description || "")}
                </p>

                <div class="file-meta">

                    <span>
                        ${escapeHTML(file.version || "-")}
                    </span>

                    <span>•</span>

                    <span>
                        ${escapeHTML(file.size || "-")}
                    </span>

                    <span>•</span>

                    <span>
                        ${escapeHTML(file.type || "-")}
                    </span>

                </div>

            </div>

            <button
                class="download-small"
                data-id="${escapeHTML(file.id)}"
            >
                ดาวน์โหลด
            </button>

        `;


        const button =
            card.querySelector(".download-small");


        button.addEventListener(
            "click",
            () => openDownload(file)
        );


        fileList.appendChild(card);

    });

}


// OPEN DOWNLOAD

function openDownload(file) {

    modalIcon.textContent =
        file.icon || "📦";

    modalTitle.textContent =
        file.name;

    modalDescription.textContent =
        file.description || "";

    modalVersion.textContent =
        file.version || "-";

    modalSize.textContent =
        file.size || "-";

    modalType.textContent =
        file.type || "-";


    downloadButton.href =
        file.url;

    downloadButton.setAttribute(
        "download",
        ""
    );


    modal.classList.add("show");

}


// CLOSE MODAL

function closeModal() {

    modal.classList.remove("show");

}


modalClose.addEventListener(
    "click",
    closeModal
);


document
    .querySelector(".modal-backdrop")
    .addEventListener(
        "click",
        closeModal
    );


document.addEventListener(
    "keydown",
    event => {

        if (event.key === "Escape") {
            closeModal();
        }

    }
);


// SEARCH

searchInput.addEventListener(
    "input",
    renderFiles
);


// CATEGORY

document
    .querySelectorAll(".category")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                document
                    .querySelectorAll(".category")
                    .forEach(item =>
                        item.classList.remove("active")
                    );


                button.classList.add("active");


                currentCategory =
                    button.dataset.category;


                renderFiles();

            }
        );

    });


// ESCAPE HTML

function escapeHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


// START

loadFiles();
