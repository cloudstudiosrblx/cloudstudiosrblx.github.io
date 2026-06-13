import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";

import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js";

import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-storage.js";

/* 🔥 FIREBASE CONFIG */
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "cloudstudios-8eccb.firebaseapp.com",
  projectId: "cloudstudios-8eccb",
  storageBucket: "cloudstudios-8eccb.firebasestorage.app",
  messagingSenderId: "932721099547",
  appId: "1:932721099547:web:893ee8e46bb0d8c521c9be"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

/* ======================
   LOGIN
====================== */

window.login = async function(){
  await signInWithEmailAndPassword(
    auth,
    email.value,
    pass.value
  );
};

window.logout = function(){
  signOut(auth);
};

/* ======================
   POST BLOG
====================== */

window.post = async function(){

  let file = document.getElementById("image").files[0];
  let imageURL = "";

  if(file){
    const storageRef = ref(storage, "posts/" + file.name);
    await uploadBytes(storageRef, file);
    imageURL = await getDownloadURL(storageRef);
  }

  await addDoc(collection(db,"posts"),{
    title: title.value,
    text: text.value,
    image: imageURL,
    time: Date.now()
  });

  alert("Posted!");
};

/* ======================
   DELETE POST
====================== */

window.deletePost = async function(id){
  await deleteDoc(doc(db,"posts",id));
};

/* ======================
   LOAD POSTS (PUBLIC)
====================== */

const q = query(collection(db,"posts"), orderBy("time","desc"));

onSnapshot(q,(snap)=>{
  let html = "";

  snap.forEach(d=>{
    let p = d.data();

    html += `
      <div class="card">
        <h3>${p.title}</h3>
        <p>${p.text}</p>
        ${p.image ? `<img src="${p.image}">` : ""}
      </div>
    `;
  });

  let posts = document.getElementById("posts");
  if(posts) posts.innerHTML = html;
});

/* ======================
   LOAD POSTS (ADMIN)
====================== */

onSnapshot(q,(snap)=>{
  let html = "";

  snap.forEach(d=>{
    let p = d.data();

    html += `
      <div class="card">
        <b>${p.title}</b>
        <p>${p.text}</p>
        <button class="deleteBtn" onclick="deletePost('${d.id}')">Delete</button>
      </div>
    `;
  });

  let adminPosts = document.getElementById("adminPosts");
  if(adminPosts) adminPosts.innerHTML = html;
});

/* ======================
   AUTH UI CONTROL
====================== */

onAuthStateChanged(auth,(user)=>{
  if(user){
    if(document.getElementById("panel"))
      document.getElementById("panel").style.display="block";

    if(document.getElementById("loginBox"))
      document.getElementById("loginBox").style.display="none";
  } else {
    if(document.getElementById("panel"))
      document.getElementById("panel").style.display="none";

    if(document.getElementById("loginBox"))
      document.getElementById("loginBox").style.display="block";
  }
});
