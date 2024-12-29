<script>
import SearchBar from "../components/SearchBar.vue";
import GridCard from "../components/GridCard.vue"; // Importation du composant GridCard
import BottomNavBar from "../components/BottomNavBar.vue";

export default {
  name: "SearchPage",
  components: {
    SearchBar,
    GridCard,
    BottomNavBar,
  },
  data() {
    return {
      searchQuery: "", // Stocker la valeur de recherche
    };
  },
};
</script>

<template>
  <div class="search-page">
    <!-- Barre de recherche -->
    <SearchBar v-model="searchQuery" />

    <!-- Grille des utilisateurs -->
    <div class="user-grid">
      <GridCard :searchQuery="searchQuery" />
    </div>

    <!-- Barre de navigation -->
    <BottomNavBar />
  </div>
</template>

<style scoped>
.search-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  justify-content: space-between;
  background-color: #f8f9fa; /* Couleur de fond douce */
  padding-top: 70px; /* Pour compenser la barre de recherche fixe */
}

.user-grid {
  flex-grow: 1;
  padding: 20px;
  overflow-y: auto; /* Permet de scroller si le contenu dépasse */
}
</style>
