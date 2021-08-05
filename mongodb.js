const { MongoClient } = require("mongodb");


// Connection URI
const uri = "mongodb://127.0.0.1:/admin";
// Create a new MongoClient
const client = new MongoClient(uri);
let db;
async function run() {
  try {
    // Connect the client to the server
    await client.connect();
    // Establish and verify connection
    db = await client.db("admin").command({ ping: 1 });
    console.log("Connected successfully to server");
    // await fetchData();
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

async function savePlaylist(playlist) {
    // console.log(`Creating user : ${playlist}`);
    const data = await client.db("ayushi-music").collection("playlist").insertOne(playlist);
    console.log(`Created Playlist successfully ${data}`); 
}

async function deleteAllPlaylist(playlist) {
  // console.log(`Creating user : ${playlist}`);
  const data = await client
    .db("ayushi-music")
    .collection("playlist")
    .deleteMany({});
  console.log(`Deleted all Playlists successfully ${data}`);
}

async function getUser(userName){
  console.log(`getting user : ${userName}`);
  const data = await client
    .db("ayushi-music")
    .collection("query")
    .find({
      name:userName,
    })
    .toArray();
    return data ? data[0] : "Not Found";
  }

module.exports = {
  run,
  savePlaylist,
  deleteAllPlaylist,
};