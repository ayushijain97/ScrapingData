const { MongoClient } = require("mongodb");


// Connection URI
const uri = "mongodb://127.0.0.1:27017/admin";
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

async function fetchData(title) {
    console.log(`Fetching data for ${title}`);
     const data = await client
       .db("acme")
       .collection("posts")
       .find({
         title: title,
       })
       .toArray();
     console.log(data);
     return data ? data[0] : 'Not Found';
}


module.exports = {
    run,
    fetchData
}