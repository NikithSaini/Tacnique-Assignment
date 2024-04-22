// App.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const App = () => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    department: "",
  });
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        "https://jsonplaceholder.typicode.com/users"
      );
      setUsers(response.data);
    } catch (error) {
      setError("Failed to fetch users");
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const addUser = async () => {
    try {
      const response = await axios.post(
        "https://jsonplaceholder.typicode.com/users",
        formData
      );
      setUsers([...users, response.data]);
      setFormData({
        id: "",
        firstName: "",
        lastName: "",
        email: "",
        department: "",
      });
    } catch (error) {
      setError("Failed to add user");
    }
  };

  const deleteUser = async (userId) => {
    try {
      await axios.delete(
        `https://jsonplaceholder.typicode.com/users/${userId}`
      );
      setUsers(users.filter((user) => user.id !== userId));
    } catch (error) {
      setError("Failed to delete user");
    }
  };

  const editUser = (user) => {
    setFormData(user);
    setEditing(true);
  };

  const updateUser = async () => {
    try {
      await axios.put(
        `https://jsonplaceholder.typicode.com/users/${formData.id}`,
        formData
      );
      const updatedUsers = users.map((user) =>
        user.id === formData.id ? formData : user
      );
      setUsers(updatedUsers);
      setFormData({
        id: "",
        firstName: "",
        lastName: "",
        email: "",
        department: "",
      });
      setEditing(false);
    } catch (error) {
      setError("Failed to update user");
    }
  };

  return (
    <div>
      <h1>User Management Dashboard</h1>
      {error && <p>{error}</p>}
      <h2>Users</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            ID: {user.id}, Name: {user.name}, Email: {user.email}, Department:{" "}
            {user.department}
            <button onClick={() => deleteUser(user.id)}>Delete</button>
            <button onClick={() => editUser(user)}>Edit</button>
          </li>
        ))}
      </ul>
      <h2>{editing ? "Edit User" : "Add User"}</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          editing ? updateUser() : addUser();
        }}
      >
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleInputChange}
          placeholder="First Name"
          required
        />
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleInputChange}
          placeholder="Last Name"
          required
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="Email"
          required
        />
        <input
          type="text"
          name="department"
          value={formData.department}
          onChange={handleInputChange}
          placeholder="Department"
          required
        />
        <button type="submit">{editing ? "Update User" : "Add User"}</button>
      </form>
    </div>
  );
};

export default App;
