import { useState } from "react";

const API = "https://fullstack-user-crud-production.up.railway.app/api/auth";
// const API = "http://localhost:3000/api/auth"

function Register() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const res = await fetch(`${API}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials:"include",
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message);
      return;
    }

    alert("Registered successfully. Please login.");
  };

  return (
    <form onSubmit={handleRegister}>
      <h2>Register</h2>
      <input name="firstName" placeholder="First Name" onChange={handleChange}/>
      <input name="lastName" placeholder="Last Name" onChange={handleChange}/>
      <input name="email" placeholder="Email" onChange={handleChange}/>
      <input name="password" type="password" placeholder="Password" onChange={handleChange}/>
      <button type="submit">Register</button>
    </form>
  );
}

export default Register;