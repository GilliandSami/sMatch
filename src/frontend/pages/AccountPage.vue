<script>
import AccountInformation from "../components/AccountInformation.vue";
import AccountSwitcher from "../components/AccountSwitcher.vue";
import BottomNavBar from "../components/BottomNavBar.vue";

export default {
  name: "AccountPage",
  components: { AccountInformation, AccountSwitcher, BottomNavBar },
  data() {
    return {
      userId: this.$route.params.userId || JSON.parse(localStorage.getItem("userInfo")).id,
      selectedTab: "posts", // Par défaut, affiche les posts de l'utilisateur
    };
  },
  methods: {
    handleTabSelection(tab) {
      this.selectedTab = tab; // Met à jour l'onglet sélectionné
    },
  },
};
</script>

<template>
  <div class="account-page">
    <!-- Informations utilisateur -->
    <AccountInformation :userId="userId" />

    <!-- Commutateur entre Posts et Likes -->
    <AccountSwitcher @tab-selected="handleTabSelection" />

    <!-- Contenu selon l'onglet sélectionné -->
    <div class="content">
      <div v-if="selectedTab === 'posts'">
        <!-- Placeholder pour les posts -->
        <p>Affichage des posts de l'utilisateur</p>
      </div>
      <div v-else>
        <!-- Placeholder pour les likes -->
        <p>Affichage des likes de l'utilisateur</p>
      </div>
    </div>

    <!-- Barre de navigation -->
    <BottomNavBar />
  </div>
</template>

<style scoped>
.account-page {
  padding-top: 120px; /* Espace pour le header et le switcher */
}

.content {
  padding: 10px;
  margin-top: 10px; /* Ajoute de l'espace après le switcher */
}
</style>
