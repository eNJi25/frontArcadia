async function loadServices() {
  console.log("Chargement des services...");
  try {
    const data = await fetchData(
      "https://arcadia2024.alwaysdata.net/arcadia/api/service/showAll"
    );

    const services = data;

    const container = document.getElementById("service-container");
    container.innerHTML = "";

    services.forEach((service, index) => {
      const serviceDiv = document.createElement("div");
      serviceDiv.className = `m-4 row ${index % 2 === 0 ? "" : "bg-success"}`;
      serviceDiv.style.padding = "20px";

      const title = document.createElement("h2");
      title.className = "text-titre text-center mb-4";
      title.textContent = service.nom;
      serviceDiv.appendChild(title);

      const contentDiv = document.createElement("div");
      contentDiv.className = "d-flex";

      const textDiv = document.createElement("div");
      textDiv.className =
        "col-6 d-flex flex-column justify-content-center p-2 text-justify";
      const description = document.createElement("p");
      description.textContent = service.description;
      textDiv.appendChild(description);

      const imageDiv = document.createElement("div");
      imageDiv.className = "col-6 d-flex align-items-center";
      const image = document.createElement("img");
      image.className = "rounded img-fluid img-presentation";
      image.src = service.imageName;
      image.alt = service.nom;
      imageDiv.appendChild(image);

      // Alterner l'ordre des colonnes
      if (index % 2 === 0) {
        contentDiv.appendChild(textDiv);
        contentDiv.appendChild(imageDiv);
      } else {
        contentDiv.appendChild(imageDiv);
        contentDiv.appendChild(textDiv);
      }

      serviceDiv.appendChild(contentDiv);

      // Ajouter une div pour les boutons Modifier et Supprimer
      const actionDiv = document.createElement("div");
      actionDiv.className = "mt-3 text-center";

      const editButton = document.createElement("button");
      editButton.className = "btn btn-warning me-2";
      editButton.textContent = "Modifier";
      editButton.addEventListener("click", () => openEditModal(service));

      const deleteButton = document.createElement("button");
      deleteButton.className = "btn btn-danger";
      deleteButton.textContent = "Supprimer";
      deleteButton.addEventListener("click", () => deleteService(service.id));

      actionDiv.appendChild(editButton);
      actionDiv.appendChild(deleteButton);

      serviceDiv.appendChild(actionDiv);
      container.appendChild(serviceDiv);
    });
  } catch (error) {
    console.error("Erreur lors du chargement des services :", error);
  }
}

function openEditModal(service) {
  const modal = document.getElementById("AjoutServiceModal");
  const nomInput = document.getElementById("nomServiceInput");
  const descriptionInput = document.getElementById("descriptionServiceInput");
  const imageInput = document.getElementById("imageService");

  // Pré-remplir les champs avec les données actuelles du service
  nomInput.value = service.nom;
  descriptionInput.value = service.description;
  imageInput.value = ""; // Laisser vide car les fichiers ne peuvent pas être préremplis

  // Remplacer l'événement onclick pour éviter les doublons
  const saveButton = document.getElementById("ajout-service-submit");
  saveButton.onclick = async () => {
    try {
      const updatedService = {
        nom: nomInput.value,
        description: descriptionInput.value,
        image: imageInput.files[0] ? await toBase64(imageInput.files[0]) : null,
      };

      const response = await fetch(
        `https://arcadia2024.alwaysdata.net/arcadia/api/service/edit/${service.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedService),
        }
      );

      if (response.ok) {
        console.log("Service modifié avec succès");
        const modalInstance = bootstrap.Modal.getInstance(modal);
        modalInstance.hide(); // Fermer la modale après succès
        loadServices(); // Recharger les services
      } else {
        console.error("Erreur lors de la modification du service");
        const errorText = await response.text();
        alert(`Erreur : ${errorText}`);
      }
    } catch (error) {
      console.error("Erreur lors de la modification du service :", error);
    }
  };

  // Afficher la modale
  const modalInstance = new bootstrap.Modal(modal);
  modalInstance.show();
}

async function deleteService(serviceId) {
  if (confirm("Êtes-vous sûr de vouloir supprimer ce service ?")) {
    try {
      const response = await fetch(
        `https://arcadia2024.alwaysdata.net/arcadia/api/service/delete/${serviceId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        console.log("Service supprimé avec succès");
        loadServices();
      } else {
        console.error("Erreur lors de la suppression du service");
        const errorText = await response.text();
        alert(`Erreur : ${errorText}`);
      }
    } catch (error) {
      console.error("Erreur lors de la suppression du service :", error);
    }
  }
}

// Fonction utilitaire pour convertir une image en Base64
function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Charger les services au démarrage
loadServices();

document
  .getElementById("ajout-service-submit")
  .addEventListener("click", submitNewService);
