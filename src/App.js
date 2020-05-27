/* eslint-disable no-unused-expressions */
import React, { Component } from 'react';
import './App.css';
import './css.css';

import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import ReactTimeout from 'react-timeout'
import { CountdownCircleTimer } from 'react-countdown-circle-timer'
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
    snaps: [],
    }
  } 
  componentDidMount() {
    axios.get("http://snapi.epitech.eu/snaps",{
      headers: {
        "token": cookies.get('token')
      }
    }).then((data) => {
      this.setState({ snaps: data.data.data});
    })
  } 

render() {
	if (cookies.get('token')) {
    return(
      <div>
        voici vos snaps recus, {cookies.get('email')};

        {this.state.snaps.map((e) => {
          return (
            <Snaplist snap_id={e.snap_id} from={e.from} duration={e.duration} />
         )
       })}
			</div>
		)
  }
  else {
    window.location = "/login";
  }
 } 
}

class Popup extends React.Component {  
  render() {
      var req = new XMLHttpRequest();
      req.responseType = "blob";
      req.open("GET", "http://snapi.epitech.eu/snap/"+this.props.snap_id);
      req.setRequestHeader('token', cookies.get('token'));
      req.onload = response;
      req.send();
      function response(e) {
        var urlCreator = window.URL || window.webkitURL;
        var imageUrl = urlCreator.createObjectURL(this.response);
        document.getElementById("snap").src = imageUrl;
     }

     var id = this.props.snap_id;
     var time = this.props.duration * 1000;
     
    	if (cookies.get('token')) {
        return(
      <div id={"snap_container"+id} className="popup container-fluid m-0 p-0">
      <img id="snap"  alt="snap"/>
      <button id="close" className="butontop" onClick={this.props.closePopup}>close me</button>  
      <div className="timer" id='timer'>
      <CountdownCircleTimer
      isPlaying
      size={50}
      duration={this.props.duration}
      colors={[['#e69935']]}
      >
      {({ remainingTime }) => remainingTime}
      </CountdownCircleTimer>
      {
     setTimeout(function(){ document.getElementById("snap_container"+id).style.visibility = "hidden" }, time)
      }
  </div>
    			</div>
    		)
      }
    }
}  

class Snaplist extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    snaps: [],
    showPopup: false 
    }
  }
  togglePopup() {  
    this.setState({  
         showPopup: !this.state.showPopup  
    });  
    }  
  render() {
    return (
    <div>
      <button onClick={this.togglePopup.bind(this)}>  Snap de {this.props.from} <br/>dure: {this.props.duration}s</button>  
      {this.state.showPopup ?  
      <Popup    duration={this.props.duration} snap_id={this.props.snap_id} text='Click "Close Button" to hide popup'   closePopup={this.togglePopup.bind(this)}  />  
      : null  
      }  
    </div>
      )
   } 
}

class Snap extends React.Component {
  handleSnap = (e) => {
   var image = this.refs.imageItem.value;
    image = image.replace(/C:\\fakepath\\/, '')

    e.preventDefault();
  
     var data = {
         duration: this.refs.durationItem.value,
         to: this.refs.toItem.value,
        }
        const formData = new FormData();
        formData.append('image',image);
      var url = 'http://snapi.epitech.eu/snap';
      axios.post(url,data, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "token": cookies.get('token')
        }
      })
       .then(function (response) {
        if (response.statusText === 'OK') {
          window.location = "/home";
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
           <label htmlFor="snap[duration]">Duraation:</label>
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
     var url = "http://snapi.epitech.eu/inscription";
     axios.post(url,data,{
       headers: {
         "Content-Type":"application/json",
       }
     })
      .then(function (response) {
      })
      .catch(e => console.log(e))
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
          "Content-Type":"application/json;",
        }
      })
        .then(function (response) {
           if (response.statusText === 'OK') {
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