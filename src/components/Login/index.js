import React from "react";
import { Link } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import Cookies from "js-cookie";

const validSchema = Yup.object().shape({
  username: Yup.string().required("Username required !"),
  password: Yup.string().required("Password required !")
});

class Login extends React.Component {
  state = {
    username: "",
    password: ""
  };

  handleSubmit = values => {
    fetch("https://livredor-api.herokuapp.com/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: values.username,
        password: values.password
      })
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        // set cookie
        Cookies.set("name", data.username);
        Cookies.set("token", data.token);
        // set token in global state (App) from server response
        this.props.setDatasInAppState(data.username, data.token);
        // redirect to home
        this.props.history.push("/");
      })
      .catch(error => console.log(error));
  };

  render() {
    return (
      <div className="App">
        <div className="uk-section uk-section-default">
          <div className="uk-container uk-container-small">
            <h1>Login</h1>
            <Link to="/">Back to home</Link>
            <br />
            <br />
            <Formik
              initialValues={this.state}
              validationSchema={validSchema}
              onSubmit={values => this.handleSubmit(values)}
            >
              {({ errors, touched }) => (
                <Form>
                  <div className="uk-margin">
                    <div className="uk-form-controls">
                      <Field
                        name="username"
                        type="text"
                        placeholder="Username"
                        className="uk-input uk-form-width-large"
                      />
                    </div>
                    {errors.username && touched.username ? (
                      <div className="uk-text-danger">{errors.username}</div>
                    ) : null}
                  </div>
                  <div className="uk-margin">
                    <div className="uk-form-controls">
                      <Field
                        name="password"
                        type="password"
                        placeholder="Password"
                        className="uk-input uk-form-width-large"
                      />
                    </div>
                    {errors.password && touched.password ? (
                      <div className="uk-text-danger">{errors.password}</div>
                    ) : null}
                  </div>
                  <div className="uk-margin">
                    <button
                      className="uk-button uk-button-primary"
                      type="submit"
                    >
                      Login
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
