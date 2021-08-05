var request = require("request");
const mongo = require("./mongodb.js");

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

async function scrape(playlistUrl) {
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
    mongo.savePlaylist(JSON.parse(playlist));
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

