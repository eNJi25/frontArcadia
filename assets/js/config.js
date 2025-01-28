// Fontion pour mettre un texte tout en majuscule
function toUpperCase(text) {
  return text.toUpperCase();
}

// Fonction pour récupérer les données avec fetch et gérer les erreurs
async function fetchData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Erreur HTTP : ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Une erreur est survenue :", error);
    return null;
  }
}
