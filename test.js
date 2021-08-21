// Get single user by id
app.get("/users/:userName", async function (req, res) {
  const user = await mongo.getUser(req.params.userName);
  return res.send(user);
});
// "name": new RegExp(song, "i")
// Get all users
app.get("/users", async function (req, res) {
  res.setHeader("Content-Type", "application/json");
  return res.send(JSON.stringify(users));
});

app.post("/users", async function (req, res) {
  console.log("Creating user", req.body);
  users.push(req.body);
  await mongo.createUser(req.body);
  res.send("User Created successfully " + users.length);
});

app.delete("/users/:userId", async function (req, res) {
  const userId = req.params.userId - 1;
  users.splice(userId, 1);
  console.log("User deleted successfully");
  res.send();
});

app.put("/users/:userId", async function (req, res) {
  const userId = req.params.userId - 1;
  const updatedUser = req.body;
  console.log(`Updating ${users[userId]} with ${updatedUser}`);
  users[userId] = updatedUser;
  res.send();
});
async function createUser(user) {
  console.log(`Creating user : ${user}`);
  const data = await client
    .db("ayushi-music")
    .collection("users")
    .insertOne(user);
  console.log(`Created user successfully ${data}`);
}
async function getUser(userName) {
  console.log(`getting user : ${userName}`);
  const data = await client
    .db("ayushi-music")
    .collection("users")
    .find({
      name: userName,
    })
    .toArray();
  return data ? data[0] : "Not Found";
}

async function fetchData(title) {
  console.log(`Fetching data for ${title}`);
  const data = await client
    .db("ayushi-music")
    .collection("posts")
    .find({
      title: title,
    })
    .toArray();
  console.log(data);
  return data ? data[0] : "Not Found";
}
