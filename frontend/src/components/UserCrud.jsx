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
    city: "",
  });

  const [editingId, setEditingId] = useState(null);

  // ======================
  // READ (GET)
  // ======================
  const fetchUsers = async () => {
    const res = await fetch(API);
    // console.log(res)
    const data = await res.json();
    // console.log(data)
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

  try {
    let res;

    if (editingId) {
      // UPDATE
      res = await fetch(`${API}/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } else {
      // CREATE
      res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    }

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Something went wrong");
      return; // stop execution
    }

    // Only reset if success
    setForm({
      firstName: "",
      lastName: "",
      email: "",
      age: "",
      city: "",
    });

    setEditingId(null);
    fetchUsers();

  } catch (error) {
    alert("Server error. Please try again.");
    console.error(error);
  }
};

  // ======================
  // DELETE
  // ======================
  const handleDelete = async (id) => {
    await fetch(`${API}/${id}`, {
      method: "DELETE",
    });
    fetchUsers();
  };

  // ======================
  // EDIT
  // ======================
  const handleEdit = (user) => {
    const { _id, createdAt, updatedAt, __v, ...rest } = user;
    setForm(rest);
    setEditingId(_id);
  };

  return (
  <div className="container">
    <h2>User CRUD</h2>

    <form className="form" onSubmit={handleSubmit}>
      <div className="form-group">
        <input
          name="firstName"
          value={form.firstName}
          onChange={handleChange}
          placeholder="First Name"
        />
        <input
          name="lastName"
          value={form.lastName}
          onChange={handleChange}
          placeholder="Last Name"
        />
      </div>

      <div className="form-group">
        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
        />
        <input
          name="age"
          value={form.age}
          onChange={handleChange}
          placeholder="Age"
        />
      </div>

      <input
        name="city"
        value={form.city}
        onChange={handleChange}
        placeholder="City"
      />

      <button type="submit" className="btn primary">
        {editingId ? "Update User" : "Add User"}
      </button>
    </form>

    <hr />

    <ul className="user-list">
      {users.map((user) => (
        <li key={user._id} className="user-card">
          <div>
            <strong>{user.firstName}</strong>
            <p>{user.email}</p>
          </div>

          <div className="actions">
            <button
              className="btn edit"
              onClick={() => handleEdit(user)}
            >
              Edit
            </button>
            <button
              className="btn delete"
              onClick={() => handleDelete(user._id)}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  </div>
);

}

export default UserCrud;
