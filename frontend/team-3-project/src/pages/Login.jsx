import React from "react";
import { useState } from "react";
import { Button } from "../components";
const Login = () => {
  const [showLogin, setShowLogin] = useState(true);
  return (
    <div className="flex flex-col justify-center items-center h-dvh w-dvw ">
      <div className="h-1/2 w-full md:h-1/2 sm:w-1/2 xl:w-1/4 gap-4 rounded-lg bg-white text-black shadow-lg flex flex-col justify-center items-center">
        <p className="text-base sm:text-lg font-bold">
          {showLogin ? "Login" : "Sign Up"}
        </p>
        {showLogin ? (
          <div />
        ) : (
          <input
            type="text"
            placeholder="Email"
            className="border border-gray-300 rounded-md p-2 w-3/4"
          />
        )}
        <input
          type="text"
          placeholder="Username"
          className="border border-gray-300 rounded-md p-2 w-3/4"
        />
        <input
          type="password"
          placeholder="Password"
          className="border border-gray-300 rounded-md p-2  w-3/4"
        />
        <Button label="Submit"></Button>
        <a
          className="text-sm underline hover:cursor-pointer"
          onClick={() => setShowLogin(!showLogin)}
        >
          {showLogin
            ? "Don't have an account? Sign up"
            : "Already have an account? Log in"}
        </a>
      </div>
    </div>
  );
};

export default Login;
