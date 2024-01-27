import { createRouter, createWebHashHistory } from "vue-router";
import Home from "@/pages/Home";
import Restaurant from "@/pages/Restaurant";
import User from "@/pages/User";
import Login from "@/pages/Login";
import SignUp from "@/pages/SignUp";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/restaurant/:id",
    name: "Restaurant",
    component: Restaurant,
  },
  {
    path: "/user/:id",
    name: "User",
    component: User,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/signUp",
    name: "SignUp",
    component: SignUp,
  },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  //Un-collapse the navbar on page change
  const navbar = document.querySelector(".navbar-collapse");
  if (navbar) {
    navbar.classList.remove("show");
  }

  //Set scroll all the way up
  window.scrollTo(0, 0);

  next();
});
