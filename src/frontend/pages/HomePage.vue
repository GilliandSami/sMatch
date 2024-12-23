<script>
import FeedSwitcher from "../components/FeedSwitcher.vue";
import BottomNavBar from "../components/BottomNavBar.vue";
import CreatePostForm from "../components/CreatePostForm.vue";

export default {
  name: "HomePage",
  components: {
    FeedSwitcher,
    BottomNavBar,
    CreatePostForm,
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
    <!-- Formulaire de création de post -->
    <CreatePostForm />
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
  padding-top: 120px; /* Ajusté pour prendre en compte le FeedSwitcher et CreatePostForm */
}
.feed-content {
  padding: 20px;
  margin-bottom: 60px; /* Espace pour la BottomNavBar */
}
</style>
