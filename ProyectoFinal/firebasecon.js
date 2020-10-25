var firebaseConfig = {
    apiKey: "AIzaSyCuyaG1zPv63VICawS7TA71cd6ndVf9vK8",
    authDomain: "autorizacion-67410.firebaseapp.com",
    databaseURL: "https://autorizacion-67410.firebaseio.com",
    projectId: "autorizacion-67410",
    storageBucket: "autorizacion-67410.appspot.com",
    messagingSenderId: "111149213958",
    appId: "1:111149213958:web:30259361cbb3fcef8f5687"


};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
auth.languageCode = 'es';
