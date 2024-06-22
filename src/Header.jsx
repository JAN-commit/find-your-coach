import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Header() {
    const navigate = useNavigate()
    const idToken = localStorage.getItem('idToken')
    const userRole = localStorage.getItem('userRole')
    const islogin = idToken

    const Logout = () => {
        localStorage.clear()

    }

    return (
        <div className='sticky top-0 z-10'>

            <div className="navbar bg-base-100">
                <div className="navbar-start">
                    <div className="dropdown">
                        <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
                            </svg>
                        </div>
                        <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                            <li>
                                <Link to="/">All Coaches</Link>
                            </li>

                            {!islogin ? (
                                <div id='guest'>
                                    <li>
                                        <Link to="/login">Login</Link>
                                    </li>
                                    <li>
                                        <Link to="/Signup">Register</Link>
                                    </li>

                                </div>
                            ) : (
                                <div id='login'>
                                    {(userRole === 'coach') && (
                                        <li>
                                            <Link to="/MessageRequest">Request</Link>
                                        </li>
                                    )}

                                    <li>
                                        <Link to="/">
                                            <button onClick={Logout}> Logout</button>
                                        </Link>
                                    </li>

                                </div>
                            )}


                        </ul>
                    </div>
                    <Link to="/" className="btn btn-ghost text-xl">Find Your Coach</Link>
                </div>
                <div className="navbar-end hidden lg:flex">
                    <ul className="menu menu-horizontal px-1">
                        <li>
                            <Link to="/">All Coaches</Link>
                        </li>



                        {!islogin ? (
                            <div id='guest' className='flex'>
                                <li>
                                    <Link to="/login">Login</Link>
                                </li>
                                <li>
                                    <Link to="/Signup">Register</Link>
                                </li>

                            </div>
                        ) : (
                            <div id='login' className='flex'>
                                    {(userRole === 'coach') && (
                                        <li>
                                            <Link to="/MessageRequest">Request</Link>
                                        </li>
                                    )}
                                <li>
                                    <Link to="/">
                                        <button onClick={Logout}> Logout</button>
                                    </Link>
                                </li>

                            </div>
                        )}

                    </ul>
                </div>
            </div>
        </div>
    );
}
