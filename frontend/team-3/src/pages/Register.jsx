import React from "react";
import { CiLock, CiUser } from "react-icons/ci";
import { MdAlternateEmail } from "react-icons/md";
const Register = () => {
  return (
    <div className="flex flex-col w-full h-full justify-center items-center lg:text-xl">
      <div className="flex flex-col w-5/6 h-3/4 justify-center items-center bg-[#EBF3FC] rounded-lg gap-10 md:1/2 lg:w-1/2">
        <p className="font-bold text-4xl">Register</p>
        <div className="text-left gap-5 flex flex-col px-5 md:w-2/3">
          <p>Your Email</p>
          <div className="flex flex-row justify-start items-center rounded-sm bg-[#CAE4FE] h-10 px-2 gap-2 w-full">
            <MdAlternateEmail />
            <input
              className="w-full"
              type="email"
              name="email"
              placeholder="e.g. bryanbarakat@outlook.com"
            />
          </div>

          <p>Username</p>
          <div className="flex flex-row justify-start items-center rounded-sm bg-[#CAE4FE] h-10 px-2 gap-2 w-full">
            <CiUser />
            <input className="w-full" name="username" />
          </div>
          <p>Your Password</p>
          <div className="flex flex-row justify-start items-center rounded-sm bg-[#CAE4FE] h-10 px-2 gap-2 w-full">
            <CiLock />
            <input className="w-full" type="password" name="password" />
          </div>
        </div>
        <button className="w-2/3 md:w-1/2 h-10 !bg-[#FF8559] text-center justify-center flex items-center">
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default Register;
