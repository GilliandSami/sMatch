<template>
  <div class="svg-container">
    <svg width="350" height="254" viewBox="0 0 350 254" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M-120 190.544C-120 190.544 -70.278 99.2666 -5.86512 110.835C58.5501 122.403 73.0224 252.553 148.985 248.811C224.947 245.071 231.065 112.254 193.517 73.3714C155.97 34.4916 121.121 81.0426 142.354 109.425C163.587 137.807 275.315 185.885 317.431 122.287C359.545 58.6895 340.866 -34.0152 340.866 -34.0152" stroke="#FF6C19" stroke-width="10" stroke-miterlimit="10"/>
    </svg>
  </div>
  <div class="logo-container">
    <div class="logo">
      <img src="/assets/smatch_logo.png" alt="sMatch Logo" class="logo-image" />
      <p class="logo-text">Connecte-toi pour smatcher !</p>
    </div>
  </div>
</template>

<style scoped>
.svg-container {
  display: flex;
  justify-content: center;
  position: absolute;
  top: -45px; /* Remonte la forme orange */
  width: 100%;
}

.logo-container {
  background-color: #D1B7FF; /* Violet foncé */
  width: 100%;
  height: 60vh; /* Augmente la hauteur du conteneur */
  display: flex;
  flex-direction: column;
  justify-content: flex-start; /* Positionne les éléments vers le haut */
  align-items: center;
  padding-top: 120px; /* Ajoute un espace au-dessus du logo */
  margin: 0;
}

.logo {
  display: flex;
  flex-direction: column; /* Aligne les éléments verticalement */
  align-items: center; /* Centre horizontalement */
  margin-bottom: 0.2rem;
}

.logo-image {
  width: 250px; /* Ajuste la taille selon tes besoins */
  display: block; /* Assure une cohérence dans le flux */
  margin-bottom: 0;
}

.logo-text {
  font-size: 1rem;
  color: #ff8145;
  text-align: center;
  margin-bottom: 20px; 
  margin-top: -70px; /* Ajoute un léger espace entre le logo et le texte */
}
</style>
