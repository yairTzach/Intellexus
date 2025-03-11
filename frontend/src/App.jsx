import React, { useState } from "react";
import Graph from "./Graph";
import UserForm from "./UserForm";
import FriendshipForm from "./FriendshipForm";
import "./App.css";

const App = () => {
  const [refresh, setRefresh] = useState(false);

  return (
    <div className="container">
      <h1>Intellexus</h1>

      {/* Project Purpose Paragraph */}
      <div className="project-description">
        <p>
          For my interview, it was important for me to <strong>experiment with and showcase my skills</strong> in
          <strong> React</strong>, <strong>Graph Databases (Neo4j)</strong>, <strong>Node.js & Express</strong>, and
          <strong> deployment to Azure</strong>. This project allowed me to <strong>apply these technologies</strong>
          together, building a full-stack application with a dynamic graph and cloud deployment
        </p>
      </div>

      <UserForm onUserAdded={() => setRefresh(!refresh)} />
      <FriendshipForm onDataUpdated={() => setRefresh(!refresh)} />
      <Graph key={refresh} />
    </div>
  );
};

export default App;
