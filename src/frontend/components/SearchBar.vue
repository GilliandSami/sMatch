<script>
export default {
  name: "SearchBar",
  props: {
    modelValue: String, // Liaison bidirectionnelle avec la valeur de recherche
  },
  emits: ["update:modelValue"], // Permet d'émettre des événements pour mettre à jour la valeur du parent
};
</script>

<template>
  <div class="search-bar">
    <span class="material-icons">search</span>
    <input
      type="text"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      placeholder="Rechercher des sMatchers..."
    />
  </div>
</template>

<style scoped>
.search-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  padding: 10px 15px;
  background-color: #f0f0f0; /* Fond gris clair */
  border-radius: 25px; /* Bords arrondis */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Légère ombre */
  z-index: 1000; /* Toujours visible au-dessus */
  margin: 40px; /* Marges pour espacer des bords */
}

.search-bar span.material-icons {
  font-size: 24px;
  color: gray; /* Couleur de l'icône */
  margin-right: 10px;
}

.search-bar input {
  flex-grow: 1;
  border: none;
  outline: none;
  font-size: 16px;
  color: #333;
  background-color: transparent;
}

.search-bar input::placeholder {
  color: gray; /* Placeholder gris */
  font-size: 14px;
}
</style>
