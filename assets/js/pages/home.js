async function submitAvis() {
  const pseudoInput = document.getElementById("pseudoAvisInput");
  const commentaireInput = document.getElementById("CommentaireAvisInput");
  const submitButton = document.getElementById("avis-submit");

  submitButton.addEventListener("click", async () => {
    const pseudo = pseudoInput.value.trim();
    const commentaire = commentaireInput.value.trim();

    if (!pseudo || !commentaire) {
      alert("Veuillez remplir tous les champs !");
      return;
    }

    const avisData = {
      pseudo: pseudo,
      commentaire: commentaire,
    };

    try {
      const response = await fetch(
        "https://arcadia2024.alwaysdata.net/arcadia/api/avis/new",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(avisData),
        }
      );

      if (!response.ok) {
        throw new Error(`Erreur HTTP : ${response.status}`);
      }

      // Vous pouvez retirer cette ligne si vous n'avez pas besoin de la réponse JSON
      // const data = await response.json();

      alert("Avis envoyé avec succès !");
      pseudoInput.value = "";
      commentaireInput.value = "";
      const modal = bootstrap.Modal.getInstance(
        document.getElementById("SoumissionAvisModal")
      );
      modal.hide();
    } catch (error) {
      console.error("Erreur lors de l'envoi :", error);
      alert("Une erreur est survenue lors de l'envoi de votre avis.");
    }
  });
}
