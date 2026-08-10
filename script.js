// ======================================================
// K-STORY — script.js
// Navigation + publication + lecture + recherche
// ======================================================

const STORAGE_KEY = "kstory_stories";
const CURRENT_STORY_KEY = "kstory_current_story";

// ======================================================
// NAVIGATION ENTRE LES PAGES
// ======================================================

function showPage(pageId) {

    const pages = document.querySelectorAll(".page");

    pages.forEach(function(page) {
        page.classList.remove("active");
    });

    const selectedPage = document.getElementById(pageId);

    if (!selectedPage) {
        console.error("Page introuvable :", pageId);
        return;
    }

    selectedPage.classList.add("active");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

    if (pageId === "histoires") {
        displayStories();
    }
}

// ======================================================
// RÉCUPÉRER LES HISTOIRES
// ======================================================

function getStories() {

    try {

        const savedStories =
            localStorage.getItem(STORAGE_KEY);

        if (!savedStories) {
            return [];
        }

        const stories = JSON.parse(savedStories);

        return Array.isArray(stories)
            ? stories
            : [];

    } catch (error) {

        console.error(
            "Impossible de récupérer les histoires :",
            error
        );

        return [];
    }
}

// ======================================================
// SAUVEGARDER LES HISTOIRES
// ======================================================

function saveStories(stories) {function saveStory() {
    const title = document.getElementById("storyTitle").value.trim();
    const content = document.getElementById("storyContent").value;

    const imageElement = document.querySelector("#imagePreview img");
    const image = imageElement ? imageElement.src : "";

    if (!title || !content) {
        alert("Écris un titre et ton histoire avant de publier.");
        return;
    }

    const stories = JSON.parse(
        localStorage.getItem("kstory_stories") || "[]"
    );

    const story = {
        id: Date.now(),
        title: title,
        content: content,
        image: image,
        date: new Date().toLocaleDateString("fr-FR")
    };

    stories.push(story);

    localStorage.setItem(
        "kstory_stories",
        JSON.stringify(stories)
    );

    alert("✨ Ton histoire a été enregistrée !");

    showPage("stories");
}

    try {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(stories)
        );

    } catch (error) {

        console.error(
            "Impossible de sauvegarder les histoires :",
            error
        );

        alert(
            "⚠️ Impossible de sauvegarder cette histoire sur cet appareil."
        );
    }
}

// ======================================================
// PROTECTION DU TEXTE
// ======================================================

function escapeHTML(text) {

    const div = document.createElement("div");

    div.textContent = text || "";

    return div.innerHTML;
}

// ======================================================
// AFFICHER LES HISTOIRES
// ======================================================

function displayStories() {

    const container =
        document.getElementById("storyList");

    if (!container) {
        return;
    }

    const stories = getStories();

    if (stories.length === 0) {

        container.innerHTML = `
            <div class="empty">
                <h3>📖 Aucune histoire publiée</h3>

                <p>
                    Sois la première à publier
                    une histoire sur K-Story !
                </p>

                <button
                    class="main-button"
                    onclick="showPage('publier')">
                    ✍️ Écrire une histoire
                </button>
            </div>
        `;

        return;
    }

    container.innerHTML = "";

    stories.forEach(function(story, index) {

        const card =
            document.createElement("article");

        card.className = "story-card";

        card.innerHTML = `
            <h3>
                📖 ${escapeHTML(story.title)}
            </h3>

            <p class="author">
                ✍️ Par ${escapeHTML(
                    story.author || "Auteur"
                )}
            </p>

            <p class="description">
                ${escapeHTML(
                    story.description ||
                    "Une nouvelle histoire à découvrir..."
                )}
            </p>

            <p>
                📅 ${escapeHTML(story.date || "")}
            </p>

            <button
                type="button"
                class="read-button"
                onclick="readStory(${index})">
                📖 Lire l'histoire
            </button>
        `;

        container.appendChild(card);
    });
}

// ======================================================
// PUBLIER UNE HISTOIRE
// ======================================================

function publishStory() {

    const titleInput =
        document.getElementById("title");

    const authorInput =
        document.getElementById("author");

    const descriptionInput =
        document.getElementById("description");

    const contentInput =
        document.getElementById("content");

    if (
        !titleInput ||
        !authorInput ||
        !descriptionInput ||
        !contentInput
    ) {

        alert(
            "⚠️ Le formulaire d'histoire est introuvable."
        );

        return;
    }

    const title =
        titleInput.value.trim();

    const author =
        authorInput.value.trim();

    const description =
        descriptionInput.value.trim();

    const content =
        contentInput.value.trim();

    if (!title) {

        alert(
            "⚠️ Écris le titre de ton histoire."
        );

        titleInput.focus();

        return;
    }

    if (!author) {

        alert(
            "⚠️ Écris ton nom d'auteur."
        );

        authorInput.focus();

        return;
    }

    if (!description) {

        alert(
            "⚠️ Ajoute une description."
        );

        descriptionInput.focus();

        return;
    }

    if (!content) {

        alert(
            "⚠️ Écris ton histoire."
        );

        contentInput.focus();

        return;
    }

    const newStory = {

        id: Date.now(),

        title: title,

        author: author,

        description: description,

        content: content,

        date: new Date()
            .toLocaleDateString("fr-FR")
    };

    const stories = getStories();

    stories.unshift(newStory);

    saveStories(stories);

    const form =
        document.getElementById("storyForm");

    if (form) {
        form.reset();
    }

    alert(
        "🎉 Ton histoire a été publiée !"
    );

    showPage("histoires");
}

// ======================================================
// LIRE UNE HISTOIRE
// ======================================================

function readStory(index) {function openStory(id) {
    const stories = JSON.parse(
        localStorage.getItem("kstory_stories") || "[]"
    );

    const story = stories.find(s => s.id == id);

    if (!story) {
        alert("Histoire introuvable.");
        return;
    }

    document.getElementById("readTitle").textContent = story.title;

    document.getElementById("readContent").innerHTML =
        story.content.replace(/\n/g, "<br>");

    const imageContainer =
        document.getElementById("readImage");

    if (story.image) {
        imageContainer.innerHTML = `
            <img
                src="${story.image}"
                alt="Illustration de l'histoire"
                class="story-reading-image"
            >
        `;
    } else {
        imageContainer.innerHTML = "";
    }

    showPage("read");
                          }

    const stories = getStories();

    const story = stories[index];

    if (!story) {

        alert(
            "⚠️ Cette histoire n'existe pas."
        );

        return;
    }

    try {

        localStorage.setItem(
            CURRENT_STORY_KEY,
            JSON.stringify(story)
        );

    } catch (error) {

        console.error(error);
    }

    const title =
        document.getElementById("readingTitle");

    const author =
        document.getElementById("readingAuthor");

    const description =
        document.getElementById("readingDescription");

    const content =
        document.getElementById("readingContent");

    if (
        !title ||
        !author ||
        !description ||
        !content
    ) {

        alert(
            "⚠️ La page de lecture est introuvable."
        );

        return;
    }

    title.textContent =
        story.title || "Sans titre";

    author.textContent =
        "✍️ Par " +
        (story.author || "Auteur");

    description.textContent =
        story.description || "";

    content.innerHTML =
        escapeHTML(
            story.content || ""
        ).replace(/\n/g, "<br>");

    showPage("lecture");
}

// ======================================================
// RECHERCHE DES HISTOIRES
// ======================================================

function searchStories() {

    const searchInput =
        document.getElementById("searchInput");

    const container =
        document.getElementById("storyList");

    if (!searchInput || !container) {
        return;
    }

    const search =
        searchInput.value
            .toLowerCase()
            .trim();

    const stories = getStories();

    if (!search) {

        displayStories();

        return;
    }

    const results =
        stories.filter(function(story) {

            return (

                (story.title || "")
                    .toLowerCase()
                    .includes(search)

                ||

                (story.author || "")
                    .toLowerCase()
                    .includes(search)

                ||

                (story.description || "")
                    .toLowerCase()
                    .includes(search)
            );
        });

    container.innerHTML = "";

    if (results.length === 0) {

        container.innerHTML = `
            <div class="empty">

                <h3>
                    🔎 Aucune histoire trouvée
                </h3>

                <p>
                    Essaie avec un autre mot.
                </p>

            </div>
        `;

        return;
    }

    results.forEach(function(story) {

        const originalIndex =
            stories.indexOf(story);

        const card =
            document.createElement("article");

        card.className =
            "story-card";

        card.innerHTML = `
            <h3>
                📖 ${escapeHTML(story.title)}
            </h3>

            <p class="author">
                ✍️ Par ${escapeHTML(
                    story.author || "Auteur"
                )}
            </p>

            <p class="description">
                ${escapeHTML(
                    story.description || ""
                )}
            </p>

            <button
                type="button"
                class="read-button"
                onclick="readStory(${originalIndex})">
                📖 Lire l'histoire
            </button>
        `;

        container.appendChild(card);
    });
}

// ======================================================
// INITIALISATION
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        // Afficher les histoires
        displayStories();

        // Recherche
        const searchInput =
            document.getElementById("searchInput");

        if (searchInput) {

            searchInput.addEventListener(
                "input",
                searchStories
            );
        }

        // Formulaire
        const storyForm =
            document.getElementById("storyForm");

        if (storyForm) {

            storyForm.addEventListener(
                "submit",
                function(event) {

                    event.preventDefault();

                    publishStory();
                }
            );
        }

    }
);

// ======================================================
// RENDRE LES FONCTIONS ACCESSIBLES AUX BOUTONS HTML
// ======================================================

window.showPage = showPage;
window.publishStory = publishStory;
window.readStory = readStory;
window.searchStories = searchStories;// ======================================================
// AJOUTER UNE IMAGE DANS L'HISTOIRE
// ======================================================

const imageButton = document.getElementById("imageButton");
const storyImageInput = document.getElementById("storyImageInput");
const imagePreview = document.getElementById("imagePreview");

if (imageButton && storyImageInput) {

    imageButton.addEventListener("click", function () {
        storyImageInput.click();
    });

    storyImageInput.addEventListener("change", function () {

        const file = this.files[0];

        if (!file) {
            return;
        }

        if (!file.type.startsWith("image/")) {
            alert("Veuillez choisir une image.");
            return;
        }

        const reader = new FileReader();

        reader.onload = function (event) {

            imagePreview.innerHTML = `
                <div class="story-image">
                    <img src="${event.target.result}"
                         alt="Illustration de l'histoire">
                </div>
            `;

            imagePreview.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
        };

        reader.readAsDataURL(file);
    });
}
