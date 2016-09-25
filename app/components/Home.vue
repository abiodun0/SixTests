<template>
  <div class="main-montage-abs flex">
    <div class="logo-container flex fill align-middle-center column-layout">
      <div class="montage-image">
        <img src="/build/img/logo_new.png" />
      </div>
      <div class="montage-actions">
        <a class="main-montage-btn" @click.prevent="loginUser">Connect w/ Facebook</a>
      </div>
    </div>
  </div>
</template>

<script>
import User from '../models/user';

export default {
  route: {
    data() {
      User.checkLoggedIn(user => {
        if (user) {
          this.$route.router.go({ name: 'exams' });
        }
      });
    }
  },
  methods: {
    loginUser() {
      User.authenticateUser(() => {
        // Do some stuff before redirect happens
      })
    }
  }
}
</script>