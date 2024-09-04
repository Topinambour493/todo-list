import React, {FormEvent, useState} from 'react';
import {useNavigate} from "react-router-dom";
import "./login.css"

const Login = () => {
  let [password, setPassword] = useState("")
  let [username, setUsername] = useState("")
  let navigate = useNavigate()

  function connection(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (password === username && password === "test") {
      navigate("/tasklist")
    } else {
      alert("ERREUR")
    }
  }

  return (
    <div id={"login"}>
      <div id={"containerLogin"}>
        <h1> Bienvenue sur votre Tout doux lisse</h1>
        <form onSubmit={(e: FormEvent<HTMLFormElement>)=>connection(e)}>
          <div className={"inputLogin"}>
            <label>pseudo:</label>
            <input onChange={(e) => setUsername(e.target.value)} value={username}/>
          </div>
          <div className={"inputLogin"}>
            <label>mot de passe:</label>
            <input onChange={(e) => setPassword(e.target.value)} value={password}/>
          </div>
          <button>Connexion</button>
        </form>
      </div>
    </div>
)
};

export default Login;