// require dotenv configure
require("dotenv").config();

// var for keys to use spotify
var keys = require("./keys.js");


// constructor Spotify 
function Spotify() {}

// call api keys to access
var spotify = new Spotify(keys.spotify);