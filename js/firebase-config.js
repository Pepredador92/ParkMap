// js/firebase-config.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getDatabase,
  ref,
  push,
  remove,
  onValue,
  set
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyD1NVmb8RsiglfNQnfAc2fwhMmFNxZ-Otg",
  authDomain: "parkmap-aed9d.firebaseapp.com",
  databaseURL: "https://parkmap-aed9d-default-rtdb.firebaseio.com/",
  projectId: "parkmap-aed9d",
  storageBucket: "parkmap-aed9d.firebasestorage.app",
  messagingSenderId: "859451262352",
  appId: "1:859451262352:web:4bccf4d530100684455f15"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export {
  database,
  ref,
  push,
  remove,
  onValue,
  set
};
