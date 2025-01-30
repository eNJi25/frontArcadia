const token = getToken();

async function getInfosUser() {
  if (!token) {
    alert("Vous devez être connecté pour accéder à cette page.");
    window.location.href = "/login";
    return null;
  }

  const myHeaders = new Headers();
  myHeaders.append("X-AUTH-TOKEN", token);

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  try {
    const response = await fetch(apiUrl + "account/me", requestOptions);

    if (!response.ok) {
      throw new Error(`Erreur API : ${response.status}`);
    }

    const result = await response.json();

    return result;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des données utilisateur :",
      error
    );
    return null;
  }
}

async function loadUserAccount() {
  const userData = await getInfosUser();

  if (!userData) {
    console.error("Aucune donnée utilisateur reçue.");
    return;
  }

  const container = document.getElementById("account-container");

  if (!container) {
    console.error("L'élément #account-container est introuvable.");
    return;
  }

  container.innerHTML = `
      <form id="account-form" class="d-flex flex-column align-items-center">
        <div class="mb-3 w-50">
          <label for="NomInput" class="form-label">Nom</label>
          <input type="text" class="form-control" id="NomInput" name="Nom" value="${
            userData.nom || ""
          }">
        </div>
        <div class="mb-3 w-50">
          <label for="PrenomInput" class="form-label">Prénom</label>
          <input type="text" class="form-control" id="PrenomInput" name="Prenom" value="${
            userData.prenom || ""
          }">
        </div>
        <div class="mb-3 w-50">
          <label for="EmailInput" class="form-label">Email</label>
          <input type="email" class="form-control" id="EmailInput" name="Email" value="${
            userData.email || ""
          }">
        </div>
        <div class="text-center w-50">
          <button type="submit" class="btn btn-primary">Modifier mes informations</button>
        </div>
      </form>
      <div class="text-center pt-3">
        <a href="/editPassword" class="text-titre">Cliquez ici pour modifier votre mot de passe</a>
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
      const submitButton = form.querySelector("button[type='submit']");
      submitButton.disabled = true;

      const updateResponse = await fetch(`${apiUrl}account/edit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-AUTH-TOKEN": getToken(),
        },
        body: JSON.stringify(updatedUser),
      });

      if (updateResponse.ok) {
        alert("Informations mises à jour avec succès.");
      } else {
        console.error("Erreur API :", await updateResponse.text());
        throw new Error("Erreur lors de la mise à jour des informations.");
      }
    } catch (error) {
      console.error(error.message);
      alert("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      submitButton.disabled = false;
    }
  });
}

loadUserAccount();
