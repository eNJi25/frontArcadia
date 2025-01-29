async function loadHabitats() {
  try {
    // Appel à la route /showAll pour récupérer tous les habitats
    const response = await fetch(apiUrl + "habitat/showAll");
    if (!response.ok) {
      throw new Error("Erreur lors du chargement des habitats");
    }

    const habitats = await response.json();
    const habitatsContainer = document.getElementById("habitats");
    habitatsContainer.innerHTML = ""; // Vide la div avant de la remplir

    // Parcours chaque habitat pour afficher ses informations
    for (const habitat of habitats) {
      // Création d'un div pour chaque habitat
      const habitatDiv = document.createElement("div");
      habitatDiv.className = "habitat my-4 w-100";

      //Ajout du nom de l'habitat
      const habitatNom = document.createElement("h2");
      habitatNom.textContent = habitat.nom;
      habitatNom.className = "text-center text-titre w-100 mb-4";
      habitatDiv.appendChild(habitatNom);

      // Ajout de l'image de l'habitat
      const habitatImage = document.createElement("img");
      habitatImage.src = habitat.imageName;
      habitatImage.alt = habitat.nom;
      habitatImage.className = "img-fluid w-100 habitat-image";
      habitatDiv.appendChild(habitatImage);

      // Ajout de la description de l'habitat
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

      // Appel à la route /showlastAnimals pour récupérer les 3 derniers animaux de cet habitat
      const animalsResponse = await fetch(
        apiUrl + `animal/showlastAnimals/${habitat.id}`
      );
      if (!animalsResponse.ok) {
        throw new Error(
          `Erreur lors du chargement des animaux pour l'habitat ${habitat.id}`
        );
      }

      const animals = await animalsResponse.json();

      // Création d'un div pour afficher les animaux
      const animalsDiv = document.createElement("div");
      animalsDiv.className = "row w-100"; // Pour afficher les animaux côte à côte

      // Affichage des animaux
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

      // Bouton pour voir tous les animaux de l'habitat
      const divButton = document.createElement("div");
      divButton.className = "d-flex justify-content-center w-100";

      const seeAllButton = document.createElement("button");
      seeAllButton.className = "btn btn-primary mt-3";
      if (habitat.nom == "Savane" || habitat.nom == "Jungle") {
        seeAllButton.textContent = `Voir tous les animaux de la ${habitat.nom}`;
      } else {
        seeAllButton.textContent = `Voir tous les animaux du ${habitat.nom}`;
      }

      //   seeAllButton.addEventListener("click", () => {
      //     alert(`Voir tous les animaux de ${habitat.nom}`);
      //   });

      divButton.appendChild(seeAllButton);
      habitatDiv.appendChild(divButton);

      habitatsContainer.appendChild(habitatDiv);
    }
  } catch (error) {
    console.error(error);
  }
}

// Charger les habitats lorsque la page est prête
loadHabitats();
