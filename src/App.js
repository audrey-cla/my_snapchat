import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
} from "react-router-dom";
import Cookies from 'universal-cookie';
const cookies = new Cookies();

class App extends Component {
  constructor() {
    super();
    this.state = {
      user: [],
      token: [],

    }
  }
 
  render() {
if (cookies.get('token')){
    return (
      <div className="App">
        <Router>
        <nav className="navbar navbar-expand-lg navbar-light bg-light"> <div className="navbar-nav"> 
            <Link className="nav-item nav-link" to="/">Home</Link>
            <Link className="nav-item nav-link" to="/logout">Logout</Link>
            <Link className="nav-item nav-link" to="/snap">Send a snap</Link>
          </div>
   </nav>
        <Switch>
          <Route path="/inscription" component={Inscription} />
          <Route path="/logout" component={Logout} />
          <Route path="/Login" component={Login} />
          <Route path="/snap" component={Snap} />
          <Route path="/" component={Home} />
        </Switch>
        </Router>
        <div></div>
      </div>
    );
}
else {
  return (
    <div className="App">
      <Router>
      <nav className="navbar navbar-expand-lg navbar-light bg-light"> <div className="navbar-nav"> 
          <Link className="nav-item nav-link" to="/inscription">inscription</Link>
          <Link className="nav-item nav-link" to="/login">Login</Link>
        </div>
 </nav>
      <Switch>
        <Route path="/inscription" component={Inscription} />
        <Route path="/logout" component={Logout} />
        <Route path="/Login" component={Login} />
        <Route path="/" component={Home} />
      </Switch>
      </Router>
      <div></div>
    </div>
  );
}
  }
}

class Home extends React.Component { 
  constructor(props) {
    super(props);
    this.state = {
    email : [],
     token : []
    }
  }
  render() {     
	if (cookies.get('token')) {
    return(
      <div>
        ici c'est la home {cookies.get('email')};
			</div>
		)
  }
  else {
    window.location = "/login";

  }
	} 
}

class Snap extends React.Component {
  handleSnap = (e) => {
   var image = this.refs.imageItem.value;
    image = image.replace(/C:\\fakepath\\/, '')
console.log(image)
    e.preventDefault();
     var data = {
         duration: this.refs.durationItem.value,
         to: this.refs.toItem.value,
         image: image,
        }
      var url = 'http://snapi.epitech.eu/snap';
      axios.post(url,data,{
        headers: {
          // "Content-Type":"multipart/form-data",
          "token": cookies.get('token')
        }
      })
       .then(function (response) {
        if (response.statusText === 'OK') {
          window.location = "/hone";
        }
        else {
          alert ("Impossible de créer votre compte, veillez réessayer")
        }
     })
       .catch(e=>console.log(e))
 }

 render() {
   return (
     <form onSubmit={this.handleSnap}  enctype="multipart/form-data">
           <label htmlFor="snap[duration]">Duration:</label>
        <select ref="durationItem" name="images" id="durationItem">
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
            <option value="20">20</option>
        </select><br/>
           <label htmlFor="snap[to]">to</label><input type="email"  ref="toItem"/><br/>
           <label htmlFor="snap[image]">to</label>
           <input id="image"  ref="imageItem" type="file"  accept="image/*" capture="camera" /><br/>
           <input type="submit" value="Submit"/></form>)
 }
}

  


class Inscription extends React.Component {
  handleRegister = (e) => {
    e.preventDefault();
     var data = {
         email: this.refs.emailItem.value,
         password: this.refs.passwordItem.value,
             }
      var url = 'http://snapi.epitech.eu/inscription';
      console.log( this.refs.emailItem.value)
      axios.post(url,data,{
        headers: {
          "Content-Type":"application/json",
        }
      })
      .then(function (response) {
       if (response.statusText === 'OK') {
      window.location = "/login";
    }
    else {
      alert ("Impossible de créer votre compte, veillez réessayer")
    }
    })
 }
 render() {
   if(cookies.get('token')){
    window.location = "/home";
   } else {
    return (
      <form onSubmit={this.handleRegister}>
         ici c'est l'inscript<br/>
            <label htmlFor="register[email]">email</label><input type="email"  ref="emailItem"/><br/>
            <label htmlFor="register[password]">Password</label><input type="password" ref="passwordItem"/><br/>
            <input type="submit" value="Submit"/></form>)
   }
 }
}

class Login extends React.Component { 
  handleLogin = (e) => {
    e.preventDefault();
     var data = {
         email: this.refs.emailItem.value,
         password: this.refs.passwordItem.value,
             }
      var url = "http://snapi.epitech.eu/connection";
      axios.post(url,data,{
        headers: {
          "Content-Type":"application/json",
        }
      })
        .then(function (response) {
           if (response.statusText === 'OK') {
             console.log(response.data.data.token)
            cookies.set('email', response.data.data.email, { path: '/' });
            cookies.set('token', response.data.data.token, { path: '/' });
          window.location = "/home";
        }
        else {
          alert ("Impossible de vous connecter, veillez réessayer")
        }
        })
        .catch(e => console.log(e))
 }

 render() {
  if(cookies.get('token')){
    window.location = "/home";
  } else { 
    return (
    <form onSubmit={this.handleLogin} >
      ici c'est le login<br/>
               <label htmlFor="login[email]">email</label><input type="email" ref="emailItem" name="login[email]"/><br/>
               <label htmlFor="login[password]">Password</label><input type="password" ref="passwordItem" name="login[password]"/><br/>
               <input type="submit" value="Submit"/></form>)}
 }

}

class Logout extends React.Component {
  render() {
    cookies.remove('email');
    cookies.remove('token');
      return (  window.location = "/login" )
    
  }
}

  


export default App; 