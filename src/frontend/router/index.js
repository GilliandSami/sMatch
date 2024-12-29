import { createRouter, createWebHistory } from "vue-router";
import AuthPage from "../pages/AuthPage.vue";
import HomePage from "../pages/HomePage.vue";
// import AccountPage from "../pages/AccountPage.vue";
import SearchPage from "../pages/SearchPage.vue";
// import UserProfilePage from "../pages/UserProfilePage.vue";

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
    // {
    //     path: "/profile/:userId", // Nouvelle route dynamique pour les profils utilisateurs
    //     component: UserProfilePage,
    //     meta: { requiresAuth: true },
    // },
    {
        path: "/search",
        component: SearchPage,
        meta: { requiresAuth: true },
    },
    // {
    //     path: "/account",
    //     component: AccountPage,
    //     meta: { requiresAuth: true },
    // },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    const isAuthenticated = localStorage.getItem("jwt");

    if (to.meta.requiresAuth && !isAuthenticated) {
        next("/");
    } else {
        next();
    }
});

export default router;
