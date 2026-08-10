// ======================================================
// K-STORY 🌸
// SCRIPT COMPLET
// ======================================================

const STORAGE_KEY = "kstory_stories";
const CURRENT_STORY_KEY = "kstory_current_story";

// Image actuellement sélectionnée
let currentImage = "";

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
        console.error("Erreur de lecture :", error);
        return [];
    }
}

// ======================================================
// SAUVEGARDER LES HISTOIRES
// ======================================================

function saveStories(stories) {

    try {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(stories)
        );

    } catch (error) {

        alert(
            "Impossible de sauvegarder l'histoire. " +
            "L'image est peut-être trop grande."
        );

        console.error(error);
    }
}

// ======================================================
// CHANGER DE PAGE
// ======================================================

function showPage(pageId) {

    const pages = document.querySelectorAll(".page");

    pages.forEach(function(page) {
        page.classList.remove("active");
    });

    const page = document.getElementById(pageId);

    if (page) {
        page.classList.add("active");
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

// ======================================================
// NOUVELLE HISTOIRE
// ======================================================

function newStory() {

    document.getElementById("storyTitle").value = "";
    document.getElementById("storyText").value = "";

    currentImage = "";

    document.getElementById("imageInput").value = "";

    document.getElementById(
        "imagePreviewContainer"
    ).style.display = "none";

    document.getElementById("imagePreview").src = "";

    localStorage.removeItem(CURRENT_STORY_KEY);

    showPage("writePage");
}

// ======================================================
// CHOISIR UNE IMAGE
// ======================================================

document.addEventListener("DOMContentLoaded", function() {

    const imageInput =
        document.getElementById("imageInput");

    if (imageInput) {

        imageInput.addEventListener(
            "change",
            function(event) {

                const file = event.target.files[0];

                if (!file) {
                    return;
                }

                // Vérifier que c'est bien une image
                if (!file.type.startsWith("image/")) {

                    alert("Choisis une image.");

                    imageInput.value = "";

                    return;
                }

                const reader = new FileReader();

                reader.onload = function(e) {

                    currentImage = e.target.result;

                    document.getElementById(
                        "imagePreview"
                    ).src = currentImage;

                    document.getElementById(
                        "imagePreviewContainer"
                    ).style.display = "block";

                };

                reader.readAsDataURL(file);
            }
        );
    }

    // Charger une éventuelle histoire en cours
    loadCurrentStory();

    // Afficher les histoires
    displayStories();

});

// ======================================================
// SUPPRIMER L'IMAGE
// ======================================================

function removeStoryImage() {

    currentImage = "";

    document.getElementById(
        "imageInput"
    ).value = "";

    document.getElementById(
        "imagePreview"
    ).src = "";

    document.getElementById(
        "imagePreviewContainer"
    ).style.display = "none";
}

// ======================================================
// ENREGISTRER / PUBLIER
// ======================================================

function saveStory(published) {

    const title =
        document.getElementById("storyTitle")
        .value
        .trim();

    const text =
        document.getElementById("storyText")
        .value
        .trim();

    // Vérification du titre
    if (!title) {

        alert("Écris d'abord le titre de ton histoire. 📖");

        document.getElementById("storyTitle").focus();

        return;
    }

    // Vérification du texte
    if (!text) {

        alert("Écris quelque chose dans ton histoire. ✍️");

        document.getElementById("storyText").focus();

        return;
    }

    let stories = getStories();

    const currentStoryId =
        localStorage.getItem(CURRENT_STORY_KEY);

    let story;

    // ==================================================
    // MODIFIER UNE HISTOIRE EXISTANTE
    // ==================================================

    if (currentStoryId) {

        const index = stories.findIndex(
            function(item) {
                return item.id === currentStoryId;
            }
        );

        if (index !== -1) {

            story = stories[index];

            story.title = title;
            story.text = text;
            story.image = currentImage;
            story.published = published;
            story.updatedAt = new Date().toISOString();

            stories[index] = story;

        } else {

            story = createStory(
                title,
                text,
                currentImage,
                published
            );

            stories.push(story);
        }

    }

    // ==================================================
    // CRÉER UNE NOUVELLE HISTOIRE
    // ==================================================

    else {

        story = createStory(
            title,
            text,
            currentImage,
            published
        );

        stories.push(story);

        localStorage.setItem(
            CURRENT_STORY_KEY,
            story.id
        );
    }

    // Sauvegarder
    saveStories(stories);

    // Garder l'histoire actuelle
    localStorage.setItem(
        CURRENT_STORY_KEY,
        story.id
    );

    if (published) {

        alert(
            "🌸 Ton histoire a été publiée dans K-Story !"
        );

    } else {

        alert(
            "💾 Ton histoire a été enregistrée !"
        );
    }

    // Mettre à jour la liste
    displayStories();
}

// ======================================================
// CRÉER UNE HISTOIRE
// ======================================================

function createStory(
    title,
    text,
    image,
    published
) {

    return {

        id:
            Date.now().toString() +
            Math.random().toString(36).substring(2),

        title: title,

        text: text,

        image: image || "",

        published: published,

        createdAt: new Date().toISOString(),

        updatedAt: new Date().toISOString()
    };
}

// ======================================================
// AFFICHER LES HISTOIRES
// ======================================================

function displayStories() {

    const container =
        document.getElementById("storiesList");

    if (!container) {
        return;
    }

    const stories = getStories();

    container.innerHTML = "";

    if (stories.length === 0) {

        container.innerHTML = `
            <div class="empty">
                <h3>📚 Aucune histoire pour le moment</h3>
                <p>
                    Écris ta première histoire et
                    elle apparaîtra ici. 🌸
                </p>

                <button
                    class="main-button"
                    onclick="newStory()"
                >
                    ✍️ Écrire une histoire
                </button>
            </div>
        `;

        return;
    }

    // Afficher les histoires de la plus récente à la plus ancienne
    const reversedStories = [...stories].reverse();

    reversedStories.forEach(function(story) {

        const card =
            document.createElement("div");

        card.className = "story-card";

        // Image
        if (story.image) {

            const image =
                document.createElement("img");

            image.src = story.image;

            image.alt = story.title;

            card.appendChild(image);
        }

        const content =
            document.createElement("div");

        content.className =
            "story-card-content";

        const title =
            document.createElement("h3");

        title.textContent =
            story.title;

        const preview =
            document.createElement("p");

        let shortText = story.text;

        if (shortText.length > 180) {

            shortText =
                shortText.substring(0, 180) +
                "...";
        }

        preview.textContent =
            shortText;

        const readButton =
            document.createElement("button");

        readButton.className =
            "read-button";

        readButton.textContent =
            "📖 Lire";

        readButton.onclick = function() {

            openStory(story.id);

        };

        const editButton =
            document.createElement("button");

        editButton.className =
            "save-button";

        editButton.textContent =
            "✏️ Modifier";

        editButton.onclick = function() {

            editStory(story.id);

        };

        const deleteButton =
            document.createElement("button");

        deleteButton.className =
            "delete-button";

        deleteButton.textContent =
            "🗑️ Supprimer";

        deleteButton.onclick = function() {

            deleteStory(story.id);

        };

        content.appendChild(title);
        content.appendChild(preview);
        content.appendChild(readButton);
        content.appendChild(editButton);
        content.appendChild(deleteButton);

        card.appendChild(content);

        container.appendChild(card);
    });
}

// ======================================================
// OUVRIR UNE HISTOIRE EN LECTURE
// ======================================================

function openStory(id) {

    const stories = getStories();

    const story =
        stories.find(function(item) {
            return item.id === id;
        });

    if (!story) {

        alert("Histoire introuvable.");

        return;
    }

    document.getElementById(
        "readerTitle"
    ).textContent = story.title;

    document.getElementById(
        "readerText"
    ).textContent = story.text;

    const readerImage =
        document.getElementById("readerImage");

    if (story.image) {

        readerImage.src =
            story.image;

        readerImage.style.display =
            "block";

    } else {

        readerImage.src = "";

        readerImage.style.display =
            "none";
    }

    showPage("readerPage");
}

// ======================================================
// MODIFIER UNE HISTOIRE
// ======================================================

function editStory(id) {

    const stories = getStories();

    const story =
        stories.find(function(item) {
            return item.id === id;
        });

    if (!story) {

        alert("Histoire introuvable.");

        return;
    }

    document.getElementById(
        "storyTitle"
    ).value = story.title;

    document.getElementById(
        "storyText"
    ).value = story.text;

    currentImage =
        story.image || "";

    if (currentImage) {

        document.getElementById(
            "imagePreview"
        ).src = currentImage;

        document.getElementById(
            "imagePreviewContainer"
        ).style.display = "block";

    } else {

        document.getElementById(
            "imagePreviewContainer"
        ).style.display = "none";
    }

    localStorage.setItem(
        CURRENT_STORY_KEY,
        story.id
    );

    showPage("writePage");
}

// ======================================================
// CHARGER L'HISTOIRE EN COURS
// ======================================================

function loadCurrentStory() {

    const currentId =
        localStorage.getItem(
            CURRENT_STORY_KEY
        );

    if (!currentId) {
        return;
    }

    const stories = getStories();

    const story =
        stories.find(function(item) {
            return item.id === currentId;
        });

    if (!story) {
        return;
    }

    document.getElementById(
        "storyTitle"
    ).value = story.title;

    document.getElementById(
        "storyText"
    ).value = story.text;

    currentImage =
        story.image || "";

    if (currentImage) {

        document.getElementById(
            "imagePreview"
        ).src = currentImage;

        document.getElementById(
            "imagePreviewContainer"
        ).style.display = "block";
    }
}

// ======================================================
// SUPPRIMER UNE HISTOIRE
// ======================================================

function deleteStory(id) {

    const confirmation =
        confirm(
            "Voulez-vous vraiment supprimer cette histoire ?"
        );

    if (!confirmation) {
        return;
    }

    let stories = getStories();

    stories =
        stories.filter(function(story) {
            return story.id !== id;
        });

    saveStories(stories);

    const currentId =
        localStorage.getItem(
            CURRENT_STORY_KEY
        );

    if (currentId === id) {

        localStorage.removeItem(
            CURRENT_STORY_KEY
        );
    }

    displayStories();

    alert("🗑️ Histoire supprimée.");
                           }
