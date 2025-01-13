<template>
    <div class="group-page">
        <BuildingPage />
        <BottomNavBar />
    </div>
</template>

<script>
import BottomNavBar from "../components/BottomNavBar.vue";
import BuildingPage from "../components/BuildingPage.vue";

export default {
    name: "GroupPage",
    components: {
        BottomNavBar,
        BuildingPage,
    },
};
</script>

<style scoped>
.group-page {
    position: relative;
    height: 100vh;
    /* Prend toute la hauteur de la fenêtre */
}
</style>