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

    displayHabitatHero(nomHabitat, imageHabitat);

    displayDescription(descriptionHabitat);

    displayButtonHabitat();

    document
      .querySelector('[data-bs-target="#EditHabitatModal"]')
      .addEventListener("click", () => openEditModal(habitat));

    document
      .getElementById("deleteHabitat")
      .addEventListener("click", () => deleteHabitat(habitatId));

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
                    <button type="button" class="btn btn-outline-light" 
                      data-bs-toggle="modal" data-bs-target="#EditionAnimalModal"
                      onclick="fetchAnimalForEdit(${animal.id})">
                      <i class="bi bi-pencil-square"></i>
                    </button>
                    <button data-animal-id="${animal.id}" id=" deleteAnimal" type="button" class="btn btn-outline-light" data-bs-toggle="modal"
                            data-bs-target="#DeleteAnimalModal" onclick="getId(${animal.id})"><i class="bi bi-trash"></i></button>
                    <button data-animal-id="${animal.id}" id="rapportVeterinaire" type="button" class="btn          btn-outline-light" data-bs-toggle="modal"
                            data-bs-target="#RapportVeterinaireModal" onclick="getId(${animal.id})"><i class="bi bi-calendar2-heart"></i></button>
                    <button type="button" class="btn btn-outline-light" 
                      data-bs-toggle="modal" data-bs-target="#EditionLastMealModal"
                      onclick="getId(${animal.id})">
                      <i class="bi bi-pencil-square"></i>
                    </button>
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

async function fetchAnimalDetails(animalId) {
  try {
    const response = await fetch(apiUrl + `animal/show/${animalId}`);

    if (!response.ok) {
      throw new Error(
        `Erreur de récupération des détails de l'animal : ${response.status}`
      );
    }

    const animal = await response.json();
    console.log(animal);

    document.getElementById("animalPrenom").innerText = animal.prenom;
    document.getElementById("animalRace").innerText = animal.race;
    document.getElementById("animalNourritureDernierRepas").innerText =
      animal.nourritureDernierRepas;
    if (animal.quantiteDernierRepas != null) {
      document.getElementById("animalQuantiteDernierRepas").innerText = `
      ${animal.quantiteDernierRepas} grammes`;
    }
    if (animal.dateDernierRepas?.date) {
      const dateObj = new Date(animal.dateDernierRepas.date);
      const dateFormatted = dateObj.toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });

      document.getElementById("animalDateDernierRepas").innerText =
        dateFormatted;
    }

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

  nomInput.value = habitat.nom || "";
  descriptionInput.value = habitat.description || "";
  imageInput.value = "";

  saveButton.addEventListener("click", async () => {
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

  new bootstrap.Modal(modalElement).show();
}

async function fetchAnimalForEdit(animalId) {
  try {
    const response = await fetch(
      `https://arcadia2024.alwaysdata.net/arcadia/api/animal/show/${animalId}`
    );

    if (!response.ok) {
      throw new Error(
        `Erreur de récupération des détails de l'animal : ${response.status}`
      );
    }

    const animal = await response.json();

    document.getElementById("editAnimalId").value = animal.id;
    document.getElementById("editPrenomAnimal").value = animal.prenom;
    document.getElementById("editRaceAnimal").value = animal.race;

    const modal = new bootstrap.Modal(
      document.getElementById("EditionAnimalModal")
    );
    modal.show();
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des détails de l'animal :",
      error
    );
  }
}

async function editAnimal() {
  const id = document.getElementById("editAnimalId").value;
  const prenom = document.getElementById("editPrenomAnimal").value.trim();
  const race = document.getElementById("editRaceAnimal").value.trim();
  const image = document.getElementById("editImageAnimal").files[0];

  if (!prenom || !race) {
    alert("Veuillez remplir au moins les champs prénom et race.");
    return;
  }

  const formData = new FormData();
  formData.append("prenom", prenom);
  formData.append("race", race);
  if (image) formData.append("imageFile", image);

  try {
    const response = await fetch(apiUrl + `animal/edit/${id}`, {
      method: "POST",
      body: formData,
      headers: { "X-AUTH-TOKEN": getToken() },
    });

    if (!response.ok) throw new Error(await response.text());

    alert("Animal modifié avec succès !");

    bootstrap.Modal.getInstance(
      document.getElementById("EditionAnimalModal")
    ).hide();

    loadHabitatDetails();
  } catch (error) {
    console.error("Erreur :", error);
    alert("Erreur lors de la modification.");
  }
}

async function deleteHabitat(habitatId) {
  if (confirm("Êtes-vous sûr de vouloir supprimer cet habitat ?")) {
    try {
      const response = await fetch(apiUrl + `habitat/delete/${habitatId}`, {
        method: "DELETE",
        headers: { "X-AUTH-TOKEN": getToken() },
      });

      if (response.ok) {
        window.location.href = "/habitats";
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
    const response = await fetch(apiUrl + "animal/new", {
      method: "POST",
      body: formData,
      headers: {
        "X-AUTH-TOKEN": token,
      },
    });

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

async function deleteAnimal() {
  const id = document.getElementById("deleteAnimalId").value;

  try {
    const response = await fetch(
      `https://arcadia2024.alwaysdata.net/arcadia/api/animal/delete/${id}`,
      {
        method: "DELETE",
        headers: { "X-AUTH-TOKEN": getToken() },
      }
    );

    if (!response.ok) throw new Error(await response.text());

    alert("Animal supprimé !");
    bootstrap.Modal.getInstance(
      document.getElementById("DeleteAnimalModal")
    ).hide();
    loadHabitatDetails();
  } catch (error) {
    console.error("Erreur :", error);
    alert("Erreur lors de la suppression.");
  }
}

async function editLastMeal() {
  const id = document.getElementById("editLastMealAnimalId").value.trim();
  const nourriture = document.getElementById("editLastMealFood").value.trim();
  const quantite = document.getElementById("editLastMealQuantity").value.trim();

  if (!nourriture || !quantite) {
    alert("Veuillez remplir les champs nourriture et quantité.");
    return;
  }

  const formData = new FormData();
  formData.append("nourriture_dernier_repas", nourriture);
  formData.append("quantite_dernier_repas", quantite.toString());

  try {
    const response = await fetch(apiUrl + `animal/lastMeal/${id}`, {
      method: "POST",
      body: formData,
      headers: { "X-AUTH-TOKEN": getToken() },
    });

    if (!response.ok) throw new Error(await response.text());

    alert("Dernier repas modifié avec succès !");

    bootstrap.Modal.getInstance(
      document.getElementById("EditionLastMealModal")
    ).hide();

    loadHabitatDetails();
  } catch (error) {
    console.error("Erreur :", error);
    alert("Erreur lors de la modification du dernier repas.");
  }
}

async function addVeterinaryReport() {
  const animalId = document.getElementById("rapportAnimalId").value;
  console.log(animalId);
  const etatAnimal = document.getElementById("etatAnimal").value.trim();
  const nourriturePropose = document
    .getElementById("nourriturePropose")
    .value.trim();
  const quantitePropose = document
    .getElementById("quantitePropose")
    .value.trim();
  const detailHabitat = document.getElementById("detailHabitat").value.trim();

  if (!etatAnimal) {
    alert("Veuillez renseigner l'état de l'animal.");
    return;
  }

  const formData = new URLSearchParams();
  formData.append("animal", animalId);
  formData.append("user", getCookie(User));
  formData.append("etat_animal", etatAnimal);
  if (nourriturePropose)
    formData.append("nourriture_propose", nourriturePropose);
  if (quantitePropose) formData.append("quantite_propose", quantitePropose);
  if (detailHabitat) formData.append("detail_habitat", detailHabitat);

  try {
    const response = await fetch(
      `https://arcadia2024.alwaysdata.net/arcadia/api/rapport/new`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "X-AUTH-TOKEN": getToken(),
        },
        body: formData,
      }
    );

    if (!response.ok) throw new Error(await response.text());

    alert("Rapport vétérinaire ajouté avec succès !");
    bootstrap.Modal.getInstance(
      document.getElementById("RapportVeterinaireModal")
    ).hide();
  } catch (error) {
    console.error("Erreur :", error);
    alert("Erreur lors de l'ajout du rapport.");
  }
}

async function getId(animalId) {
  document.getElementById("editLastMealAnimalId").value = animalId;
  document.getElementById("deleteAnimalId").value = animalId;
  document.getElementById("rapportAnimalId").value = animalId;
}

loadHabitatDetails();
