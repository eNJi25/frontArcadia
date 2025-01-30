async function loadHabitats() {
  try {
    const response = await fetch(apiUrl + "habitat/showAll");
    if (!response.ok) {
      throw new Error("Erreur lors du chargement des habitats");
    }

    const habitats = await response.json();
    const habitatsContainer = document.getElementById("habitats");
    habitatsContainer.innerHTML = "";

    for (const habitat of habitats) {

      const habitatDiv = document.createElement("div");
      habitatDiv.className = "habitat my-4 w-100";

      const habitatNom = document.createElement("h2");
      habitatNom.textContent = habitat.nom;
      habitatNom.className = "text-center text-titre w-100 mb-4";
      habitatDiv.appendChild(habitatNom);

      const habitatImage = document.createElement("img");
      habitatImage.src = habitat.imageName;
      habitatImage.alt = habitat.nom;
      habitatImage.className = "img-fluid w-100 habitat-image";
      habitatDiv.appendChild(habitatImage);

      const habitatDescription = document.createElement("p");
      habitatDescription.textContent = habitat.description;
      habitatDescription.className = "w-100 text-titre text-justify my-3 p-3";
      habitatDiv.appendChild(habitatDescription);

      const titreAnimal = document.createElement("h2");
      titreAnimal.className = "text-center text-titre w-100 my-3";
      if (habitat.nom == "Savane" || habitat.nom == "Jungle") {
        titreAnimal.textContent = `Animaux de la ${habitat.nom}`;
      } else {
        titreAnimal.textContent = `Animaux du ${habitat.nom}`;
      }

      habitatDiv.appendChild(titreAnimal);

      const animalsResponse = await fetch(
        apiUrl + `animal/showlastAnimals/${habitat.id}`
      );
      if (!animalsResponse.ok) {
        throw new Error(
          `Erreur lors du chargement des animaux pour l'habitat ${habitat.id}`
        );
      }

      const animals = await animalsResponse.json();

      const animalsDiv = document.createElement("div");
      animalsDiv.className = "row w-100";

      animals.forEach((animal) => {
        const animalDiv = document.createElement("div");
        animalDiv.className = "col-12 col-md-3 text-center p-3 m-3";

        const animalImage = document.createElement("img");
        animalImage.src = animal.imageSlug;
        animalImage.alt = animal.prenom;
        animalImage.className = "img-fluid rounded";
        animalDiv.appendChild(animalImage);

        animalsDiv.appendChild(animalDiv);
      });

      habitatDiv.appendChild(animalsDiv);

      const divButton = document.createElement("div");
      divButton.className = "d-flex justify-content-center w-100";

      const seeAllButton = document.createElement("button");
      seeAllButton.className = "btn btn-primary mt-3";
      if (habitat.nom == "Savane" || habitat.nom == "Jungle") {
        seeAllButton.textContent = `Voir tous les animaux de la ${habitat.nom}`;
      } else {
        seeAllButton.textContent = `Voir tous les animaux du ${habitat.nom}`;
      }

      seeAllButton.addEventListener("click", () => {
        window.location.href = `/habitat?id=${habitat.id}`;
      });

      divButton.appendChild(seeAllButton);
      habitatDiv.appendChild(divButton);

      habitatsContainer.appendChild(habitatDiv);
    }
  } catch (error) {
    console.error(error);
  }
}

async function submitNewHabitat() {
  const modal = document.getElementById("AjoutHabitatModal");

  const nomInput = document.getElementById("nomHabitatInput").value.trim();
  const descriptionInput = document
    .getElementById("descriptionHabitatInput")
    .value.trim();
  const imageInput = document.getElementById("imageHabitat").files[0];

  if (!nomInput || !descriptionInput || !imageInput) {
    alert("Veuillez remplir tous les champs.");
    return;
  }

  const formData = new FormData();
  formData.append("nom", nomInput);
  formData.append("description", descriptionInput);
  formData.append("imageFile", imageInput);

  const token = getToken();

  try {
    const response = await fetch(
      "https://arcadia2024.alwaysdata.net/arcadia/api/habitat/new",
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

    alert("Habitat créé avec succès !");
    bootstrap.Modal.getInstance(modal).hide();
    loadHabitats();
  } catch (error) {
    console.error("Erreur :", error);
    alert("Une erreur est survenue lors de la création de l'habitat.");
  }
}

document
  .getElementById("ajout-habitat-submit")
  .addEventListener("click", submitNewHabitat);

loadHabitats();
