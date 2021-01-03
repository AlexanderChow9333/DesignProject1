var accessToken = ""
var url = "https://accounts.spotify.com/api/token";
var clientID = "4f5a060d4ccd4746b33ed4f222ae03a6";  //copy your client ID from your app
var secretID = "02eb78441d394bdd92c869267ffe773f";  //copy your client secret from your app
var authID = btoa(clientID+":"+secretID);   //this is Base64 encoding required by Spotify

mainFunction();

//note the use of asynchronous functions here
//this is necessary to ensure that things happen in the correct order
//if you need to do a series of searches, the await is a necessary part of the procedure
//put additional searches in their own asynchronous functions to maintain the correct order

async function mainFunction() {
    await getAccessToken();
    await searchSpotify(accessToken);
}

async function searchSpotify(accessToken) {
    //this is the example on the Spotify API page
    //you can use any Spotify endpoint for general searches
    await fetch("https://api.spotify.com/v1/tracks/2TpxZ7JUBn3uw46aR7qd6V",
    {
        headers: 
        {
            Authorization: "Bearer " + accessToken
        }
    })
    .then((resp) => resp.json())
    .then(function(data) {
        console.log(data);
    })
    .catch(function(error) {
        console.log(error);
    });
}

async function getAccessToken() {
    await fetch(url, 
    {
        body: "grant_type=client_credentials",
        headers: 
        {
            Authorization: "Basic "+authID,
            "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "POST"
    })
    .then((resp) => resp.json())
    .then(function(data) {
        accessToken = data.access_token;
    })
    .catch(function(error) {
        console.log(error);
    });
}

$(document).ready(function() {
    var video = document.querySelector("#videoElement");

    if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(function (stream) {
        video.srcObject = stream;
        })
        .catch(function (err0r) {
        console.log(err0r);
        });
    }
});

