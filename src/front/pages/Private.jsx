import React, { useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";

const Private = () => {

    const {store} = useGlobalReducer();

    return(
        <div className="container py-5">
            <div className="row">
                <div className="col-md-6 mx-auto">
                    <div className="card">
                        <div className="card-body text-center">
                            <img 
                                src="https://cdn-icons-png.flaticon.com/512/6596/6596121.png" 
                                className="rounded-circle mb-3 col-4" 
                                alt="Profile"
                            />
                            <h3 className="card-title">{store.user && store.user.username}</h3>
                            <p className="card-text text-muted">
                                <i className="bi bi-envelope"></i> {store.user && store.user.email}
                            </p>
                        </div>
                    </div>
                </div>
                
            </div>
        </div>
    );
} 

export default Private;