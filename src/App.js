import './App.css';
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';
import { useState } from 'react';

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}

function App() {
  const [newUser, setNewUser] = useState(false);
  const [user, setUser] = useState({
    isSignedIn: false,
    name: '',
    email: '',
    photo: '',
    error: '',
    success: false
  })

  const provider = new firebase.auth.GoogleAuthProvider();
  const handleSignIn = () => {
    firebase.auth().signInWithPopup(provider)
      .then(result => {
        const { displayName, email, photoURL } = result.user;
        const signedInUser = {
          isSignedIn: true,
          name: displayName,
          email: email,
          photo: photoURL
        }
        setUser(signedInUser);
        console.log(displayName, email, photoURL);
      })
      .catch(error => {
        console.log(error);
        console.log(error.message);
      })
  }

  const handleSignOut = () => {
    firebase.auth().signOut()
      .then(res => {
        const signedOutUser = {
          isSignedIn: false,
          name: '',
          email: '',
          photo: ''
        }
        setUser(signedOutUser);
      })
      .catch(err => {

      })
  }

  const handleBlur = (e) => {
    let isFieldValid = true;
    if (e.target.name === 'email') {
      isFieldValid = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(e.target.value);

    }
    if (e.target.name === 'password') {
      const isPasswordValid = e.target.value.length >= 6;
      const passwordHasNumber = /\d{1}/.test(e.target.value);
      isFieldValid = isPasswordValid && passwordHasNumber;
    }
    if (isFieldValid) {
      const newUserInfo = { ...user };
      newUserInfo[e.target.name] = e.target.value;
      setUser(newUserInfo);

    }
  }

  const handleSubmit = (e) => {
    // console.log(user.email,user.password);
    if (user.email && user.password) {
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
        .then(res => {
          const newUserInfo = { ...user };
          newUserInfo.error = '';
          newUserInfo.success=true;
          setUser(newUserInfo);

          console.log(res);

        })
        .catch(error => {
          const newUserInfo = { ...user };
          newUserInfo.error = error.message;
          newUserInfo.success=false;
          setUser(newUserInfo);
        });
    }
    e.preventDefault();
  }

  return (
    <div className="App">
      {
        user.isSignedIn ? <button onClick={handleSignOut}>Sign Out</button> :
          <button onClick={handleSignIn}>Sign In</button>
      }
      {
        user.isSignedIn && <div>
          <h1>Welcome, {user.name}</h1>
          <p>Email: {user.email}</p>
          <img style={{ width: '50%' }} src={user.photo} alt="" />
        </div>
      }

      <h1>Our Own Authentic</h1>
      <input type="checkbox" onChange={()=>setNewUser(!newUser)} name="newUser" id=""/>
      <label htmlFor="newUser">New User Sign Up</label>
      {
        newUser &&
        <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Your name" onBlur={handleBlur} required />
        <br />
        <input type="text" name="email" placeholder="Your email address" onBlur={handleBlur} required />
        <br />
        <input type="password" name="password" placeholder="Your password" onBlur={handleBlur} required />
        <br />
        <input type="submit" value="Sign Up" />
      </form>
      }
      <p style={{ color: "red" }} >{user.error}</p>
      {
        user.success && <p style={{ color: "green" }} >User created successfully</p>
      }
    </div>
  );
}

export default App;
