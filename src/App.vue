<template>
  <div id="app">
    <b-navbar id="nav" toggleable="sm" type="light" variant="primary" class="navbar-default navbar-static-top">
      <b-navbar-toggle target="nav-text-collapse"></b-navbar-toggle>
      <router-link to="/">
        <b-navbar-brand class="font-weight-bold text-white">
          <span class="text-warning">MuLeTheory</span>
          <font-awesome-icon icon="music" class="ml-3 text-white"/>
        </b-navbar-brand>
      </router-link>

      <b-collapse id="nav-text-collapse" is-nav>
        <b-navbar-nav>
          <!-- <b-nav-item v-for="route in $router.options.routes" :key="route.path"> -->
          <b-nav-item v-for="route in menuItems" :key="route.path">
            <router-link
                :to="route.path"
                class="btn btn-block text-left text-white"
                :active-class="route.name!=='home'?'text-warning':''"
            >{{route.title}}
            </router-link>
          </b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <b-container fluid>
      <keep-alive include="Game2">
        <router-view/>
      </keep-alive>
    </b-container>
  </div>
</template>

<script>
import router from "./router";

export default {
  name: "App",
  data() {
    return {
      menuItems: router.options.routes.filter(route => !route.hide),
    };
  },
};
</script>

<style lang="scss">
@import "assets/main.scss";

body {
  overflow-x: hidden;
  overflow-y: scroll;
  padding-bottom: 1rem;
}

#nav {
  margin-bottom: .5em;
}
</style>