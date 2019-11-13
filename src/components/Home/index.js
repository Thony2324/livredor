import React from "react";
import { Link } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

const validSchema = Yup.object().shape({
  message: Yup.string().required("Message required !")
});

class Home extends React.Component {
  state = {
    message: "",
    messages: null
  };

  updateMessages = () => {
    //console.log("enter in function updateMessages...");
    // Réinit list of messages to re-render the page
    if (this.state.messages !== null) {
      this.setState({ messages: null });
    }
    //console.log("fetch GET...");
    fetch("https://livredor-api.herokuapp.com/messages")
      .then(response => response.json())
      .then(data => {
        this.setState({
          messages: data
        });
      })
      .catch(error => console.log(error));
  };

  handleSubmit = async values => {
    // nécessaire d'utiliser async/await afin que le post soit fini avant de faire l'update

    //console.log("fetch POST...");
    await fetch("https://livredor-api.herokuapp.com/message", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.props.mytoken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        content: values.message
      })
    });
    //console.log("updateMessages after submit...");
    await this.updateMessages();
  };

  componentDidMount = () => {
    //console.log("componentDidMount - updateMessages...");
    this.updateMessages();
  };

  render() {
    //console.log("render...");
    if (this.state.messages === null) {
      return "Loading...";
    }

    return (
      <div className="App">
        <header className="uk-background-muted uk-padding">
          <div className="uk-container uk-container-small">
            {this.props.mytoken === "" ? (
              <p>
                You need to <Link to="/login">login</Link> to add a message
              </p>
            ) : (
              <div className="uk-flex">
                <p className="uk-width-1-2">
                  Welcome <strong>{this.props.myname}</strong>
                </p>
                <div className="uk-width-1-2">
                  <button
                    className="uk-button uk-button-primary"
                    onClick={this.props.logOut}
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </header>
        <div className="uk-section uk-section-default">
          <div className="uk-container uk-container-small">
            <h1>Livre d'or</h1>
            <button
              className="uk-button uk-button-default"
              type="button"
              onClick={() => this.updateMessages()}
            >
              Refresh
            </button>
            <ul className="uk-list uk-list-bullet">
              {this.state.messages.map(message => {
                return <li key={message.id}>{message.content}</li>;
              })}
            </ul>
            {this.props.mytoken !== "" ? (
              <div className="uk-margin-large">
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
                            name="message"
                            type="text"
                            placeholder="Message"
                            className="uk-input uk-form-width-large"
                          />
                        </div>
                        {errors.message && touched.message ? (
                          <div className="uk-text-danger">{errors.message}</div>
                        ) : null}
                      </div>
                      <div className="uk-margin">
                        <button
                          className="uk-button uk-button-primary"
                          type="submit"
                        >
                          Send
                        </button>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
