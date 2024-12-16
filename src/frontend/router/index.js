import { createRouter, createWebHistory } from "vue-router";
import AuthPage from "../pages/AuthPage.vue";

const routes = [
    {
        path: "/",
        component: AuthPage,
    },
    {
        path: "/home",
        component: () => import("../pages/HomePage.vue"), // Placeholder pour la page d'accueil
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
