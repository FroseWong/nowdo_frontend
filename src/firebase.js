// firebase.js
import { initializeApp } from 'firebase/app'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
    apiKey: "AIzaSyBIUzNQZOn0zE-AfLy4SSgKYqfYA-4eUl0",
    authDomain: "test-da97e.firebaseapp.com",
    projectId: "test-da97e",
    storageBucket: "test-da97e.appspot.com",
    messagingSenderId: "465595626603",
    appId: "1:465595626603:web:c76a7825faee3c7d686d2e"
}

const app = initializeApp(firebaseConfig)
const storage = getStorage(app)

export { storage }
