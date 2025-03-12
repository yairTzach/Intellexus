require('dotenv').config();
const express = require('express');
const neo4j = require('neo4j-driver');
const cors = require('cors');
const path = require('path')

const app = express();
const http = require('http').createServer(app)
app.use(express.json());
app.use(cors());


app.use(express.static(path.resolve(__dirname, 'public')))


// Connect to Neo4j
const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD)
);

// Add a New User
app.post('/users', async (req, res) => {
    console.log(driver);
    const { name } = req.body;
    const session = driver.session();
    try {
        await session.run('CREATE (u:User {name: $name})', { name });
        res.status(201).json({ message: "User created" }); // ✅ Ensure JSON response
    } catch (err) {
        console.error("Error creating user:", err);
        res.status(500).json({ error: "Failed to create user" });
    } finally {
        await session.close();
    }
});

app.post('/removeusers', async (req, res) => {
    const { name } = req.body;
    const session = driver.session();
    try {
        await session.run(
            `MATCH (u:User {name: $name}) 
             DETACH DELETE u`, 
            { name }
        );
        res.status(200).send({ message: 'User removed' });
    } catch (err) {
        console.error("Error removing user:", err);
        res.status(500).send({ error: "Failed to remove user" });
    } finally {
        await session.close();
    }
});


// Create a Friendship Between Users
app.post('/friendships', async (req, res) => {
    const { user1, user2 } = req.body;
    const session = driver.session();
    try {
        await session.run(
            'MATCH (a:User {name: $user1}), (b:User {name: $user2}) CREATE (a)-[:FRIENDS_WITH]->(b)',
            { user1, user2 }
        );
        res.status(201).send({ message: 'Friendship created' });
    } catch (err) {
        res.status(500).send(err);
    } finally {
        await session.close();
    }
});





//  Get All Users
app.get('/users', async (req, res) => {
    const session = driver.session();
    try {
        const result = await session.run("MATCH (u:User) RETURN u.name AS name");
        const users = result.records.map(record => ({ name: record.get("name") }));
        console.log(users);
        res.json({ users });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Internal server error" });
    } finally {
        await session.close();
    }
});

//  Get All Friendships
app.get('/friendships', async (req, res) => {
    const session = driver.session();
    try {
        const result = await session.run("MATCH (a:User)-[:FRIENDS_WITH]->(b) RETURN a.name AS user1, b.name AS user2");
        const friendships = result.records.map(record => ({
            user1: record.get("user1"),
            user2: record.get("user2"),
        }));
        res.json({ friendships });
    } catch (error) {
        console.error("Error fetching friendships:", error);
        res.status(500).json({ error: "Internal server error" });
    } finally {
        await session.close();
    }
});


//  Get a User’s Friends
app.get('/users/:name/friends', async (req, res) => {
    const { name } = req.params;
    const session = driver.session();
    try {
        const result = await session.run(
            'MATCH (a:User {name: $name})-[:FRIENDS_WITH]->(b) RETURN b.name AS friend',
            { name }
        );
        const friends = result.records.map(record => record.get('friend'));
        res.send({ friends });
    } catch (err) {
        res.status(500).send(err);
    } finally {
        await session.close();
    }
});

app.get('/**', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

// Start the Server
http.listen(3000, () => console.log('Server running'));
