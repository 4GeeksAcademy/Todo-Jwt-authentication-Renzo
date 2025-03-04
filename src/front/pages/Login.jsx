import React from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { useNavigate } from "react-router-dom";

const Login = () => {

    const { dispatch } = useGlobalReducer();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [ showPassword, setShowPassword ] = useState(false);

    const loginPost = async (user) => {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const userBody = JSON.stringify(user);

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: userBody
        };

        const resp = await fetch( import.meta.env.VITE_BACKEND_URL +  "login", requestOptions)
        const data = await resp.json();
        if(!resp.ok) {
            toast.error("Ingrese datos válidos", {
                icon: '❌'
            }); // muestra errores de backend
            return
        }
        toast.success("User Logged In");
        console.log(data);

        const token = data.access_token;

        localStorage.setItem("token", token); // guarda el token en el local storage

        dispatch({
            type: "set_token",
            payload: token
        });

        dispatch({
            type: "assign_user",
            payload: data
        });

        navigate("/private");

        setEmail("");
        setPassword("");
    }

    const login = (email, password, ) => {
        if( !email || !password ) {
            toast.error("Please fill all the fields");
            return;
        }
        loginPost({
            email,
            password
        });
    }

    return <main className="form-signin w-100 m-auto
            d-flex justify-content-center align-items-center"
            style={{minHeight: "75vh"}}
        >
        <div className="col-4 mx-auto ">
            <span className="d-block mb-4 mt-2 d-flex justify-content-center">
                <img src="https://i.pinimg.com/474x/7c/38/23/7c382346bf4005c1cf98848eb37d7228.jpg" className="col-4" />
            </span>
            <h1 className="h3 mb-3 fw-normal text-center">Login</h1>

            <div className="form-floating">
                <input type="email" value={email || ""} onChange={ event => setEmail(event.target.value)}
                    className="form-control" placeholder="name@example.com"
                />
                <label for="floatingInput">Email address</label>
            </div>

            <div className="d-flex justify-content-between">
                <div className="form-floating col-11">
                    <input type={ showPassword ? "text" : "password" } className="form-control"  placeholder="Password"
                        value={password || ""} onChange={ event => setPassword(event.target.value)}
                    />
                    <label for="floatingPassword">Password</label>
                        
                </div>
                <button className="btn btn-light col-1" type="button"
                    onClick={ () => setShowPassword(!showPassword) }
                >
                    {
                        !showPassword ? <i class="fa-solid fa-eye"></i> : <i class="fa-solid fa-eye-slash"></i>
                    }
                </button>
            </div>

            <button className="btn btn-primary w-100 py-2 mt-3"
                onClick={ () => login(email, password)}
            >
                Log In
            </button>
            <p className="mt-3"> No tienes usuario?</p>
            <button className="btn btn-warning w-100 py-2"
                onClick={ () => navigate("/register")}
            >
                Regístrate
            </button>
        </div>
    </main>
}

export default Login;