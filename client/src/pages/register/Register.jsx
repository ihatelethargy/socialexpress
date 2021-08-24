import "./register.css";
import { loginCall } from "../../apiCalls";
import { AuthContext } from "../../context/AuthContext";
import { CircularProgress } from "@material-ui/core";
import { useContext, useRef } from "react";
import axios from "axios";
import { useHistory } from "react-router";

export default function Register() {
    const username = useRef();
    const email = useRef();
    const password = useRef();
    const passwordAgain = useRef();
    const { user, isFetching, error, dispatch } = useContext(AuthContext);
    const history = useHistory();

    const handleClick = async (e) => {
        e.preventDefault();
        if (passwordAgain.current.value !== password.current.value) {
            password.current.setCustomValidity("password is don't match");
        } else {
            const user = {
                username: username.current.value,
                email: email.current.value,
                password: password.current.value,
            };
            try {
                await axios.post("/auth/register", user);
                history.push("/login");
            } catch (e) {
                console.log(e);
            }
        }
    };

    return (
        <div className="login">
            <div className="loginWrapper">
                <div className="loginLeft">
                    <h3 className="loginLogo">Lamasocial</h3>
                    <span className="loginDesc">
                        Connect with friends and the world around you on
                        Lamasocial.
                    </span>
                </div>
                <div className="loginRight">
                    <form className="loginBox" onSubmit={handleClick}>
                        <input
                            required
                            placeholder="Username"
                            className="loginInput"
                            ref={username}
                        />
                        <input
                            required
                            placeholder="Email"
                            className="loginInput"
                            ref={email}
                            type="email"
                        />
                        <input
                            required
                            placeholder="Password"
                            className="loginInput"
                            ref={password}
                            type="password"
                        />
                        <input
                            required
                            placeholder="Password Again"
                            className="loginInput"
                            ref={passwordAgain}
                            type="password"
                        />
                        <button className="loginButton" type="submit">
                            Sign Up
                        </button>
                        <button className="loginRegisterButton">
                            Log into Account
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
