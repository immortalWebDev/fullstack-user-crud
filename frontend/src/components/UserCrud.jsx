import { useEffect, useState } from "react";

// const API = "http://localhost:3000/users";
const API = `${import.meta.env.VITE_API_URL}/users`;


function UserCrud() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    age: "",
    gender: "",
    phone: "",
    city: "",
    country: "",
    occupation: "",
    isActive: true
  });

  const [editingId, setEditingId] = useState(null);

  // ======================
  // READ (GET)
  // ======================
  const fetchUsers = async () => {
    const res = await fetch(API);
    const data = await res.json();
    console.log(Array.isArray(data)) //gives false
    setUsers(data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ======================
  // HANDLE INPUT
  // ======================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // ======================
  // CREATE & UPDATE
  // ======================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingId) {
      // UPDATE
      await fetch(`${API}/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
    } else {
      // CREATE
      await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
    }

    setForm({
      firstName: "",
      lastName: "",
      email: "",
      age: "",
      gender: "",
      phone: "",
      city: "",
      country: "",
      occupation: "",
      isActive: true
    });

    setEditingId(null);
    fetchUsers();
  };

  // ======================
  // DELETE
  // ======================
  const handleDelete = async (id) => {
    await fetch(`${API}/${id}`, {
      method: "DELETE"
    });
    fetchUsers();
  };

  // ======================
  // EDIT
  // ======================
  const handleEdit = (user) => {
    setForm(user);
    setEditingId(user.id);
  };

  return (
    <div>
      <h2>User CRUD</h2>

      <form onSubmit={handleSubmit}>
        <input name="firstName" value={form.firstName} onChange={handleChange} placeholder="First Name" />
        <input name="lastName" value={form.lastName} onChange={handleChange} placeholder="Last Name" />
        <input name="email" value={form.email} onChange={handleChange} placeholder="Email" />
        <input name="age" value={form.age} onChange={handleChange} placeholder="Age" />
        <input name="city" value={form.city} onChange={handleChange} placeholder="City" />
        <button type="submit">
          {editingId ? "Update User" : "Add User"}
        </button>
      </form>

      <hr />

      <ul>
        {users.map((user) => (
          <li key={user._id}>
            {user.firstName} - {user.email}
            <button onClick={() => handleEdit(user)}>Edit</button>
            <button onClick={() => handleDelete(user._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserCrud;
