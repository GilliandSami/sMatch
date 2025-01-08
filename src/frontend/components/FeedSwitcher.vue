<script>
export default {
  name: "FeedSwitcher",
  data() {
    return {
      selectedFeed: "mes-smatchs", // Valeur par défaut
    };
  },
  methods: {
    selectFeed(feed) {
      this.selectedFeed = feed;
      this.$emit("feed-selected", feed); // Émet l'événement vers le parent
    },
  },
};
</script>

<template>
  <div class="feed-switcher">
    <button :class="{ 'active': selectedFeed === 'mes-smatchs' }" @click="selectFeed('mes-smatchs')">
      Mes Smatchs
    </button>
    <button :class="{ 'active': selectedFeed === 'trompe-tes-smatchs' }" @click="selectFeed('trompe-tes-smatchs')">
      Trompe tes Smatchs
    </button>
    <div class="indicator" :class="selectedFeed"></div>
  </div>
</template>

<style scoped>
.feed-switcher {
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background-color: white;
  padding: 10px 0;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid #ddd;
  z-index: 100;
}

.feed-switcher button {
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
}

.feed-switcher button.active {
  color: #D1B7FF;
}

.indicator {
  position: absolute;
  bottom: 0;
  height: 3px;
  width: 50%;
  background-color: #D1B7FF;
  transition: transform 0.3s ease;
}

.indicator.mes-smatchs {
  transform: translateX(-50%);
}

.indicator.trompe-tes-smatchs {
  transform: translateX(50%);
}
</style>