const apiUrl = "https://arcadia2024.alwaysdata.net/arcadia/api/";

const token = getToken();
console.log(token);

function validatePassword(input) {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/;
  const passwordUser = input.value;
  if (passwordUser.match(passwordRegex)) {
    input.classList.add("is-valid");
    input.classList.remove("is-invalid");
    return true;
  } else {
    input.classList.remove("is-valid");
    input.classList.add("is-invalid");
    return false;
  }
}

async function changePassword() {
  const passwordInput = document.getElementById("PasswordInput");
  const validatePasswordInput = document.getElementById(
    "ValidatePasswordInput"
  );

  const password = passwordInput.value;
  const confirmPassword = validatePasswordInput.value;

  // Vérification que les mots de passe correspondent
  if (password !== confirmPassword) {
    alert("Les mots de passe ne correspondent pas.");
    return;
  }

  const updatedPassword = { password };

  try {
    const response = await fetch(`${apiUrl}account/edit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-AUTH-TOKEN": token,
      },
      body: JSON.stringify(updatedPassword),
    });

    if (response.ok) {
      alert("Mot de passe modifié avec succès.");
      window.location.href = "/account";
    } else {
      const errorText = await response.text();
      console.error("Erreur API :", errorText);
      throw new Error("Erreur lors de la modification du mot de passe.");
    }
  } catch (error) {
    console.error(error.message);
    alert("Une erreur est survenue. Veuillez réessayer.");
  }
}

document
  .getElementById("account-password-form")
  .addEventListener("submit", (e) => {
    e.preventDefault();
    changePassword();
  });
