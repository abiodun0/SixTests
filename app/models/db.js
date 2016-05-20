var firebase = require('firebase/app');
require('firebase/auth');
require('firebase/database');

var config = {
  apiKey: "AIzaSyBvhOuLP2l4lHvwRLTYe6epxc9mThjMjMg",
  // authDomain: "6ixtests.firebaseapp.com",
  databaseURL: "https://6ixtests.firebaseio.com",
  storageBucket: "project-8199958710675535383.appspot.com",
};

var app = firebase.initializeApp(config);

var database = firebase.database();

export default database
