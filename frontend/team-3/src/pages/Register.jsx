import React, { useEffect, useState } from "react";
import { CiLock, CiUser } from "react-icons/ci";
import { MdAlternateEmail } from "react-icons/md";
import { useAuth } from "../context/AuthContext";

const RenderForms = ({
  label,
  placeholder,
  icon,
  name,
  type,
  value,
  onChange,
}) => {
  return (
    <>
      <p>{label}</p>
      <div className="flex flex-row justify-start items-center rounded-sm bg-[#CAE4FE] h-10 px-2 gap-2 w-full">
        {icon}
        <input
          className="w-full pl-2 focus:ring-0 focus:border-none focus:outline-none"
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
      </div>
    </>
  );
};

const Register = () => {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await register(formData);
    if (!result.success) {
      console.error("Registration failed: ", result.message);
    }
  };

  return (
    <form
      className="flex flex-col w-full h-full justify-center items-center lg:text-xl"
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col w-5/6 h-3/4 justify-center items-center bg-[#EBF3FC] rounded-lg gap-10 md:1/2 lg:w-1/2">
        <p className="font-bold text-4xl">Register</p>
        <div className="text-left gap-5 flex flex-col px-5 md:w-2/3">
          <RenderForms
            label="Your Email"
            icon={<MdAlternateEmail />}
            placeholder="e.g. bryanbarakat@outlook.com"
            name="email"
            type="email"
            value={formData["email"]}
            onChange={handleChange}
          />

          <RenderForms
            label="Username"
            icon={<CiUser />}
            placeholder="e.g. MrRobot"
            name="username"
            type="text"
            value={formData["username"]}
            onChange={handleChange}
          />

          <RenderForms
            label="Your Password"
            icon={<CiLock />}
            placeholder="e.g. ********"
            name="password"
            type="password"
            value={formData["password"]}
            onChange={handleChange}
          />
        </div>
        <button
          className="w-2/3 md:w-1/2 h-10 !bg-[#FF8559] text-center justify-center flex items-center"
          type="submit"
        >
          Sign Up
        </button>
      </div>
    </form>
  );
};

export default Register;
