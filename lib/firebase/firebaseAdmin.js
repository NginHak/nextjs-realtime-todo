import { credential } from "firebase-admin";
import { initializeApp, getApps } from "firebase-admin/app";
import { getDatabase } from "firebase-admin/database"

let firebaseAdmin = getApps()

if (firebaseAdmin.length > 0) {
    firebaseAdmin = firebaseAdmin[0]
} else {
    const serviceAccount = require("./service-key.json");
    firebaseAdmin = initializeApp({
        credential: credential.cert(serviceAccount),
        databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL
    });
}

export const TODO_DB = getDatabase(firebaseAdmin).ref('todo')
