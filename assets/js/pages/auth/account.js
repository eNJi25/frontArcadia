async function loadUserAccount() {
  try {
    const response = await fetch(
      "https://arcadia2024.alwaysdata.net/arcadia/api/account/me",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Erreur lors du chargement des données utilisateur.");
    }

    const userData = await response.json();

    const container = document.getElementById("account-container");
    container.innerHTML = `
      <div class="container-fluid m-0 p-0">
        <div class="row hero-scene text-center text-color w-100 m-0">
          <div class="hero-scene-content">
            <img class="img-hero" src="../assets/images/hero-accueil.jpg" alt="Mon compte">
            <h1 class="hero-content">Mon compte</h1>
          </div>
        </div>
        <form id="account-form">
          <div class="mb-3">
            <label for="NomInput" class="form-label">Nom</label>
            <input type="text" class="form-control" id="NomInput" name="Nom" value="${userData.nom}">
          </div>
          <div class="mb-3">
            <label for="PrenomInput" class="form-label">Prénom</label>
            <input type="text" class="form-control" id="PrenomInput" name="Prenom" value="${userData.prenom}">
          </div>
          <div class="mb-3">
            <label for="EmailInput" class="form-label">Email</label>
            <input type="email" class="form-control" id="EmailInput" name="Email" value="${userData.email}">
          </div>
          <div class="text-center">
            <button type="submit" class="btn btn-primary">Modifier mes informations</button>
          </div>
        </form>
        <div class="text-center pt-3">
          <a href="/editPassword">Cliquez ici pour modifier votre mot de passe</a>
        </div>
      </div>
    `;

    const form = document.getElementById("account-form");
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const updatedUser = {
        nom: document.getElementById("NomInput").value,
        prenom: document.getElementById("PrenomInput").value,
        email: document.getElementById("EmailInput").value,
      };

      try {
        const updateResponse = await fetch(
          "https://arcadia2024.alwaysdata.net/arcadia/api/account/me",
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedUser),
          }
        );

        if (updateResponse.ok) {
          alert("Informations mises à jour avec succès.");
        } else {
          throw new Error("Erreur lors de la mise à jour des informations.");
        }
      } catch (error) {
        console.error(error.message);
        alert("Une erreur est survenue. Veuillez réessayer.");
      }
    });
  } catch (error) {
    console.error(error.message);
    alert("Impossible de charger les informations du compte.");
  }
}

loadUserAccount();
