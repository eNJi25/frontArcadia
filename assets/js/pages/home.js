function toUpperCase(text) {
  return text.toUpperCase();
}

// Fonction pour récupérer les données avec fetch et gérer les erreurs
async function fetchData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Erreur HTTP : ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Une erreur est survenue :", error);
    return null;
  }
}

// Fonction pour afficher les habitats
async function displayHabitats() {
  const habitatsContainer = document.getElementById("habitats");
  const data = await fetchData(
    "https://arcadia2024.alwaysdata.net/arcadia/api/habitat/showAll"
  );

  if (data) {
    data.forEach((habitat) => {
      const habitatCard = document.createElement("div");
      habitatCard.className = "col-12 col-md-4 mb-3";
      habitatCard.innerHTML = `
        <div class="card position-relative">
          <img src="${habitat.imageName}" class="img-fluid habitat-card" alt="${
        habitat.nom
      }">
          <div class="w-100 h-100 card-body position-absolute d-flex flex-column justify-content-between align-items-center">
            <h3 class="card-title text-color">${toUpperCase(habitat.nom)}</h3>
            <a href="/arcadia/api/habitat/show/${
              habitat.id
            }" class="btn btn-secondary">Découvrir</a>
          </div>
        </div>
      `;
      habitatsContainer.appendChild(habitatCard);
    });
  } else {
    habitatsContainer.innerHTML = `<p class="text-danger text-center">Impossible de charger les habitats. Veuillez réessayer plus tard.</p>`;
  }
}

// Fonction pour afficher les services dans le carousel
async function displayServices() {
  const servicesContainer = document.getElementById("services");
  const data = await fetchData(
    "https://arcadia2024.alwaysdata.net/arcadia/api/service/showAll"
  );

  if (data) {
    data.forEach((service, index) => {
      const serviceItem = document.createElement("div");
      serviceItem.classList.add("carousel-item");

      if (index === 0) {
        serviceItem.classList.add("active");
      }

      serviceItem.innerHTML = `
        <img src="${service.imageName}" class="d-block w-100" alt="${service.nom}">
        <div class="carousel-caption position-absolute bottom-0 start-0 w-100 d-flex justify-content-between align-items-center p-4">
            <h3 class="text-titre ms-3">${service.nom}</h3>
            <a href="#" class="btn btn-secondary me-3">En savoir plus</a>
        </div>
      `;
      servicesContainer.appendChild(serviceItem);
    });
  } else {
    servicesContainer.innerHTML = `<p class="text-danger text-center">Impossible de charger les services. Veuillez réessayer plus tard.</p>`;
  }
}

// Fonction pour afficher les animaux
async function displayAnimals() {
  const animauxContainer = document.getElementById("animaux");
  const data = await fetchData(
    "https://arcadia2024.alwaysdata.net/arcadia/api/animal/showAnimalsHome"
  );

  if (data) {
    data.forEach((item) => {
      const animal = item.animal;
      const animalCard = document.createElement("div");
      animalCard.className = "col-12 col-md-4 mb-3";
      animalCard.innerHTML = `
        <div class="card position-relative">
          <img src="${animal.imageSlug}" class="img-fluid animal-card" alt="${
        animal.prenom
      }">
          <div class="w-100 h-100 card-body position-absolute d-flex flex-column justify-content-between align-items-center">
            <h3 class="card-title text-color">${toUpperCase(animal.prenom)}</h3>
            <a href="/arcadia/api/animal/show/${
              animal.id
            }" class="btn btn-secondary">Découvrir</a>
          </div>
        </div>
      `;
      animauxContainer.appendChild(animalCard);
    });
  } else {
    animauxContainer.innerHTML = `<p class="text-danger text-center">Impossible de charger les animaux. Veuillez réessayer plus tard.</p>`;
  }
}

// Fonction pour afficher les avis
async function displayAvis() {
  const avisContainer = document.getElementById("avis");
  const data = await fetchData(
    "https://arcadia2024.alwaysdata.net/arcadia/api/avis/valides"
  );

  if (data) {
    if (data.length === 0) {
      avisContainer.innerHTML = "<p>Aucun avis disponible pour le moment.</p>";
      return;
    }

    data.forEach((avis) => {
      const avisElement = document.createElement("div");
      avisElement.className = "col-12 col-md-3 mb-4";
      const dateAvis = new Date(avis.createdAt);
      const dateFormattee = dateAvis.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      avisElement.innerHTML = `
        <div class="avis-item p-4 border rounded h-100 bg-success d-flex flex-column justify-content-between align-items-center">
          <h4 class="text-titre">${avis.pseudo}</h4>
          <p class="avis-commentaire">${avis.commentaire}</p>
          <p class="avis-date">${dateFormattee}</p>
        </div>
      `;
      avisContainer.appendChild(avisElement);
    });
  } else {
    avisContainer.innerHTML = `<p class="text-danger">Impossible de charger les avis. Veuillez réessayer plus tard.</p>`;
  }
}

// Fonction pour soumettre un avis
async function submitAvis() {
  const pseudoInput = document.getElementById("pseudoAvisInput");
  const commentaireInput = document.getElementById("CommentaireAvisInput");
  const submitButton = document.getElementById("avis-submit");

  submitButton.addEventListener("click", async () => {
    const pseudo = pseudoInput.value.trim();
    const commentaire = commentaireInput.value.trim();

    if (!pseudo || !commentaire) {
      alert("Veuillez remplir tous les champs !");
      return;
    }

    const avisData = {
      pseudo: pseudo,
      commentaire: commentaire,
    };

    try {
      const response = await fetch(
        "https://arcadia2024.alwaysdata.net/arcadia/api/avis/new",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(avisData),
        }
      );

      if (!response.ok) {
        throw new Error(`Erreur HTTP : ${response.status}`);
      }

      const data = await response.json();
      alert("Avis envoyé avec succès !");
      pseudoInput.value = "";
      commentaireInput.value = "";
      const modal = bootstrap.Modal.getInstance(
        document.getElementById("SoumissionAvisModal")
      );
      modal.hide();
    } catch (error) {
      console.error("Erreur lors de l'envoi :", error);
      alert("Une erreur est survenue lors de l'envoi de votre avis.");
    }
  });
}

// Appels des fonctions
displayHabitats();
displayServices();
displayAnimals();
displayAvis();
submitAvis();
