import React, { useState, useEffect } from "react";
import axios from "axios";
import { Network } from "vis-network/standalone";

const Graph = () => {
  const [graphData, setGraphData] = useState({ nodes: [], edges: [] });

  // Fetch Users & Friendships
  const fetchData = async () => {
    try {
      const usersRes = await axios.get("http://localhost:3000/users");
      const friendshipsRes = await axios.get("http://localhost:3000/friendships");

      const users = usersRes.data.users;
      const friendships = friendshipsRes.data.friendships;

      const nodes = users.map((user) => ({ id: user.name, label: user.name }));
      const edges = friendships.map((friendship) => ({
        from: friendship.user1,
        to: friendship.user2,
      }));

      setGraphData({ nodes, edges });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData(); // Load on mount
  }, []);

  useEffect(() => {
    if (graphData.nodes.length > 0) {
      const container = document.getElementById("network");
      new Network(container, { nodes: graphData.nodes, edges: graphData.edges }, {});
    }
  }, [graphData]);

  return (
    <div className="graph-container">
      <div id="network" style={{ height: "500px" }}></div>
    </div>
  );
};

export default Graph;
