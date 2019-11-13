import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./Home";
import Login from "./Login";
import Cookies from "js-cookie";

class App extends React.Component {
  state = {
    name: Cookies.get("name") || "",
    token: Cookies.get("token") || ""
  };

  handleLogout = () => {
    this.setState({
      name: "",
      token: ""
    });
    Cookies.remove("name");
    Cookies.remove("token");
  };

  render() {
    return (
      <Router>
        <Switch>
          <Route
            exact
            path="/"
            render={props => (
              <Home
                {...props}
                myname={this.state.name}
                mytoken={this.state.token}
                logOut={() => this.handleLogout()}
              />
            )}
          />
          <Route
            path="/login"
            render={props => (
              <Login
                {...props}
                setDatasInAppState={(newName, newToken) =>
                  this.setState({
                    name: newName,
                    token: newToken
                  })
                }
              />
            )}
          />
        </Switch>
      </Router>
    );
  }
}

export default App;
