// Changer de page
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
