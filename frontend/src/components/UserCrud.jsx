import { useEffect, useState } from "react";

// const API =
//   "https://fullstack-user-crud-production.up.railway.app/api/users";

// const API = "http://localhost:3000/api/users";

const API = "https://fullstack-user-crud-production.up.railway.app/api/users"
// // const API = `${import.meta.env.VITE_API_URL}/users`;

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

  //   const token = localStorage.getItem("token");

  // ======================
  // FETCH USERS (GET)
  // ======================
  const fetchUsers = async () => {
    try {
      const res = await fetch(API, {
        headers: {
          //   Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (res.status === 401) {
        alert("Session expired. Please login again.");
        // localStorage.removeItem("token");
        window.location.reload();
        return;
      }

      const data = await res.json();

      // If you added pagination in backend:
      setUsers(data.users || data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    // if (token) {
    fetchUsers();
    // }
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
        res = await fetch(`${API}/${editingId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${token}`,
          },
          credentials: "include",
          body: JSON.stringify(form),
        });
      } else {
        res = await fetch(API, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${token}`,
          },
          credentials: "include",

          body: JSON.stringify(form),
        });
      }

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Something went wrong");
        return;
      }

      // Reset form
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
      console.error("Server error:", error);
      alert("Server error. Please try again.");
    }
  };

  // ======================
  // DELETE
  // ======================
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API}/${id}`, {
        method: "DELETE",
        headers: {
          //   Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "You are not allowed (Only admins)");
        return;
      }

      fetchUsers();
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Server error");
    }
  };

  // ======================
  // EDIT
  // ======================
  const handleEdit = (user) => {
    const { _id, createdAt, updatedAt, __v, password, ...rest } = user;
    setForm(rest);
    setEditingId(_id);
  };

  return (
    <div className="container">
      <h2>User CRUD (Protected)</h2>

      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            placeholder="First Name"
            required
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
            required
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
              <button className="btn edit" onClick={() => handleEdit(user)}>
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
