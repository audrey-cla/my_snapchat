/* eslint-disable no-unused-expressions */
import React, { Component } from 'react';
import './App.css';
import './css.css';
import CanvasDraw from "react-canvas-draw";
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

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
    if (cookies.get('token')) {
      return (
        <div className="App">
          <link href="https://fonts.googleapis.com/css2?family=Montserrat" rel="stylesheet" />
          <Router>
            <nav className="navbar navbar-collapse navbar-expand-lg navbar-light bg-light m-0 p-0"> <div className="navbar-nav">
              <img src="https://blog.foodcheri.com/wp-content/uploads/2016/02/snapchat-logo-right.png"></img>
              <h1>my snapchat</h1>
              <Link className="nav-item nav-link" to="/">Home</Link>
              <Link className="nav-item nav-link" to="/logout">Logout</Link>
              <Link className="nav-item nav-link" to="/snap">Send a snap</Link>
            </div>
            </nav>
            <Switch>
              <Route path="/inscription" component={Inscription} />
              <Route path="/logout" component={Logout} />
              <Route path="/Login" component={Login} />
              <Route path="/test" component={Test} />
              <Route path="/snap/:handle" component={Snap} />
              <Route path="/snap" component={CreateSnap} />
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
            <nav className="navbar navbar-expand-lg text-center navbar-light bg-light  m-0 p-0"> <div className="navbar-nav">
              <img src="https://blog.foodcheri.com/wp-content/uploads/2016/02/snapchat-logo-right.png"></img>
              <h1>my snapchat</h1>
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

class Test extends React.Component {
  render() {
    return (
      <CanvasDraw
        imgSrc="https://upload.wikimedia.org/wikipedia/commons/a/a1/Nepalese_Mhapuja_Mandala.jpg"
        brushRadius="3"

      />
    )
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
    axios.get("http://snapi.epitech.eu/snaps", {
      headers: {
        "token": cookies.get('token')
      }
    }).then((data) => {
      this.setState({ snaps: data.data.data });
    })
  }

  render() {
    if (cookies.get('token')) {
      return (
        <div>
          voici vos snaps recus, {cookies.get('email')};

          {this.state.snaps.map((e) => {
            return (
              <div> <a href={"http://localhost:3000/snap/" + e.snap_id} onClick={cookies.set('duration', e.duration, { path: '/' })}>snap de {e.from} il dure {e.duration}s</a><br /></div>
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

class Snap extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showText: false
    }
  }
  componentDidMount() {
    console.log(cookies.get('duration'))
    var time = cookies.get('duration') * 1000;
    var data = {
      id: this.props.match.params.handle,
    }

    console.log(this.props.id);
    var url = "http://snapi.epitech.eu/seen";
    axios.post(url, data, {
      headers: {
        "Content-Type": "application/json;",
        "token": cookies.get('token')
      }
    })

    setTimeout(() => {
      this.setState({ showText: true })
    }, time)
  }
  render() {
    const { showText } = this.state
    var req = new XMLHttpRequest();
    req.responseType = "blob";
    req.open("GET", "http://snapi.epitech.eu/snap/" + this.props.match.params.handle);
    req.setRequestHeader('token', cookies.get('token'));
    req.onload = response;
    req.send();
    function response(e) {
      var urlCreator = window.URL || window.webkitURL;
      var imageUrl = urlCreator.createObjectURL(this.response);
      document.getElementById("snap").src = imageUrl;
    }
    return (
      <div className="popup container-fluid m-0 p-0"><img id="snap" alt="snap" />
        <div className="timer" id='timer'>
          <CountdownCircleTimer
            isPlaying
            size={50}
            duration={cookies.get('duration')}
            colors={[['#e69935']]}
          >
            {({ remainingTime }) => remainingTime}
          </CountdownCircleTimer></div>
        {showText && <Seesnap id={this.props.match.params.handle} />}
      </div>
    )
  }
}

class Seesnap extends React.Component {
  render() {
    return (
      window.location = "/home"
    )
  }
}

class CreateSnap extends React.Component {
  handleSnap = (e) => {
    var image = this.refs.imageItem.value;
    e.preventDefault();
    const formData = new FormData();
    formData.append('image', this.refs.imageItem.files[0]);
    formData.append('duration', this.refs.durationItem.value);
    formData.append('to', this.refs.toItem.value);
    console.log(formData);
    var request = new XMLHttpRequest();
    request.open("POST", "http://snapi.epitech.eu/snap");
    request.setRequestHeader('token', cookies.get('token'));
    request.send(formData);

    this.refs.imageItem.value = '';
    this.refs.toItem.value = ''

  }
  render() {
    return (
      <form onSubmit={this.handleSnap} encType="multipart/form-data" name="files">
        <label htmlFor="snap[duration]">Duration:</label>
        <select ref="durationItem" name="duration" id="durationItem">
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="15">15</option>
          <option value="20">20</option>
        </select><br />
        <label htmlFor="snap[to]">to</label><input type="email" name="to" ref="toItem" /><br />
        <label htmlFor="snap[image]">to</label>
        <input id="image" name="image" ref="imageItem" type="file" accept="image/*" /><br />
        <input type="submit" value="Submit" /></form>)
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
    axios.post(url, data, {
      headers: {
        "Content-Type": "application/json",
      }
    })
      .then(function (response) {
        window.location = "/login";

      })
      .catch(e => console.log(e))
  }
  render() {
    if (cookies.get('token')) {
      window.location = "/home";
    } else {
      return (
        <div class="content"> <form onSubmit={this.handleRegister}>
          merci de vous inscrire<br />
          <label htmlFor="register[email]">email</label><input type="email" ref="emailItem" /><br />
          <label htmlFor="register[password]">Password</label><input type="password" ref="passwordItem" /><br />
          <input type="submit" value="Submit" /></form></div>)
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
    axios.post(url, data, {
      headers: {
        "Content-Type": "application/json;",
      }
    })
      .then(function (response) {
        if (response.statusText === 'OK') {
          cookies.set('email', response.data.data.email, { path: '/' });
          cookies.set('token', response.data.data.token, { path: '/' });
          window.location = "/home";
        }
        else {
          alert("Impossible de vous connecter, veillez réessayer")
        }
      })
      .catch(e => console.log(e))
  }
  render() {
    if (cookies.get('token')) {
      window.location = "/home";
    } else {
      return (
        <div class="content"><form onSubmit={this.handleLogin} >
          Merci de vous connecter <br />
          <label htmlFor="login[email]">Email </label><input type="email" ref="emailItem" name="login[email]" /><br />
          <label htmlFor="login[password]">Password </label><input type="password" ref="passwordItem" name="login[password]" /><br />
          <input type="submit" value="Submit" /></form></div>)
    }
  }
}

class Logout extends React.Component {
  render() {
    cookies.remove('email');
    cookies.remove('token');
    return (window.location = "/login")

  }
}




export default App; 