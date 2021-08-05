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

async function saveMetadata(metadata){
  // console.log(`getting user : ${userName}`);
  const data = await client
    .db("ayushi-music")
    .collection("playlist-metadata")
    .insertOne(metadata);
    console.log(`Created Playlist successfully ${data}`); 
  }
  
  async function deleteAllMetadata(playlist) {
    // console.log(`Creating user : ${playlist}`);
    const data = await client
      .db("ayushi-music")
      .collection("playlist-metadata")
      .deleteMany({});
    console.log(`Deleted all Playlists successfully ${data}`);
  }
  async function fetchPlaylist(playlistID) {
    console.log(`Fetching playlist for ${playlistID}`);
    const playlist = await client
      .db("ayushi-music")
      .collection("playlist")
      .find({
        playlistID: playlistID,
      })
      .toArray();
    console.log(playlist);
    return playlist ? playlist[0] : "Not Found";
  }

  async function fetchPlaylistMetadata() {
    console.log(`Fetching all Playlist metadata`);
    const playlistMetadata = await client
      .db("ayushi-music")
      .collection("playlist-metadata")
      .find({})
      .toArray();
    console.log(playlistMetadata);
    return playlistMetadata;
  }


module.exports = {
  run,
  savePlaylist,
  deleteAllPlaylist,
  saveMetadata,
  deleteAllMetadata,
  fetchPlaylist,
  fetchPlaylistMetadata,
};