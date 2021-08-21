const { MongoClient } = require("mongodb");
const dbUserName = process.env.MONGO_USERNAME;
const dbPassword = process.env.MONGO_PASSWORD;
const dbURI = process.env.MONGO_URI;

// Connection URI
// const uri = "mongodb://127.0.0.1:/admin";
const uri =
    `mongodb+srv://${dbUserName}:${dbPassword}@${dbURI}:`;
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
// searchSongs
async function searchSong(song){
  const projection = { playlistID: 1, _id: 0 };
  console.log("Searching song with query ", song);

  // Collecting playlist records matching the query
  let data = await client
    .db("ayushi-music")
    .collection("playlist")
    .find({ name: new RegExp(song, "i") })
    .project(projection)
    .toArray();
  console.log(data);
   let mappedplaylist = data.map(function(val){
        return val.playlistID;
   })
   console.log("mapped List",mappedplaylist);
  // Now collecting meta-data for all playlist-id fetched in the above query

  const songs = await client
    .db("ayushi-music")
    .collection("playlist-metadata")
    .find({
      playlistID: {
        $in: mappedplaylist,
      },
    })
    .toArray();
  console.log(songs);

  return songs ? songs : "NotFound";
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

  async function saveMessage(message) {
    // console.log(`Creating user : ${playlist}`);
    const data = await client
      .db("ayushi-music")
      .collection("message")
      .insertOne(message);
    console.log(`Created Message successfully ${data}`);
  }


module.exports = {
  run,
  savePlaylist,
  deleteAllPlaylist,
  saveMetadata,
  deleteAllMetadata,
  fetchPlaylist,
  fetchPlaylistMetadata,
  saveMessage,
  searchSong,
};