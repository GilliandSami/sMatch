<script>
export default {
  name: "AccountSwitcher",
  data() {
    return {
      selectedTab: "posts", // Onglet sélectionné par défaut (Posts)
    };
  },
  methods: {
    selectTab(tab) {
      this.selectedTab = tab;
      this.$emit("tab-selected", tab); // Émet l'événement vers le parent
      console.log("Onglet sélectionné :", tab);
    },
  },
};
</script>


<template>
  <div class="account-switcher">
    <!-- Onglet Posts -->
    <button :class="{ 'active': selectedTab === 'posts' }" @click="selectTab('posts')">
      <span class="material-icons">grid_view</span> Posts
    </button>
    <!-- Onglet Likes -->
    <button :class="{ 'active': selectedTab === 'likes' }" @click="selectTab('likes')">
      <span class="material-icons">favorite</span> Favoris
    </button>
    <!-- Barre indicatrice -->
    <div class="indicator" :class="selectedTab"></div>
  </div>
</template>

<style scoped>
.account-switcher {
  display: flex;
  position: fixed;
  top: 250px; /* En dessous du composant AccountInformation */
  left: 0;
  right: 0;
  background-color: white;
  padding: 10px 0;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid #ddd;
  z-index: 99;
}

.account-switcher button {
  flex: 1;
  padding: 10px;
  border: none;
  background: none;
  color: gray;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  outline: none;
  position: relative;
  display: flex; /* Permet d'aligner l'icône et le texte */
  align-items: center; /* Centre verticalement */
  justify-content: center; /* Centre horizontalement */
  gap: 5px; /* Espace entre l'icône et le texte */
}

.account-switcher button.active {
  color: #ff6c19; /* Couleur violette */
}

.material-icons {
  font-size: 20px; /* Taille des icônes */
}
.indicator {
  position: absolute;
  bottom: 0;
  height: 3px;
  width: 50%;
  background-color: #ff6c19;
  transition: transform 0.3s ease;
}

.indicator.posts {
  transform: translateX(-50%);
}

.indicator.likes {
  transform: translateX(50%);
}
</style>
