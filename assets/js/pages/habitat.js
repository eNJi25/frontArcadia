const params = new URLSearchParams(window.location.search);
const habitatId = params.get("id");

async function loadHabitatDetails() {
  if (!habitatId) {
    console.error("Aucun ID d'habitat trouvé dans l'URL");
    return;
  }

  try {
    const response = await fetch(apiUrl + `habitat/show/${habitatId}`);

    if (!response.ok) {
      throw new Error(`Erreur API : ${response.status}`);
    }

    const habitat = await response.json();
    const nomHabitat = habitat.nom;
    const imageHabitat = habitat.imageName;
    const descriptionHabitat = habitat.description;

    // Affichage du hero
    displayHabitatHero(nomHabitat, imageHabitat);

    displayDescription(descriptionHabitat);

    displayButtonHabitat();

    document
      .querySelector('[data-bs-target="#EditHabitatModal"]')
      .addEventListener("click", () => openEditModal(habitat));

    document
      .getElementById("deleteHabitat")
      .addEventListener("click", () => deleteService(habitatId));

    document
      .getElementById("ajout-animal-submit")
      .addEventListener("click", function () {
        submitNewAnimal(habitat.nom);
      });

    loadAnimalsByHabitat(habitatId);
  } catch (error) {
    console.error("Erreur lors du chargement de l'habitat :", error);
  }
}

function displayDescription(description) {
  const descriptionHabitat = document.getElementById("description-habitat");
  const descriptionContainer = document.createElement("p");
  descriptionContainer.className =
    "my-3 p-3 text-center text-justify w-100 text-titre";
  descriptionContainer.innerText = description;
  descriptionHabitat.appendChild(descriptionContainer);
}

function displayButtonHabitat() {
  const btnHabitat = document.getElementById("btn-habitat");
  btnHabitat.innerHTML = `
  <div class="container bg-success text-center py-3 my-3" data-show="connected">
    <button class="btn btn-secondary m-2" data-bs-toggle="modal" data-bs-target="#EditHabitatModal">Modifier l'habitat</button>
    <button id="deleteHabitat" class="btn btn-danger">Supprimer l'habitat</button>
  </div>
  `;
}

function displayHabitatHero(nom, image) {
  const heroContainer = document.getElementById("hero-container");

  heroContainer.innerHTML = `
        <div class="row hero-scene text-center text-color w-100 m-0">
          <div class="hero-scene-content">
            <img class="img-hero img-fluid" src="${image}" alt="${nom}">
            <h1 class="hero-content">${nom}</h1>
          </div>
        </div>
    `;
}

async function loadAnimalsByHabitat(habitatId) {
  const animalsContainer = document.getElementById("animals-container");

  try {
    const response = await fetch(apiUrl + `animal/showAllAnimals/${habitatId}`);

    if (!response.ok) {
      throw new Error(`Erreur API : ${response.status}`);
    }

    const animals = await response.json();

    if (animals.length === 0) {
      animalsContainer.innerHTML = `<p class="text-center">Aucun animal trouvé.</p>`;
      return;
    }

    let animalsHTML = "";
    animals.forEach((animal) => {
      animalsHTML += `
    <div class="col-12 col-md-4 mb-3">
        <div class="image-card text-white">
            <div class="image-container position-relative">
                <img src="${animal.imageSlug}" alt="${animal.prenom}" class="rounded w-100">
                <div class="action-image-buttons" data-show="connected">
                    <button type="button" class="btn btn-outline-light" data-bs-toggle="modal"
                            data-bs-target="#EditionPhotoModal"><i class="bi bi-pencil-square"></i></button>
                    <button type="button" class="btn btn-outline-light" data-bs-toggle="modal"
                            data-bs-target="#DeletePhotoModal"><i class="bi bi-trash"></i></button>
                    <button type="button" class="btn btn-outline-light" data-bs-toggle="modal"
                            data-bs-target="#RapportVeterinaireModal"><i class="bi bi-calendar2-heart"></i></button>
                    <button type="button" class="btn btn-outline-light" data-bs-toggle="modal"
                            data-bs-target="#RepasModal"><i class="bi bi-cup-hot"></i></button>
                </div>
                <button type="button" class="btn btn-secondary position-absolute bottom-0 start-50 translate-middle-x mb-2" 
                        onclick="fetchAnimalDetails(${animal.id})">
                    Voir les détails
                </button>
            </div>
            <p class="titre-image">${animal.prenom}</p>
        </div>
     </div>
    `;
    });

    animalsContainer.innerHTML = animalsHTML;
    showAndHideElementsForRoles();
  } catch (error) {
    console.error("Erreur lors du chargement des animaux :", error);
    animalsContainer.innerHTML = `<p class="text-center text-danger">Erreur lors du chargement des animaux.</p>`;
  }
}

// Fonction pour récupérer les détails de l'animal et l'afficher dans la modale
async function fetchAnimalDetails(animalId) {
  try {
    const response = await fetch(apiUrl + `animal/show/${animalId}`);

    if (!response.ok) {
      throw new Error(
        `Erreur de récupération des détails de l'animal : ${response.status}`
      );
    }

    const animal = await response.json();

    // Affichage des détails de l'animal dans la modale
    document.getElementById("animalPrenom").innerText = animal.prenom;
    document.getElementById("animalRace").innerText = animal.race;
    document.getElementById("animalNourritureDernierRepas").innerText =
      animal.nourritureDernierRepas;
    document.getElementById("animalQuantiteDernierRepas").innerText =
      animal.quantiteDernierRepas;
    document.getElementById("animalDateDernierRepas").innerText =
      animal.dateDernierRepas;

    const modal = new bootstrap.Modal(
      document.getElementById("AnimalDetailsModal")
    );
    modal.show();
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des détails de l'animal :",
      error
    );
  }
}

function openEditModal(habitat) {
  const modalElement = document.getElementById("EditHabitatModal");
  const nomInput = document.getElementById("editHabitatNom");
  const descriptionInput = document.getElementById("editHabitatDescription");
  const imageInput = document.getElementById("editHabitatImage");
  const saveButton = document.getElementById("edit-habitat-submit");

  // Remplissage des champs
  nomInput.value = habitat.nom || "";
  descriptionInput.value = habitat.description || "";
  imageInput.value = "";

  // Supprimer l'ancien gestionnaire d'événements pour éviter les doublons
  saveButton.replaceWith(saveButton.cloneNode(true));
  const newSaveButton = document.getElementById("edit-habitat-submit");

  // Ajouter un nouveau gestionnaire propre
  newSaveButton.addEventListener("click", async () => {
    if (!nomInput.value || !descriptionInput.value) {
      alert("Veuillez remplir tous les champs.");
      return;
    }

    const formData = new FormData();
    formData.append("nom", nomInput.value);
    formData.append("description", descriptionInput.value);
    if (imageInput.files[0]) formData.append("imageFile", imageInput.files[0]);

    try {
      const response = await fetch(apiUrl + `habitat/edit/${habitatId}`, {
        method: "POST",
        headers: { "X-AUTH-TOKEN": getToken() },
        body: formData,
      });

      if (response.ok) {
        alert("Habitat modifié !");
        bootstrap.Modal.getInstance(modalElement).hide();
        loadHabitatDetails();
      } else {
        alert(`Erreur : ${await response.text()}`);
      }
    } catch (error) {
      console.error("Erreur lors de la modification de l'habitat :", error);
    }
  });

  // Afficher la modale proprement
  new bootstrap.Modal(modalElement).show();
}

async function deleteService(habitatId) {
  if (confirm("Êtes-vous sûr de vouloir supprimer cet habitat ?")) {
    try {
      const response = await fetch(apiUrl + `habitat/delete/${habitatId}`, {
        method: "DELETE",
        headers: { "X-AUTH-TOKEN": getToken() },
      });

      if (response.ok) {
        loadHabitatDetails();
      } else {
        alert(`Erreur : ${await response.text()}`);
      }
    } catch (error) {
      console.error("Erreur lors de la suppression de l'habitat :", error);
    }
  }
}

async function submitNewAnimal(habitat) {
  const modal = document.getElementById("AjoutAnimalModal");

  const prenomInput = document.getElementById("prenomAnimalInput").value.trim();
  const raceInput = document.getElementById("raceAnimalInput").value.trim();
  const imageInput = document.getElementById("imageAnimal").files[0];

  if (!prenomInput || !raceInput || !imageInput) {
    alert("Veuillez remplir tous les champs.");
    return;
  }

  const formData = new FormData();
  formData.append("prenom", prenomInput);
  formData.append("race", raceInput);
  formData.append("habitat", habitat);
  formData.append("imageFile", imageInput);
  console.log(habitat);

  const token = getToken();

  try {
    const response = await fetch(
      apiUrl + "animal/new",
      {
        method: "POST",
        body: formData,
        headers: {
          "X-AUTH-TOKEN": token,
        },
      }
    );

    const responseData = await response.text();
    console.log("Réponse brute de l'API :", responseData);

    if (!response.ok) {
      throw new Error(`Erreur API : ${responseData}`);
    }

    alert("Animal ajouté avec succès !");
    bootstrap.Modal.getInstance(modal).hide();
    loadHabitatDetails();
  } catch (error) {
    console.error("Erreur :", error);
    alert("Une erreur est survenue lors de l'ajout de l'animal.");
  }
}

loadHabitatDetails();
