let firebase = require('firebase/app');

import { auth, database } from './db';

var User = {
  authenticateUser(next) {
    let provider = new firebase.auth.FacebookAuthProvider();
    provider.addScope('email');
    auth.signInWithPopup(provider).then(result => {
      let token = result.credential.accessToken;
      next()
    }).catch(next);
  },
  checkLoggedIn(next) {
    auth.onAuthStateChanged(next)
  },
  logoutUser(next) {
    auth.signOut().then(next, next)
  }
};

export default User;
