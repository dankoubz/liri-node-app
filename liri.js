// LIRI APP

require("dotenv").config(); // require dotenv configure

var fs = require("fs"); // requries for liri
var keys = require("./keys.js"); // spotify access
var figlet = require("figlet"); // figlet adds font styles command line
var Spotify = require("node-spotify-api"); // spotify node
var axios = require('axios'); // axios node js
var chalk = require("chalk"); // adds colours to console text
// var moment = reqire("moment"); // time conversion
var spotify = new Spotify(keys.spotify); // call api keys to access

var command = process.argv[2]; // user command input
var search = process.argv[3]; // user search input

// function to choose command from user
function searchInputs() {
    switch (command) {
        case 'concert-this':
            bandsInTown(search);
            break;
        case 'spotify-this-song':
            spotifySong(search);
            break;
        case 'movie-this':
            omdbInfo(search);
            break;
        case 'do-what-it-says':
            getRandom();
            break;
        default:
            display("Uh oh! Self-destructing in 3..2..1..");
            break;
    }
};

// function to find bands + concerts
function bandsInTown(search) {

    if ('concert-this') {
        var artist = "";
        for (var i = 3; i < process.argv.length; i++) {
            artist += process.argv[i];
        }

        var bandsFig = "Bandsintown";

        figlet(bandsFig, function(err, data) {
            if (err) {
                console.log('Something went wrong...');
                console.dir(err);
                return;
            }
            console.log(chalk.green(data));
        });
    } else {
        artist = search;
    }

    var queryUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";

    axios({
        url: queryUrl,
        method: 'get'
    }).then(function(response) {
        // console.log(response);
        display(chalk.white("\n+----------------------------------------------------------------+\n"));
        display(chalk.red("Name: " + response.data[1].venue.name));
        display(chalk.red("City: " + response.data[1].venue.city));
        display(chalk.red("Date: " + response.data[1].datetime));
        display(chalk.white("\n+----------------------------------------------------------------+\n"));
    });
}

// function to call spotify api and search for song info
function spotifySong(search) {

    // Display text when user searches spotify song
    var spotifyFig = "Spotify Songs"
    var searchTrack; // store search track locally

    if (search === undefined) {
        searchTrack = "Ghost In My Bed"; // predifined track
    } else {
        searchTrack = search; // user input
    }

    // display error meesage
    figlet(spotifyFig, function(err, data) {
        if (err) {
            console.log("Something went wrong...");
            console.dir(err);
            return;
        }
        console.log(chalk.green(data)); // make text green display data
    });

    // search spotify api + display song info
    spotify.search({
        type: 'track',
        query: searchTrack
    }, function(error, data) {
        if (error) {
            display("Error recorded: " + error);
            return;
        } else {
            display(chalk.white("\n+----------------------------------------------------------------+\n"));
            display(chalk.green("Artist: " + data.tracks.items[0].artists[0].name));
            display(chalk.green("Song: " + data.tracks.items[0].name));
            display(chalk.green("Preview: " + data.tracks.items[3].preview_url));
            display(chalk.green("Album: " + data.tracks.items[0].album.name));
            display(chalk.white("\n+---------------------------------------------------------------+\n"));

        }
    });

}

// function to find more artist information through OMBD
function omdbInfo(search) {

    // Display text when user searches spotify song
    var omdbFig = "OMDB Movies"
    var findMovie; // store movie serach term

    if (search === undefined) {
        findMovie = "Mr. Nobody";
    } else {
        findMovie = search;
    };

    // display error meesage
    figlet(omdbFig, function(err, data) {
        if (err) {
            console.log('Something went wrong...');
            console.dir(err);
            return;
        }
        console.log(chalk.blue(data));
    });

    // url for api call - OMBD
    var queryUrl = "http://www.omdbapi.com/?t=" + findMovie + "&y=&plot=short&apikey=trilogy";

    axios({
        url: queryUrl,
        method: 'get'
    }).then(function(response) {
        display(chalk.white("\n+----------------------------------------------------------------+\n"));
        display(chalk.blue("Title: " + response.data.Title));
        display(chalk.blue("Release Year: " + response.data.Year));
        display(chalk.blue("IMDB Rating: " + response.data.imdbRating));
        display(chalk.blue("Rotten Tomatoes Rating: " + response.data.Ratings[1].Value));
        display(chalk.blue("Country: " + response.data.Country));
        display(chalk.blue("Language: " + response.data.Language));
        display(chalk.blue("Plot: " + response.data.Plot));
        display(chalk.blue("Actors: " + response.data.Actors));
        display(chalk.white("\n+----------------------------------------------------------------+\n"));
    });

}

// function to get text file name of song
function getRandom() {
    fs.readFile('random.txt', "utf8", function(error, data) {
        if (error) {
            return display(error);
        }

        var dataArr = data.split(","); // seperate , for search term

        if (dataArr[0] === "spotify-this-song") {
            var songcheck = dataArr[1].trim().slice(1, -1);
            spotifySong(songcheck); // pass paramter as song search
        }

    });
}

// function to display text + load err
function display(dataToLog) {
    console.log(dataToLog);
    fs.appendFile('log.txt', dataToLog + '\n', function(err) {
        if (err) return display('Error logging data to file: ' + err);
    });
}


searchInputs(); // call user search input function