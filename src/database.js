import newProject from './project';
import { getFirestore, collection, getDocs, setDoc, doc } from 'firebase/firestore/lite';
import { initializeApp } from "firebase/app";



// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBzidT1-UhUINMnDi0nc5y_HMuKsg3N59U",
  authDomain: "todo-list-a4ae4.firebaseapp.com",
  projectId: "todo-list-a4ae4",
  storageBucket: "todo-list-a4ae4.appspot.com",
  messagingSenderId: "370073152951",
  appId: "1:370073152951:web:8409c6afc9c209f85a8c32"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


async function get() {
  const projectsCollection = collection(db, 'projects');
  const projectsSnapshot = await getDocs(projectsCollection);
  let projects = projectsSnapshot.docs.map(doc => doc.data());

  //let projects = JSON.parse(window.localStorage.getItem('projects'));
  if (projects.length == 0) {
    projects = [{ name: 'default' }];
  }

  projects = projects.map((x) => newProject(x.name, x.todos));

  return projects;
}

async function save(projects) {
  // window.localStorage.setItem('projects', JSON.stringify(projects));

  for (const project of projects) {
    delete project.addTodo;
    delete project.saveTodo;
    delete project.remove;
    const docRef = await setDoc(doc(db, "projects", project.name), Object.assign({}, project));
    console.log(docRef);

  }
}

export { get, save };
