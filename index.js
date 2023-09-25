import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { initializeApp } from '@react-native-firebase/app';
import '@react-native-firebase/firestore';
import '@react-native-firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyDd5GLfEdUEB60K4wUxqRqpzSbANgq2dLU",
    authDomain: "karthi-acde8.firebaseapp.com",
    projectId: "karthi-acde8",
    storageBucket: "karthi-acde8.appspot.com",
    messagingSenderId: "854640311273",
    appId: "1:854640311273:web:4f1b1d6a848365ec52a978",
    measurementId: "G-M58XKRTFWR",
};

initializeApp(firebaseConfig);

AppRegistry.registerComponent(appName, () => App);
