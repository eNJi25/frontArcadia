function toUpperCase(text) {
  return text.toUpperCase();
}

// DEBUT Présentation Habitats

const habitatsContainer = document.getElementById("habitats");

fetch("https://arcadia2024.alwaysdata.net/arcadia/api/habitat/showAll")
  .then((response) => {
    if (!response.ok) {
      throw new Error(`Erreur HTTP : ${response.status}`);
    }
    return response.json();
  })
  .then((data) => {
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
  })
  .catch((error) => {
    console.error("Une erreur est survenue :", error);
    habitatsContainer.innerHTML = `<p class="text-danger text-center">Impossible de charger les habitats. Veuillez réessayer plus tard.</p>`;
  });

// FIN Présentation Habitats

// DEBUT Carousel Services

const servicesContainer = document.getElementById("services");

fetch("https://arcadia2024.alwaysdata.net/arcadia/api/service/showAll")
  .then((response) => {
    if (!response.ok) {
      throw new Error(`Erreur HTTP : ${response.status}`);
    }
    return response.json();
  })
  .then((data) => {
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
  })
  .catch((error) => {
    console.error("Une erreur est survenue :", error);
    servicesContainer.innerHTML = `<p class="text-danger text-center">Impossible de charger les services. Veuillez réessayer plus tard.</p>`;
  });

// FIN Carousel Services

// DEBUT Présentation Animaux

const animauxContainer = document.getElementById("animaux");

fetch("https://arcadia2024.alwaysdata.net/arcadia/api/animal/showAnimalsHome")
  .then((response) => {
    if (!response.ok) {
      throw new Error(`Erreur HTTP : ${response.status}`);
    }
    return response.json();
  })
  .then((data) => {
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
  })
  .catch((error) => {
    console.error("Une erreur est survenue :", error);
    animauxContainer.innerHTML = `<p class="text-danger text-center">Impossible de charger les animaux. Veuillez réessayer plus tard.</p>`;
  });

// FIN Présentation Animaux

// DEBUT Présentation Avis

const avisContainer = document.getElementById("avis");

fetch("https://arcadia2024.alwaysdata.net/arcadia/api/avis/valides")
  .then((response) => {
    if (!response.ok) {
      throw new Error(`Erreur HTTP : ${response.status}`);
    }
    return response.json(); // Transforme la réponse en JSON
  })
  .then((data) => {
    if (data.length === 0) {
      avisContainer.innerHTML = "<p>Aucun avis disponible pour le moment.</p>";
      return;
    }

    data.forEach((avis) => {
      const avisElement = document.createElement("div");
      avisElement.className = "col-12 col-md-3 mb-4"; // Chaque avis prend 1/4 de la largeur

      const dateAvis = new Date(avis.createdAt); // Remplacez 'avis.date' par la propriété correcte de votre API
      const dateFormattee = dateAvis.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      avisElement.innerHTML = `
        <div class="avis-item p-4 border rounded h-100 bg-success d-flex flex-column justify-content-between align-items-center">
          <h4 class="text-titre">${avis.pseudo}</h4>
          <p class="avis-commentaire">${avis.commentaire}</p>
          <p class="avis-date">${dateFormattee}</>
        </div>
      `;

      avisContainer.appendChild(avisElement);
    });
  })
  .catch((error) => {
    console.error("Une erreur est survenue :", error);
    avisContainer.innerHTML = `
      <p class="text-danger">Impossible de charger les avis. Veuillez réessayer plus tard.</p>
    `;
  });

// FIN Présentation Avis

// Soumission d'un avis

const pseudoInput = document.getElementById("pseudoAvisInput");
const commentaireInput = document.getElementById("CommentaireAvisInput");
const submitButton = document.getElementById("avis-submit");

submitButton.addEventListener("click", () => {
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

  fetch("https://arcadia2024.alwaysdata.net/arcadia/api/avis/new", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(avisData),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Erreur HTTP : ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      alert("Avis envoyé avec succès !");

      pseudoInput.value = "";
      commentaireInput.value = "";

      const modal = bootstrap.Modal.getInstance(
        document.getElementById("SoumissionAvisModal")
      );
      modal.hide();
    })
    .catch((error) => {
      console.error("Erreur lors de l'envoi :", error);
      alert("Une erreur est survenue lors de l'envoi de votre avis.");
    });
});
