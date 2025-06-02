<template>
  
  <nav-bar></nav-bar>

  <div class="container mt-4">
    <!-- Show routed views  -->
    <router-view />
  </div>

</template>

<script>

import NavBar from './components/NavBar.vue';


export default {
  name: 'App',
  components: { NavBar, },
}

</script>


<style>
.router-link-exact-active {
  font-weight: bold;
  color: #42b983;
}

.router-link-active {
  font-weight: bold;
  color: #42b983;
}
</style>