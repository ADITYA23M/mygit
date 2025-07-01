const express = require("express");
const sequelize = require('./db');
const fs = require('fs')
const users = require("./MOCK_DATA.json");

const app = express();
const PORT = 8000;

app.use(express.urlencoded({ extended: true}));
app.use(express.json());

sequelize.authenticate()
.then( () => {
  console.log('Database connected successfully.');
})
.catch(err => {
  console.error('Database connection failed:', err);
});

const basicAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    res.setHeader('WWW-Authenticate', 'Basic realm="User Info"');
    return res.status(401).send('Authentication required.');
  }

  const base64Credentials = authHeader.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
  const [username, password] = credentials.split(':');

  
  const VALID_USERNAME = 'ADITYA23M';
  const VALID_PASSWORD = 'Password123';

  if (username === "ADITYA23M" && password === "Password123") {
    next();
  } else {
    return res.status(403).send('Forbidden: Incorrect credentials.');
  }
};

app.use('/api/users', basicAuth);

app.get("/api/users", (req, res) => {
  console.log("'/api/users' route hit!");
    return res.json(users);
});
app
.route("/api/users/:id")
.get((req, res) => {
    const id = Number(req.params.id);
    const body = users.find((user) => user.id === id);
    return res.json(user);
})
  .put((req, res) => {
    const getid  = Number(req.params.id);
    const body = req.body;
    console.log('Type of users:', typeof users, 'Value of users:', users);
     const userindex = users.findIndex(user => user.id === getid);
     const gotUser = users[userindex];
     const updatedUser = {...gotUser,...body};
     users[userindex] = updatedUser;
     fs.writeFile('./users_MOCK_DATA.json', JSON.stringify(users), (err, data) => {
      return res.json({status: "Success", updatedUser}); 
     })       
  })

  .delete((req, res) =>{
     const id = Number(req.params.id);
  const index = users.findIndex(u => u.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "User not found" });
  }  
  const [deletedUser] = users.splice(index, 1);
  fs.writeFile('./MOCK_DATA.json', JSON.stringify(users, null, 2), err => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error deleting user" });
    }
    return res.json({ message: "User deleted successfully", deletedUser });
  });
});

app.post("/api/users", (req, res) => {
    const body = req.body;
    console.log("Body", body);
    return res.json({ status: "pending " });
});

app.listen(PORT, () => console.log(`Server Started at PORT:${PORT}`));