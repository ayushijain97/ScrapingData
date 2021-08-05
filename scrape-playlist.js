var request = require("request");
const mongo = require("./mongodb.js");
const { v4: uuidv4 } = require("uuid");


  function checkingType(url){

      if(url.includes("album")){
        return "album";
      }
      else if(url.includes("song")){
          return "song";
      }
      else{
        return "playlist";
      }
  }

async function scrape(playlistMetadata) {
  const playlistUrl = playlistMetadata.href;
  console.log(`fetching playlist ${playlistUrl}`);
  var clientServerOptions ={
    uri: `https://apg-saavn-api.herokuapp.com/${checkingType(playlistUrl)}/?q=${playlistUrl}`,
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };
  const playlist = await makeRequest(clientServerOptions);
  try{
    const parsePlaylist = JSON.parse(playlist);
    const playlistUUID = uuidv4();
    parsePlaylist.playlistID = playlistUUID;
    mongo.savePlaylist(parsePlaylist);
    console.log(parsePlaylist.image);
    playlistMetadata.image = parsePlaylist.image;
    playlistMetadata.playlistID = playlistUUID;
    mongo.saveMetadata(playlistMetadata);
  }catch(err){
    console.log(`Error while parsing playlist ${playlistUrl}`);
    console.log(err);
  }
  
  return playlist;
}

function makeRequest(clientServerOptions) {
  return new Promise(function (resolve, reject) {
    request(clientServerOptions, function (error, response) {
        resolve(response.body);
    });
  });
}
module.exports ={
  scrape: scrape
}

