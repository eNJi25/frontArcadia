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
        "col-6 d-flex flex-column justify-content-center p-4 text-justify";
      const description = document.createElement("p");
      description.textContent = service.description;
      textDiv.appendChild(description);

      const imageDiv = document.createElement("div");
      imageDiv.className = "col-6 d-flex align-items-center";
      imageDiv.style.padding = "10px"; // Ajouter un peu d'espace autour de l'image
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
      container.appendChild(serviceDiv);
    });
  } catch (error) {
    console.error("Erreur lors du chargement des services :", error);
  }
}

// Fonction d'ajout de service
async function submitNewService() {
  const serviceName = document.getElementById("nomServiceInput").value;
  const serviceDescription = document.getElementById(
    "descriptionServiceInput"
  ).value;
  const serviceImage = document.getElementById("imageService").files[0];

  if (!serviceName || !serviceDescription || !serviceImage) {
    alert("Veuillez remplir tous les champs !");
    return;
  }

  const formData = new FormData();
  formData.append("nom", serviceName);
  formData.append("description", serviceDescription);
  formData.append("image", serviceImage);

  try {
    const response = await fetch(
      "https://arcadia2024.alwaysdata.net/arcadia/api/service/new",
      {
        method: "POST",
        body: formData,
      }
    );

    if (response.ok) {
      alert("Service ajouté avec succès !");
      document.getElementById("addServiceForm").reset();
      const modal = bootstrap.Modal.getInstance(
        document.getElementById("AjoutServiceModal")
      );
      modal.hide();
      loadServices();
    } else {
      alert("Erreur lors de l'ajout du service.");
    }
  } catch (error) {
    console.error("Erreur lors de l'appel à l'API :", error);
    alert("Une erreur s'est produite. Veuillez réessayer.");
  }
}

loadServices();

document
  .getElementById("ajout-service-submit")
  .addEventListener("click", submitNewService);
