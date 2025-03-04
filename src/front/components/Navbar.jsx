import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import toast from "react-hot-toast";

export const Navbar = () => {

	const { store, dispatch } = useGlobalReducer();

	const navigate = useNavigate();

	const getPrivate = async (token) => {
		const myHeaders = new Headers();
		myHeaders.append("Authorization", "Bearer " + token);

		const requestOptions = {
			method: "GET",
			headers: myHeaders
		};

		const resp = await fetch(import.meta.env.VITE_BACKEND_URL + "users/me", requestOptions);
		const data = await resp.json();
		if (!resp.ok) {
			toast.error(data.message);
			return;
		}
		dispatch({
			type: "assign_user",
			payload: data
		});

	};

	useEffect(() => {
		if (store.token) {
			getPrivate(store.token);
		} else {
			navigate("/login");
		}
	}, []);

	return (
		<nav className="navbar navbar-light bg-danger">
			<div className="container">
				<Link to="/login" className="text-decoration-none">
					<h3 className="mb-0 text-white">ChapuGeeks</h3>
				</Link>


				<div className="ml-auto">
					<span className="text-white mx-2">
						{
							store.user && `Hola ${store.user.email}`
						}
					</span>
					{(!store.user || !store.token) && <>
						<Link to="/register" className="text-decoration-none mx-2">
							<button className="btn btn-light">Register</button>
						</Link>

						<Link to="/login" className="text-decoration-none mx-2">
							<button className="btn btn-light">Log In</button>
						</Link>
					</>
					}

					{store.user && <button className="btn btn-light mx-2"
						onClick={() => {
							localStorage.removeItem("token");
							dispatch({ type: "set_token", payload: null });
							dispatch({ type: "assign_user", payload: null });
							navigate("/login");
						}}
					>
						Log Out
					</button>
					}
				</div>
			</div>
		</nav>
	);
};