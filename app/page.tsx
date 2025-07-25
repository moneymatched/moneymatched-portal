'use client'

import { useState } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA-yJ-wFom_zuv3ZxmPgFmQlXprwW1Le6A",
  authDomain: "moneymatched-claims-portal.firebaseapp.com",
  projectId: "moneymatched-claims-portal",
  storageBucket: "moneymatched-claims-portal.firebasestorage.app",
  messagingSenderId: "1082704961718",
  appId: "1:1082704961718:web:92156223abca2c137d0617",
  measurementId: "G-SQ99QB0ZXR"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [claimants, setClaimants] = useState([]);

  const login = async () => {
    const result = await signInWithPopup(auth, provider);
    setUser(result.user);
  };

  const uploadClaimant = async () => {
    const name = prompt("Enter claimant name");
    const amount = prompt("Enter claim amount");
    const newClaimant = { name, amount, status: "Pending Signature" };
    await addDoc(collection(db, "claimants"), newClaimant);
    setClaimants([...claimants, newClaimant]);
  };

  const fetchClaimants = async () => {
    const snapshot = await getDocs(collection(db, "claimants"));
    const data = snapshot.docs.map(doc => doc.data());
    setClaimants(data);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Claim Management Portal</h1>

        {!user ? (
          <button onClick={login} className="bg-blue-600 text-white px-4 py-2 rounded mb-4">
            Login with Google
          </button>
        ) : (
          <p className="mb-4">Welcome, {user.displayName}</p>
        )}

        <div className="grid gap-6">
          <div className="rounded-2xl shadow p-6 bg-white">
            <h2 className="text-xl font-semibold mb-2">1. Upload Claimants</h2>
            <button onClick={uploadClaimant} className="bg-blue-600 text-white px-4 py-2 rounded">
              Add Claimant
            </button>
          </div>

          <div className="rounded-2xl shadow p-6 bg-white">
            <h2 className="text-xl font-semibold mb-2">2. Generate Claim Packages</h2>
            <button className="bg-blue-600 text-white px-4 py-2 rounded">Generate Packages</button>
          </div>

          <div className="rounded-2xl shadow p-6 bg-white">
            <h2 className="text-xl font-semibold mb-2">3. Notarize & Submit</h2>
            <button className="bg-green-600 text-white px-4 py-2 rounded">Submit for Notary</button>
          </div>

          <div className="rounded-2xl shadow p-6 bg-white">
            <h2 className="text-xl font-semibold mb-2">4. Track Claim Status</h2>
            <button onClick={fetchClaimants} className="mb-2 bg-blue-600 text-white px-4 py-2 rounded">
              Refresh
            </button>
            <table className="w-full mt-4 text-sm">
              <thead>
                <tr>
                  <th className="text-left">Name</th>
                  <th className="text-left">Amount</th>
                  <th className="text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {claimants.map((c, i) => (
                  <tr key={i}>
                    <td>{c.name}</td>
                    <td>{c.amount}</td>
                    <td className="text-yellow-600">{c.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}