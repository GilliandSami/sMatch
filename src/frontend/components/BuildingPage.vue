<template>
    <div class="building-page">
        <img src="../assets/construction.png" alt="En construction" class="construction-image" />
        <p class="construction-text">Page en construction, vous pourrez bientôt sMatcher plus de personnes !</p>
    </div>
</template>

<script>
export default {
    name: "BuildingPage",
};
</script>

<style scoped>
.building-page {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    /* Prend toute la hauteur de la page */
    background-color: #f9f9f9;
}

.construction-image {
    width: 200px;
    /* Taille de l'image */
    margin-bottom: 20px;
    /* Espace entre l'image et le texte */
}

.construction-text {
    font-size: 20px;
    /* Taille du texte */
    font-weight: normal;
    color: #555;
    /* Couleur du texte */
    text-align: center;
    padding: 0 20px;
    /* Espacement pour éviter que le texte colle aux bords */
}
</style>