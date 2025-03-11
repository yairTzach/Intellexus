  import React, { useState } from "react";
  import axios from "axios";

  const UserForm = ({ onUserAdded }) => {  
    const [name, setName] = useState("");

    const handleAddUser = async () => {
      if (!name) return alert("Please enter a username!");

      try {
        await axios.post("http://localhost:3000/users", { name });
        alert(`User "${name}" added!`);
        setName("");
        onUserAdded(); // 🔄 Refresh Graph
      } catch (error) {
        console.error("Error creating user:", error);
        alert("Failed to add user.");
      }
    };

    const handleRemoveUser = async () => {
      if (!name) return alert("Please enter a username to remove!");

      try {
        await axios.post("http://localhost:3000/removeusers", { name });
        alert(`User "${name}" removed!`);
        setName("");
        onUserAdded(); // 🔄 Refresh Graph
      } catch (error) {
        console.error("Error removing user:", error);
        alert("Failed to remove user.");
      }
    };

    return (
      <div>
        <h3>Manage Users</h3>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter username"
        />
        <button onClick={handleAddUser}>Add User</button>
        <button onClick={handleRemoveUser} style={{ marginLeft: "10px", backgroundColor: "red", color: "white" }}>
          Remove User
        </button>
      </div>
    );
  };

  export default UserForm;
