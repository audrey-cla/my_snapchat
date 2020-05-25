import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

const session = {
  email: localStorage.getItem('email'),
  token: localStorage.getItem('token')
}

if(session.email && session.token){
  const headers = {
    'Content-Type': 'application/json',
    'token': localStorage.getItem('token')
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email : [],
     token : []
   
    }
  }
s
  componentDidMount() {
    axios.get("http://snapi.epitech.eu").then((data) => {
      // this.setState({ items: data });
      // console.log(data)
    })
  } 
  render() {
    
    return (
      <div className="App">
        <Router>
        <nav className="navbar navbar-expand-lg navbar-light bg-light"> <div className="navbar-nav"> 
            <Link className="nav-item nav-link" to="/">Home</Link>
            <Link className="nav-item nav-link" to="/inscription">Register</Link>
            <Link className="nav-item nav-link" to="/login">Login</Link>
            <Link className="nav-item nav-link" to="/logout">Logout</Link>
          </div>
   </nav>
        <Switch>
          <Route path="/inscription" component={Inscription} />
          <Route path="/logout" component={Logout} />
          <Route path="/login" component={Login} />
          <Route path="/" component={Home} />
        </Switch>
        </Router>
        <div></div>
      </div>
    );
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
    console.log(this.state)
		return(
      <div>
        ici c'est la home
			</div>
		)
	}
  
}

class Login extends React.Component { 
  constructor(props) {
    super(props);
    this.state = {
      email : [],
     token : []
    }
  }

  handleLogin = (e) => {
    e.preventDefault();
     var data = {
         email: this.refs.emailItem.value,
         password: this.refs.passwordItem.value,
             }
      var url = "http://snapi.epitech.eu/connection";
      axios.post(url,data)
        .then(function (response) {
           if (response.statusText === 'OK') {
             console.log(this)
            //  this.setState({ email: response.data.data.email});
            // this.setState({ token: response.data.data.token});
            //  console.log(response.data.data.email)
            // localStorage.setItem('email', response.data.data.email);
            // localStorage.setItem('token', response.data.data.token);
            

          window.location = "/home";
        }
        else {
          alert ("Impossible de vous connecter, veillez réessayer")
        }
        })
        .catch(e => console.log(e))
 }

 render() {
   return (
<form onSubmit={this.handleLogin}>
  ici c'est le login<br/>
           <label htmlFor="login[email]">email</label><input type="email" ref="emailItem" name="login[email]"/><br/>
           <label htmlFor="login[password]">Password</label><input type="password" ref="passwordItem" name="login[password]"/><br/>
           <input type="submit" value="Submit"/></form>)
 }

}

class Logout extends React.Component { 
  constructor(props) {
    super(props);
    this.state = {
     items: [],
   
    }
  }
s
  componentDidMount() {
    axios.get("http://snapi.epitech.eu").then((data) => {
      this.setState({ items: data });
      console.log(data)
    })
  } 
 
  render() {     
		return(
      <div>
        ici c'est logout
			
			</div>
		)
	}
  
}

class Inscription extends React.Component{
  handleRegister = (e) => {
     e.preventDefault();
      var data = {
          email: this.refs.emailItem.value,
          password: this.refs.passwordItem.value,
              }
       var url = 'http://snapi.epitech.eu';
       axios.post(url,data)
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
    return (
      <form onSubmit={this.handleRegister}>
         ici c'est l'inscript<br/>
            <label htmlFor="register[email]">email</label><input type="email"  ref="emailItem"/><br/>
            <label htmlFor="register[password]">Password</label><input type="password" ref="passwordItem"/><br/>
            <input type="submit" value="Submit"/></form>)
  }
}

export default App;
