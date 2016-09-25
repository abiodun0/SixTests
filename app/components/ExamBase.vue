<template>
  <div>
    <div class="page-header flex">
      <div class="flex fill align-middle-left">
        <h1>Exams</h1>
      </div>
      <div class="header-controls">
        <span class="user-information">
          Logged in as {{user.displayName}}
        </span>
        <img v-bind:src="user.photoURL" />
        <mdl-button id="main-dropdown" class="mdl-button--icon">
          <i class="material-icons">more_vert</i>
        </mdl-button>
        <mdl-menu for="main-dropdown" class="mdl-menu--bottom-right">
          <mdl-menu-item v-link="{ path: '/app/profile'}">Profile</mdl-menu-item>
          <mdl-menu-item @click.prevent="logout">Logout</mdl-menu-item>
        </mdl-menu>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import User from '../models/user'

export default {
  data() {
    return {
      user: {}
    }
  },
  route: {
    data(transition) {
      User.checkLoggedIn(user => {
        if (!user) {
          this.$route.router.go({ name: 'home' })
        }
        transition.next({
          user: user
        })
      });
    },
    waitForData: true
  },
  methods: {
    logout() {
      User.logoutUser((err) => {
        if(!err)
          console.log("Logging out user")
      })
    }
  }
}
</script>