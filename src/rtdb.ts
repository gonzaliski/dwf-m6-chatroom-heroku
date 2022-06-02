import firebase from "firebase"
const app = firebase.initializeApp({
    apiKey:"VRP0w8RRtyt2fGLNFtJuYz0EkCpVHv9tVTI8WBbv",
    dataBaseURL: "https://firestore-m6-default-rtdb.firebaseio.com/",
    projectId:"firestore-m6",
    authDomain:"firestore-m6.firebaseapp.com"
})

const rtdb = firebase.database();

export {rtdb}

