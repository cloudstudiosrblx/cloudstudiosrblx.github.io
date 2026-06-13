import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-storage.js";

/* 🔥 YOUR FIREBASE CONFIG */
const firebaseConfig = {
  apiKey: "AIzaSyD7YZOnBGK3qCyYd0plmrot_3YiLaxz9Lw",
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

/* =========================
   LOGIN SYSTEM
========================= */

window.login = async function(){
  let email = document.getElementById("email").value;
  let pass = document.getElementById("pass").value;

  await signInWithEmailAndPassword(auth, email, pass);
};

window.logout = function(){
  signOut(auth);
};

/* =========================
   BLOG POST
========================= */

window.post = async function(){

  let file = document.getElementById("image").files[0];
  let imageUrl = "";

  if(file){
    const storageRef = ref(storage, "posts/" + file.name);
    await uploadBytes(storageRef, file);
    imageUrl = await getDownloadURL(storageRef);
  }

  await addDoc(collection(db,"posts"),{
    title: title.value,
    text: text.value,
    image: imageUrl,
    time: Date.now()
  });

  alert("Posted!");
};

/* =========================
   LOAD POSTS (PUBLIC)
========================= */

const q = query(collection(db,"posts"), orderBy("time","desc"));

onSnapshot(q,(snap)=>{
  let html = "";

  snap.forEach(doc=>{
    let p = doc.data();

    html += `
      <div class="card">
        <h3>${p.title}</h3>
        <p>${p.text}</p>
        ${p.image ? `<img src="${p.image}" style="width:100%;border-radius:10px;">` : ""}
      </div>
    `;
  });

  const posts = document.getElementById("posts");
  if(posts) posts.innerHTML = html;
});

/* =========================
   SHOW ADMIN PANEL
========================= */

onAuthStateChanged(auth,(user)=>{
  const panel = document.getElementById("panel");
  const loginBox = document.getElementById("loginBox");

  if(user){
    if(panel) panel.style.display = "block";
    if(loginBox) loginBox.style.display = "none";
  } else {
    if(panel) panel.style.display = "none";
    if(loginBox) loginBox.style.display = "block";
  }
  import { deleteDoc, doc } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";
  }
});
