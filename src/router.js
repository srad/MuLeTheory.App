import Vue from "vue";
import Router from "vue-router";

import Home from "./views/Home.vue";
import Exercise from "./views/Tapping";
import Dashboard from "./views/Dashboard";
import Help from "./views/Help";
import About from "./views/About.vue";
import Imprint from "./views/Imprint.vue";

Vue.use(Router);

export default new Router({
  routes: [
    {path: "/", name: "home", component: Home, title: "Home"},
    {path: "/exercise", name: "exercise", component: Exercise, title: "Exercise"},
    {path: "/dashboard", name: "dashboard", component: Dashboard, title: "Dashboard"},
    // {path: "/help", name: "help", component: Help, title: "Help"},
    {path: "/imprint", name: "imprint", component: Imprint, title: "Impressum & Datenschutz"},
    {path: "/about", name: "about", component: About, title: "About"},
  ],
});
