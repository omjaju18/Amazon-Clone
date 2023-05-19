import React, { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "../../firebase";
import { auth } from "../../firebase";

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");

  // Prevent page refreshing
  const signIn = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, Email, Password).then((auth) => {
      if (auth) {
        navigate("/");
      }
    });
  };

  //register logic
  const register = (event) => {
    event.preventDefault(); //stops refresh

    //firebase register here!

    createUserWithEmailAndPassword(auth, Email, Password)
      .then((auth) => {
        //created a new user and logged in and redirect to homepage
        if (auth) {
          navigate("/");
        }
      })
      .catch((event) => alert(event.message));
  };

  return (
    <div className="login">
      <Link to="/">
        <img
          className="login-logo"
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/1024px-Amazon_logo.svg.png"
        />
      </Link>

      <div className="login-container">
        <h1>Sign In</h1>
        <form action="">
          <h5>E-mail</h5>
          <input
            type="email"
            value={Email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <h5>Password</h5>
          <input
            type="password"
            value={Password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit" className="login-signInButton" value={signIn}>
            Sign In
          </button>
        </form>
        <p>
          By signing-in you agree to the AMAZON FAKE CLONE Conditions of Use &
          Sale. Please see our Privacy Notice, our Cookies Notice and our
          Interest-Based Ads Notice.
        </p>
        <button onClick={register} className="login-registerButton">
          Create your Amazon Account
        </button>

        {/* <div className="login-signUp">
          <p>New to Amazon?</p>
          <Link to="signUp">
            <button className="login-signUpButton">
              Create your Amazon account
            </button>
          </Link>
        </div>
  */}
      </div>
    </div>
  );
}
export default Login;
