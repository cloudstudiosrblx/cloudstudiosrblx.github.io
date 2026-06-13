import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc
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

/* CONFIG */
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

let editMode = null;

/* LOGIN */
window.login = async () => {
  await signInWithEmailAndPassword(auth, email.value, pass.value);
};

window.logout = () => signOut(auth);

/* BLOG POST */
window.post = async () => {

  let file = image.files[0];
  let imageURL = "";

  if (file) {
    const r = ref(storage, "posts/" + file.name);
    await uploadBytes(r, file);
    imageURL = await getDownloadURL(r);
  }

  if (editMode) {
    await updateDoc(doc(db,"posts",editMode),{
      title: title.value,
      text: text.value,
      image: imageURL
    });
    editMode = null;
  } else {
    await addDoc(collection(db,"posts"),{
      title: title.value,
      text: text.value,
      image: imageURL,
      time: Date.now()
    });
  }

  alert("Saved!");
};

/* DELETE POST */
window.deletePost = async (id) => {
  await deleteDoc(doc(db,"posts",id));
};

/* EDIT POST */
window.editPost = (id, t, txt) => {
  title.value = t;
  text.value = txt;
  editMode = id;
};

/* ADD PROJECT */
window.addProject = async () => {
  await addDoc(collection(db,"projects"),{
    name: pname.value,
    desc: pdesc.value,
    time: Date.now()
  });
};

/* LOAD POSTS */
const q = query(collection(db,"posts"), orderBy("time","desc"));

onSnapshot(q,(snap)=>{
  let html="";

  snap.forEach(d=>{
    let p=d.data();

    html += `
      <div class="card">
        <h3>${p.title}</h3>
        <p>${p.text}</p>
        ${p.image ? `<img src="${p.image}">` : ""}

        <button onclick="deletePost('${d.id}')">Delete</button>
        <button onclick="editPost('${d.id}','${p.title}','${p.text}')">Edit</button>
      </div>
    `;
  });

  if(document.getElementById("adminPosts"))
    adminPosts.innerHTML = html;

  if(document.getElementById("posts"))
    posts.innerHTML = html;
});

/* LOAD PROJECTS */
const qp = query(collection(db,"projects"), orderBy("time","desc"));

onSnapshot(qp,(snap)=>{
  let html="";

  snap.forEach(d=>{
    let p=d.data();

    html += `
      <div class="card">
        <h3>${p.name}</h3>
        <p>${p.desc}</p>
      </div>
    `;
  });

  if(document.getElementById("projects"))
    projects.innerHTML = html;

  if(document.getElementById("adminProjects"))
    adminProjects.innerHTML = html;
});

/* AUTH UI */
onAuthStateChanged(auth,(user)=>{
  if(user){
    panel.style.display="block";
    loginBox.style.display="none";
  } else {
    panel.style.display="none";
    loginBox.style.display="block";
  }
});
