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
      serviceDiv.className = `m-4 row p-2 ${
        index % 2 === 0 ? "" : "bg-success"
      }`;

      const title = document.createElement("h2");
      title.className = "text-titre text-center mb-4";
      title.textContent = service.nom;
      serviceDiv.appendChild(title);

      const contentDiv = document.createElement("div");
      contentDiv.className = "d-flex";

      const textDiv = document.createElement("div");
      textDiv.className =
        "col-6 d-flex flex-column justify-content-center p-4 text-justify";
      const description = document.createElement("p");
      description.className = "mb-0";
      description.textContent = service.description;
      textDiv.appendChild(description);

      const imageDiv = document.createElement("div");
      imageDiv.className = "col-6 d-flex align-items-center";
      const image = document.createElement("img");
      image.className = "rounded img-fluid img-presentation";
      image.src = service.imageName;
      image.alt = service.nom;
      imageDiv.appendChild(image);

      if (index % 2 === 0) {
        contentDiv.appendChild(textDiv);
        contentDiv.appendChild(imageDiv);
      } else {
        contentDiv.appendChild(imageDiv);
        contentDiv.appendChild(textDiv);
      }

      serviceDiv.appendChild(contentDiv);

      const actionDiv = document.createElement("div");
      actionDiv.className = "mt-3 text-center";
      actionDiv.setAttribute("data-show", "connected");

      const value = actionDiv.dataset.show;
      console.log(value);

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
    showAndHideElementsForRoles();
  } catch (error) {
    console.error("Erreur lors du chargement des services :", error);
  }
}

function openEditModal(service) {
  const modal = document.getElementById("EditServiceModal");
  const nomInput = document.getElementById("editNomServiceInput");
  const descriptionInput = document.getElementById(
    "editDescriptionServiceInput"
  );
  const imageInput = document.getElementById("editImageService");

  nomInput.value = service.nom || "";
  descriptionInput.value = service.description || "";
  imageInput.value = "";

  const saveButton = document.getElementById("edit-service-submit");
  saveButton.onclick = async () => {
    if (!nomInput.value || !descriptionInput.value) {
      alert("Veuillez remplir tous les champs.");
      return;
    }

    const formData = new FormData();
    formData.append("nom", nomInput.value);
    formData.append("description", descriptionInput.value);
    if (imageInput.files[0]) formData.append("imageFile", imageInput.files[0]);

    try {
      const response = await fetch(
        `https://arcadia2024.alwaysdata.net/arcadia/api/service/edit/${service.id}`,
        {
          method: "POST",
          headers: {
            "X-AUTH-TOKEN": getToken(),
          },
          body: formData,
        }
      );

      if (response.ok) {
        alert("Service modifié !");
        bootstrap.Modal.getInstance(modal).hide();
        loadServices();
      } else {
        alert(`Erreur : ${await response.text()}`);
      }
    } catch (error) {
      console.error("Erreur lors de la modification du service :", error);
    }
  };

  new bootstrap.Modal(modal).show();
}

async function deleteService(serviceId) {
  if (confirm("Êtes-vous sûr de vouloir supprimer ce service ?")) {
    try {
      const response = await fetch(
        `https://arcadia2024.alwaysdata.net/arcadia/api/service/delete/${serviceId}`,
        {
          method: "DELETE",
          headers: { "X-AUTH-TOKEN": getToken() },
        }
      );

      if (response.ok) {
        loadServices();
      } else {
        alert(`Erreur : ${await response.text()}`);
      }
    } catch (error) {
      console.error("Erreur lors de la suppression du service :", error);
    }
  }
}

async function submitNewService() {
  const modal = document.getElementById("AjoutServiceModal"); // Ajoute cette ligne avant de l'utiliser

  const nomInput = document.getElementById("nomServiceInput").value.trim();
  const descriptionInput = document
    .getElementById("descriptionServiceInput")
    .value.trim();
  const imageInput = document.getElementById("imageService").files[0];

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
      "https://arcadia2024.alwaysdata.net/arcadia/api/service/new",
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

    alert("Service créé avec succès ! Rafraîchissement...");
    new bootstrap.Modal(modal).show();
    loadServices();
  } catch (error) {
    console.error("Erreur :", error);
    alert("Une erreur est survenue lors de la création du service.");
  }
}

loadServices();

document
  .getElementById("ajout-service-submit")
  .addEventListener("click", submitNewService);
