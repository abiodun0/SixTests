let firebase = require('firebase/app');
require('firebase/auth');
require('firebase/database');

let config = {
  apiKey: "AIzaSyBvhOuLP2l4lHvwRLTYe6epxc9mThjMjMg",
  authDomain: "6ixtests.firebaseapp.com",
  databaseURL: "https://6ixtests.firebaseio.com",
  storageBucket: "project-8199958710675535383.appspot.com",
};

let app = firebase.initializeApp(config);

let database = firebase.database();

let auth = firebase.auth();

export { database, auth }
