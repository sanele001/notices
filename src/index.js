import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.API,
  authDomain: "doctor-97c33.firebaseapp.com",
  projectId: "doctor-97c33",
  storageBucket: "doctor-97c33.appspot.com",
  messagingSenderId: "652076597086",
  appId: process.env.APPID,
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

//......................get DOM ELEMENTS

const titleinput = document.getElementById("title");

const bodyinput = document.getElementById("tbody");
// count = number all current users in list
const count = document.getElementById("numberofusers");
const submitbtn = document.getElementById("send");
// to hold all tokens from database
let tokens = [];
// for strange reasons expo notification are limited to 100 per request so we have to split the arrey
let firstPotion = [];
// second potion
let secondPotion = [];

// getting list from database
async function userlist() {
  // firebase syntext
  const querySnapshot = await getDocs(collection(db, "users"));
  querySnapshot.forEach((doc) => {
    // notification field is push
    const notificationtoken = doc.data().push;
    // check if push is not empty

    if (notificationtoken !== "") {
      tokens.push(doc.data().push);
    }
  });

  // display number of user on screen
  count.innerText = tokens.length;
  // dividng the arrey into two potions
  const indx = tokens.length / 2;
  firstPotion = tokens.slice(0, indx);
  secondPotion = tokens.slice(indx + 1);
}

/// events

submitbtn.addEventListener("click", sendingtouser);
document.addEventListener("DOMContentLoaded", userlist);

// fetch sendnotces takes one paratemer

function sendnotices(pushobj) {
  fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    mode: "no-cors",
    headers: {
      host: "exp.host",
      accept: "application/json",
      "accept-encoding": "gzip, deflate",
      "content-type": "application/json",
    },
    body: JSON.stringify(pushobj),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      alert(error);
    });
}

// function calling send
function sendingtouser(e) {
  e.preventDefault();
  // notice object to pass to sendnotices funtion
  const pushobject = {
    to: firstPotion,
    sound: "default",
    title: titleinput.value,
    body: bodyinput.value,
    priority: "high",
  };
  // notice object to pass to sendnoices function
  const pushobject2 = {
    to: secondPotion,
    sound: "default",
    title: titleinput.value,
    body: bodyinput.value,
    priority: "high",
  };
  // calling sendnotices
  sendnotices(pushobject);
  // calling it again to send the remaning list passing object 2
  setTimeout(sendnotices(pushobject2), 2000);
  // reseting forms
  document.getElementById("myForm").reset();
}
