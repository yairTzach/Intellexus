import React, { useState } from "react";
import axios from "axios";

const FriendshipForm = ({ onDataUpdated }) => {  // ✅ Accept onDataUpdated
  const [user1, setUser1] = useState("");
  const [user2, setUser2] = useState("");

  const handleAddFriendship = async () => {
    if (!user1 || !user2) return alert("Please enter both usernames!");
    if (user1 === user2) return alert("Users cannot be friends with themselves!");

    try {
      await axios.post("http://localhost:3000/friendships", { user1, user2 });
      alert(`Friendship created between "${user1}" and "${user2}"!`);
      setUser1("");
      setUser2("");
      onDataUpdated(); // ✅ Trigger refresh
    } catch (error) {
      console.error("Error creating friendship:", error);
      alert("Failed to create friendship.");
    }
  };

  return (
    <div>
      <h3>Add Friendship</h3>
      <input
        type="text"
        value={user1}
        onChange={(e) => setUser1(e.target.value)}
        placeholder="Enter first user"
      />
      <input
        type="text"
        value={user2}
        onChange={(e) => setUser2(e.target.value)}
        placeholder="Enter second user"
      />
      <button onClick={handleAddFriendship}>Create Friendship</button>
    </div>
  );
};

export default FriendshipForm;
