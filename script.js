// ======================================================
// K-STORY — script.js
// ======================================================

const STORAGE_KEY = "kstory_stories";
const CURRENT_STORY_KEY = "kstory_current_story";

// ======================================================
// NAVIGATION
// ======================================================

function showPage(pageId) {

const pages = document.querySelectorAll(".page");

pages.forEach(function(page) {
    page.classList.remove("active");
});

const selectedPage = document.getElementById(pageId);

if (selectedPage) {
    selectedPage.classList.add("active");
}

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

    const stories = localStorage.getItem(STORAGE_KEY);

    if (!stories) {
        return [];
    }

    return JSON.parse(stories);

} catch (error) {

    console.error("Erreur :", error);

    return [];
}

}

// ======================================================
// SAUVEGARDER LES HISTOIRES
// ======================================================

function saveStories(stories) {

localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(stories)
);

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

const container = document.getElementById("storyList");

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
        </div>
    `;

    return;
}

container.innerHTML = "";

stories.forEach(function(story, index) {

    const card = document.createElement("article");

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

        <p>
            ${escapeHTML(
                story.description ||
                "Une nouvelle histoire à découvrir..."
            )}
        </p>

        <button
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

    return;
}


if (!author) {

    alert(
        "⚠️ Écris ton nom d'auteur."
    );

    return;
}


if (!description) {

    alert(
        "⚠️ Ajoute une description."
    );

    return;
}


if (!content) {

    alert(
        "⚠️ Écris ton histoire."
    );

    return;
}


const newStory = {

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
    "🎉 Ton histoire a été publiée sur K-Story !"
);


displayStories();

showPage("histoires");

}

// ======================================================
// LIRE UNE HISTOIRE
// ======================================================

function readStory(index) {

const stories = getStories();

if (!stories[index]) {

    alert(
        "⚠️ Cette histoire n'existe pas."
    );

    return;
}


localStorage.setItem(
    CURRENT_STORY_KEY,
    JSON.stringify(stories[index])
);


// Afficher directement la page de lecture
const story = stories[index];

const title =
    document.getElementById("readingTitle");

const author =
    document.getElementById("readingAuthor");

const description =
    document.getElementById("readingDescription");

const content =
    document.getElementById("readingContent");


if (
    title &&
    author &&
    description &&
    content
) {

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

    return;
}


// Solution de secours si lecture externe
window.location.href = "lire.html";

}

// ======================================================
// RECHERCHE
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

        <p>
            ${escapeHTML(
                story.description || ""
            )}
        </p>

        <button
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

    displayStories();


    const searchInput =
        document.getElementById("searchInput");


    if (searchInput) {

        searchInput.addEventListener(
            "input",
            searchStories
        );
    }


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
