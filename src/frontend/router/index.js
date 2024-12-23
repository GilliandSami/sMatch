import { createRouter, createWebHistory } from "vue-router";
import AuthPage from "../pages/AuthPage.vue";
import HomePage from "../pages/HomePage.vue";

const routes = [
    {
        path: "/",
        component: AuthPage,
        meta: { requiresAuth: false },
    },
    {
        path: "/home",
        component: HomePage,
        meta: { requiresAuth: true },
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    const isAuthenticated = localStorage.getItem("jwt");

    if (to.meta.requiresAuth && !isAuthenticated) {
        next("/");
        console.log("Vous devez être connecté pour accéder à cette page.");
    } else {
        next();
        console.log("Vous êtes connecté.");
    }
});

export default router;
