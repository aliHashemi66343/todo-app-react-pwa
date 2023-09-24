import axios from "axios";
import { useState } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
const backend_host="localhost";
const backend_port=1212;
const Authenticate = (props) => {
  // const [authenticated, setAuthenticated] = useState(false);
  const [loginUsername, setLoginUsername] = useState("");
  const [signupUsername, setSignupUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupRepeatPassword, setSignupRepeatPassword] = useState("");

  const login_submit = () => {
  const cred_json={username:loginUsername,password:loginPassword};
    axios
      .post(`http://${backend_host}:${backend_port}/login`, cred_json, {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          Accept: "application/json",
        },
        withCredentials: false,
      })
      .then((result) => {
        if (result.data.userObj) {
            localStorage.setItem("jwtToken", result.data.token);

          props.do_login(result.data.userObj);
        }
      });
  };

  const signup_submit = () => {
    if (signupPassword===signupRepeatPassword) {
      const cred_json = { username: signupUsername, password: signupPassword };
      axios
        .post(`http://${backend_host}:${backend_port}/signup`, cred_json, {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            Accept: "application/json",
          },
          withCredentials: false,
        })
        .then((result) => {
          if (result.data.userObj) {
            localStorage.setItem('jwtToken',result.data.token)
            console.log("token after signup");
            console.log(localStorage.getItem('jwtToken'))

            props.do_login(result.data.userObj);

          }
        });
    }
    
  };
  return (
    <div>
      <Tabs
        defaultActiveKey="login"
        id="uncontrolled-tab-example"
        className="mb-3"
      >
        <Tab eventKey="login" title="Login">
            <div className="form-outline mb-4">
              <input
                type="text"
                onChange={(event) => setLoginUsername(event.target.value)}
                id="loginName"
                className="form-control"
              />
              <label className="form-label" for="loginName">
                Username
              </label>
            </div>

            <div className="form-outline mb-4">
              <input
                type="password"
                onChange={(event) => setLoginPassword(event.target.value)}
                id="loginPassword"
                className="form-control"
              />
              <label className="form-label" for="loginPassword">
                Password
              </label>
            </div>

            <div className="row mb-4">
              <div className="col-md-6 d-flex justify-content-center">
                <div className="form-check mb-3 mb-md-0">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value=""
                    id="loginCheck"
                    checked
                  />
                  <label className="form-check-label" for="loginCheck">
                    {" "}
                    Remember me{" "}
                  </label>
                </div>
              </div>

              <div className="col-md-6 d-flex justify-content-center">
                <a href="#!">Forgot password?</a>
              </div>
            </div>

            <button
              className="btn btn-primary btn-block mb-4"
              onClick={login_submit}
            >
              Sign in
            </button>

            <div className="text-center">
              <p>
                Not a member? <a href="#!">Register</a>
              </p>
            </div>
        </Tab>
        <Tab eventKey="register" title="Register">
            {/* <div className="form-outline mb-4">
              <input type="text" id="registerName" className="form-control" />
              <label className="form-label" for="registerName">
                Name
              </label>
            </div> */}

            <div className="form-outline mb-4">
              <input
                type="text"
                id="registerUsername"
                onChange={(event) => setSignupUsername(event.target.value)}
                className="form-control"
              />
              <label className="form-label" for="registerUsername">
                Username
              </label>
            </div>

            {/* <div className="form-outline mb-4">
              <input type="email" id="registerEmail" className="form-control" />
              <label className="form-label" for="registerEmail">
                Email
              </label>
            </div> */}

            <div className="form-outline mb-4">
              <input
                type="password"
                id="registerPassword"
                onChange={(event) => setSignupPassword(event.target.value)}
                className="form-control"
              />
              <label className="form-label" for="registerPassword">
                Password
              </label>
            </div>

            <div className="form-outline mb-4">
              <input
                type="password"
                onChange={(event) =>
                  setSignupRepeatPassword(event.target.value)
                }
                id="registerRepeatPassword"
                className="form-control"
              />
              <label className="form-label" for="registerRepeatPassword">
                Repeat password
              </label>
            </div>

            {/* <div className="form-check d-flex justify-content-center mb-4">
              <input
                className="form-check-input me-2"
                type="checkbox"
                value=""
                id="registerCheck"
                checked
                aria-describedby="registerCheckHelpText"
              />
              <label className="form-check-label" for="registerCheck">
                I have read and agree to the terms
              </label>
            </div> */}

            <button onClick={signup_submit} className="btn btn-primary btn-block mb-3">
              Sign Up
            </button>
        </Tab>
      </Tabs>
      
    </div>
  );
};
export default Authenticate;
