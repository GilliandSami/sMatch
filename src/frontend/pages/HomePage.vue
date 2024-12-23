<script>
import FeedSwitcher from "../components/FeedSwitcher.vue";
import BottomNavBar from "../components/BottomNavBar.vue";

export default {
  name: "HomePage",
  components: {
    FeedSwitcher,
    BottomNavBar,
  },
  data() {
    return {
      currentFeed: "mes-smatchs", // Fil d'actualité sélectionné
    };
  },
  methods: {
    onFeedSelected(feed) {
      this.currentFeed = feed;
      console.log(`Fil d'actualité sélectionné : ${feed}`);
    },
  },
};
</script>

<template>
  <div class="home-page">
    <!-- Composant de sélection -->
    <FeedSwitcher @feed-selected="onFeedSelected" />
    <!-- Contenu dynamique selon le fil -->
    <div class="feed-content">
      <p v-if="currentFeed === 'mes-smatchs'">
        Contenu des utilisateurs suivis
      </p>
      <p v-else-if="currentFeed === 'trompe-tes-smatchs'">
        Contenu aléatoire global
      </p>
    </div>
    <!-- Barre de navigation -->
    <BottomNavBar />
  </div>
</template>

<style scoped>
.home-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding-top: 60px; /* Évite le chevauchement avec le FeedSwitcher */
}

.feed-content {
  flex: 1; /* Occupe l'espace restant */
  overflow-y: auto;
  padding: 20px;
}

.bottom-nav {
  position: fixed;
  bottom: 0;
  width: 100%;
}
</style>
