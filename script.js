// Changer de page
function showPage(pageId) {

  // ==============================
// K-STORY - script.js
// ==// ======================================================
// K-STORY — script.js
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

    if (selectedPage) {
        selectedPage.classList.add("active");
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

    // Actualiser la liste quand on ouvre Histoires
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
        console.error("Erreur lors de la récupération des histoires :", error);
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

    // Le site peut utiliser storyList OU storiesList
    const container =
        document.getElementById("storyList") ||
        document.getElementById("storiesList");

    if (!container) {
        return;
    }

    const stories = getStories();

    // Aucune histoire
    if (stories.length === 0) {

        container.innerHTML = `
            <div class="empty">
                <h3>📖 Aucune histoire publiée</h3>
                <p>Sois la première à publier une histoire sur K-Story !</p>
            </div>
        `;

        return;
    }

    container.innerHTML = "";

    // Afficher chaque histoire
    stories.forEach(function(story, index) {

        const card = document.createElement("article");

        card.className = "story-card";

        card.innerHTML = `
            <h3>📖 ${escapeHTML(story.title)}</h3>

            <p class="author">
                ✍️ Par ${escapeHTML(story.author || "Auteur inconnu")}
            </p>

            <p>
                ${escapeHTML(
                    story.description ||
                    "Une nouvelle histoire à découvrir..."
                )}
            </p>

            <button onclick="readStory(${index})">
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

    // Compatible avec plusieurs versions de ton formulaire
    const titleInput =
        document.getElementById("title") ||
        document.getElementById("storyTitle");

    const authorInput =
        document.getElementById("author");

    const descriptionInput =
        document.getElementById("description") ||
        document.getElementById("storyDescription");

    const contentInput =
        document.getElementById("content") ||
        document.getElementById("storyContent");


    if (!titleInput || !contentInput) {
        alert("⚠️ Le formulaire d'histoire est introuvable.");
        return;
    }


    const title = titleInput.value.trim();

    const author = authorInput
        ? authorInput.value.trim()
        : "Auteur";

    const description = descriptionInput
        ? descriptionInput.value.trim()
        : "";

    const content = contentInput.value.trim();


    // Vérification
    if (!title) {
        alert("⚠️ Écris le titre de ton histoire.");
        return;
    }

    if (!content) {
        alert("⚠️ Écris le contenu de ton histoire.");
        return;
    }


    // Nouvelle histoire
    const newStory = {

        title: title,

        author: author || "Auteur",

        description: description,

        content: content,

        date: new Date().toLocaleDateString("fr-FR")
    };


    // Récupérer les histoires existantes
    const stories = getStories();

    // Ajouter la nouvelle histoire au début
    stories.unshift(newStory);

    // Sauvegarder
    saveStories(stories);


    // Vider le formulaire
    const form = document.getElementById("storyForm");

    if (form) {
        form.reset();
    } else {
        titleInput.value = "";

        if (authorInput) {
            authorInput.value = "";
        }

        if (descriptionInput) {
            descriptionInput.value = "";
        }

        contentInput.value = "";
    }


    alert("🎉 Ton histoire a été publiée sur K-Story !");


    // Afficher les histoires
    displayStories();

    // Aller automatiquement dans Histoires
    showPage("histoires");
}


// ======================================================
// LIRE UNE HISTOIRE
// ======================================================

function readStory(index) {

    const stories = getStories();

    if (!stories[index]) {

        alert("⚠️ Cette histoire n'existe pas.");

        return;
    }


    // Enregistrer l'histoire choisie
    localStorage.setItem(
        CURRENT_STORY_KEY,
        JSON.stringify(stories[index])
    );


    // Si lire.html existe
    window.location.href = "lire.html";
}


// ======================================================
// AFFICHER L'HISTOIRE SUR lire.html
// ======================================================

function displayCurrentStory() {

    const titleElement =
        document.getElementById("readTitle");

    const descriptionElement =
        document.getElementById("readDescription");

    const contentElement =
        document.getElementById("readContent");


    if (!titleElement || !contentElement) {
        return;
    }


    try {

        const savedStory =
            localStorage.getItem(CURRENT_STORY_KEY);


        if (!savedStory) {

            titleElement.textContent =
                "Histoire introuvable";

            contentElement.textContent =
                "Cette histoire n'a pas pu être trouvée.";

            return;
        }


        const story =
            JSON.parse(savedStory);


        titleElement.textContent =
            story.title || "Sans titre";


        if (descriptionElement) {

            descriptionElement.textContent =
                story.description || "";
        }


        contentElement.innerHTML =
            escapeHTML(story.content || "")
            .replace(/\n/g, "<br>");

    } catch (error) {

        console.error(
            "Erreur lors de la lecture :",
            error
        );

        titleElement.textContent =
            "Erreur";

        contentElement.textContent =
            "Impossible d'afficher cette histoire.";
    }
}


// ======================================================
// RECHERCHE D'HISTOIRES
// ======================================================

function searchStories() {

    const searchInput =
        document.getElementById("searchInput");

    const container =
        document.getElementById("storyList") ||
        document.getElementById("storiesList");


    if (!searchInput || !container) {
        return;
    }


    const search =
        searchInput.value
            .toLowerCase()
            .trim();


    const stories =
        getStories();


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
                <h3>🔎 Aucune histoire trouvée</h3>
                <p>Essaie avec un autre mot.</p>
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
            <h3>📖 ${escapeHTML(story.title)}</h3>

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

            <button onclick="readStory(${originalIndex})">
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

        // Afficher l'histoire à lire
        displayCurrentStory();


        // Recherche
        const searchInput =
            document.getElementById("searchInput");


        if (searchInput) {

            searchInput.addEventListener(
                "input",
                searchStories
            );
        }


        // Formulaire de publication
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
);============================

const STORAGE_KEY = "kstory_histoires";

// Récupérer les histoires enregistrées
function getStories() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch (error) {
        return [];
    }
}

// Enregistrer les histoires
function saveStories(stories) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stories));
}

// Afficher les histoires
function displayStories() {
    const container = document.getElementById("storiesList");

    if (!container) return;

    const stories = getStories();

    if (stories.length === 0) {
        container.innerHTML = `
            <div class="empty">
                <h3>Aucune histoire publiée 📖</h3>
                <p>Sois la première à publier une histoire sur K-Story !</p>
            </div>
        `;
        return;
    }

    container.innerHTML = "";

    stories.forEach((story, index) => {
        const card = document.createElement("div");
        card.className = "story-card";

        card.innerHTML = `
            <h3>${escapeHTML(story.title)}</h3>
            <p>${escapeHTML(story.description || "Une nouvelle histoire à découvrir...")}</p>
            <button onclick="readStory(${index})">
                📖 Lire
            </button>
        `;

        container.appendChild(card);
    });
}

// Publier une histoire
function publishStory() {
    const titleInput = document.getElementById("storyTitle");
    const descriptionInput = document.getElementById("storyDescription");
    const contentInput = document.getElementById("storyContent");

    if (!titleInput || !contentInput) return;

    const title = titleInput.value.trim();
    const description = descriptionInput
        ? descriptionInput.value.trim()
        : "";
    const content = contentInput.value.trim();

    if (!title) {
        alert("Écris le titre de ton histoire.");
        return;
    }

    if (!content) {
        alert("Écris le contenu de ton histoire.");
        return;
    }

    const stories = getStories();

    stories.push({
        title: title,
        description: description,
        content: content,
        date: new Date().toLocaleDateString("fr-FR")
    });

    saveStories(stories);

    alert("🎉 Ton histoire a été publiée !");

    titleInput.value = "";

    if (descriptionInput) {
        descriptionInput.value = "";
    }

    contentInput.value = "";

    displayStories();
}

// Lire une histoire
function readStory(index) {
    const stories = getStories();

    if (!stories[index]) {
        alert("Cette histoire n'existe pas.");
        return;
    }

    const story = stories[index];

    localStorage.setItem(
        "kstory_histoire_actuelle",
        JSON.stringify(story)
    );

    window.location.href = "lire.html";
}

// Afficher l'histoire sélectionnée
function displayCurrentStory() {
    const titleElement = document.getElementById("readTitle");
    const descriptionElement = document.getElementById("readDescription");
    const contentElement = document.getElementById("readContent");

    if (!titleElement || !contentElement) return;

    try {
        const story = JSON.parse(
            localStorage.getItem("kstory_histoire_actuelle")
        );

        if (!story) {
            titleElement.textContent = "Histoire introuvable";
            contentElement.textContent =
                "Cette histoire n'a pas pu être trouvée.";
            return;
        }

        titleElement.textContent = story.title;

        if (descriptionElement) {
            descriptionElement.textContent =
                story.description || "";
        }

        contentElement.innerHTML =
            escapeHTML(story.content).replace(/\n/g, "<br>");
    } catch (error) {
        titleElement.textContent = "Histoire introuvable";
        contentElement.textContent =
            "Une erreur est survenue.";
    }
}

// Recherche d'histoires
function searchStories() {
    const searchInput = document.getElementById("searchInput");
    const container = document.getElementById("storiesList");

    if (!searchInput || !container) return;

    const search = searchInput.value.toLowerCase().trim();
    const stories = getStories();

    const results = stories.filter(story =>
        story.title.toLowerCase().includes(search) ||
        (story.description || "").toLowerCase().includes(search)
    );

    container.innerHTML = "";

    if (results.length === 0) {
        container.innerHTML = `
            <div class="empty">
                <h3>Aucune histoire trouvée 🔎</h3>
                <p>Essaie avec un autre mot.</p>
            </div>
        `;
        return;
    }

    results.forEach(story => {
        const originalIndex = stories.indexOf(story);

        const card = document.createElement("div");
        card.className = "story-card";

        card.innerHTML = `
            <h3>${escapeHTML(story.title)}</h3>
            <p>${escapeHTML(story.description || "")}</p>
            <button onclick="readStory(${originalIndex})">
                📖 Lire
            </button>
        `;

        container.appendChild(card);
    });
}

// Protection du texte affiché
function escapeHTML(text) {
    const div = document.createElement("div");
    div.textContent = text || "";
    return div.innerHTML;
}

// Navigation
function goTo(page) {
    window.location.href = page;
}

// Initialisation automatique
document.addEventListener("DOMContentLoaded", () => {
    displayStories();
    displayCurrentStory();

    const searchInput = document.getElementById("searchInput");

    if (searchInput) {
        searchInput.addEventListener("input", searchStories);
    }
});const pages = document.querySelectorAll(".page");

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
}


// Récupérer les histoires enregistrées
function getStories() {

  const stories = localStorage.getItem("kstory_stories");

  if (stories) {
    return JSON.parse(stories);
  }

  return [];
}


// Afficher les histoires
function displayStories() {

  const storyList = document.getElementById("storyList");

  const stories = getStories();

  if (stories.length === 0) {

    storyList.innerHTML =
      "<p>Aucune histoire publiée pour le moment.</p>";

    return;
  }

  storyList.innerHTML = "";

  stories.forEach(function(story) {

    const card = document.createElement("article");

    card.className = "story-card";

    card.innerHTML = `
      <h3>📖 ${escapeHTML(story.title)}</h3>

      <p class="author">
        ✍️ Par ${escapeHTML(story.author)}
      </p>

      <p>
        ${escapeHTML(story.description)}
      </p>

      <hr>

      <div class="story-content">
        ${escapeHTML(story.content)}
      </div>
    `;

    storyList.appendChild(card);
  });
}


// Empêcher l'injection de code HTML
function escapeHTML(text) {

  const div = document.createElement("div");

  div.textContent = text;

  return div.innerHTML;
}


// Publication d'une histoire
document.getElementById("storyForm").addEventListener(
  "submit",
  function(event) {

    event.preventDefault();

    const title =
      document.getElementById("title").value.trim();

    const author =
      document.getElementById("author").value.trim();

    const description =
      document.getElementById("description").value.trim();

    const content =
      document.getElementById("content").value.trim();


    if (!title || !author || !description || !content) {

      alert("⚠️ Merci de remplir tous les champs.");

      return;
    }


    const newStory = {

      title: title,

      author: author,

      description: description,

      content: content,

      date: new Date().toLocaleDateString("fr-FR")
    };


    const stories = getStories();

    stories.unshift(newStory);

    localStorage.setItem(
      "kstory_stories",
      JSON.stringify(stories)
    );


    document.getElementById("storyForm").reset();


    alert("🎉 Ton histoire a été publiée sur K-Story !");


    displayStories();

    showPage("histoires");

  }
);


// Charger les histoires au démarrage
displayStories();
