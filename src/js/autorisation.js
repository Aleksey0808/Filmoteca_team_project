import { refs } from './refs';
import { toggleModal } from './modal-registration';
import { initializeApp } from 'firebase/app';
import { Notify } from 'notiflix';
import { getFirestore, setDoc, doc } from 'firebase/firestore';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from 'firebase/auth';

// Firebase AUTH

const firebaseConfig = {
  apiKey: 'AIzaSyDpHH4vTWioKzjyjXO2I80-uE6v02JiNMc',
  authDomain: 'filmoteka-students-goit.firebaseapp.com',
  projectId: 'filmoteka-students-goit',
  storageBucket: 'filmoteka-students-goit.appspot.com',
  messagingSenderId: '474370553773',
  appId: '1:474370553773:web:273214bc0fea8263371324',
  measurementId: 'G-8CJGR7QN75',
};

initializeApp(firebaseConfig);
const db = getFirestore();

const auth = getAuth();
let name;

const loginForm = document.querySelector('.login-form');
const signupForm = document.querySelector('.registration-form');
const logout = document.querySelector('.js-btn-exit');
const logBtnContainer = document.querySelector('.js-btn-in');
const exitBtnContainer = document.querySelector('.js-btn-exit');



signupForm.addEventListener('submit', e => {
  e.preventDefault();
  name = signupForm.user_name.value;
  const email = signupForm.mail.value;
  const password = signupForm.password.value;

  const ObjectDataName = {
    name: `${name}`,
  };

  createUserWithEmailAndPassword(auth, email, password)
    .then(cred => {
      // Бажано сюди впихнути НЕТЛІФАЙ
      Notify.success(`The user: ${name} has been created`);
      logBtnContainer.hidden = true;
      exitBtnContainer.hidden = false;
      signupForm.reset();
      toggleModal();
      refs.libraryHidden.classList.replace('visually-hidden', 'nav__item');
    })
    .catch(err => {
      // netlify wrongs
      Notify.failure(err.message);
    });

  // СТВОРИТИ в БД по НЕЙМ БАЗУ ДАННИх, яка буде слідкувати за списками
  const newUserRef = doc(db, email, 'username');
  setDoc(newUserRef, ObjectDataName, { merge: true }).catch(err =>
    Notify.failure(err.message)
  );
  // addDoc(colRef, {
  //   Or u can create Ur specific object
  // })
});

loginForm.addEventListener('submit', e => {
  e.preventDefault();
  name = loginForm.login.value;
  const email = loginForm.mail.value;
  const password = loginForm.password.value;

  signInWithEmailAndPassword(auth, email, password)
    .then(cred => {
      Notify.success(`user: ${name} logged in`);
      logBtnContainer.hidden = true;
      exitBtnContainer.hidden = false;
      toggleModal();
      refs.libraryHidden.classList.replace('visually-hidden', 'nav__item');
    })
    .catch(err => {
      Notify.failure(err.message);
    });
});

logout.addEventListener('click', e => {
  signOut(auth)
    .then(() => {
      Notify.info(`The user logged out`);
      logBtnContainer.hidden = false;
      exitBtnContainer.hidden = true;
      refs.libraryHidden.classList.replace('nav__item', 'visually-hidden');
    })
    .catch(err => {
      Notify.failure(err.message);
    });
});

export async function checkUserStatus() {
const userStatus =  await onAuthStateChanged(auth, user => {
    if (!user) {
      
      logBtnContainer.hidden = false;
      exitBtnContainer.hidden = true;
      refs.libraryHidden.classList.replace('nav__item', 'visually-hidden');
    } else{
      logBtnContainer.hidden = true;
      exitBtnContainer.hidden = false;
      refs.libraryHidden.classList.replace('visually-hidden', 'nav__item');
    }
  })
  
}

checkUserStatus();



refs.loginFormBtn.addEventListener('click', e => {
  refs.logForm.classList.add('current');
  refs.regForm.classList.remove('current');
  refs.loginFormBtn.classList.toggle('target-btn');
  refs.regFormBtn.classList.toggle('target-btn');
});
refs.regFormBtn.addEventListener('click', e => {
  refs.regForm.classList.add('current');
  refs.logForm.classList.remove('current');
  refs.loginFormBtn.classList.toggle('target-btn');
  refs.regFormBtn.classList.toggle('target-btn');
});
