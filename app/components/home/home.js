import Vue from 'vue';
import User from '../../models/user';
import HomeTemplate from './home.html'

const HomeComponent = Vue.extend({
  template: HomeTemplate,
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
});

export default HomeComponent;
