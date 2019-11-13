import React from "react";
import { Link } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import Cookies from "js-cookie";

const validSchema = Yup.object().shape({
  username: Yup.string().required("Username required !"),
  password: Yup.string().required("Password required !")
});

class Signup extends React.Component {
  state = {
    username: "",
    password: "",
    // on garde le token dans le state a l'initialisation on recupere la valeur du cookie
    token: Cookies.get("token") || null
  };

  handleSubmit = values => {
    console.log("submit : ", values);
    fetch("https://livredor-api.herokuapp.com/signup", {
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
        // on garde le token dans un cookie
        Cookies.set("token", data.token);
        this.setState({
          token: data.token
        });
        this.props.history.push("/");
      })
      .catch(err => console.log(err));
  };

  render() {
    return (
      <div className="App">
        <div className="uk-section uk-section-default">
          <div className="uk-container uk-container-small">
            <h1>Signup</h1>
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
                      Signup
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

export default Signup;
