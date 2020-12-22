const {
  openWeatherMapAPI,
  algoliaAPI,
  alogoliaAppID,
} = require("./config.json");

const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const fetch = require("node-fetch");
const { get } = require("http");
const ejs = require("ejs");
const moment = require("moment"); // require
const base = "https://api.openweathermap.org/data/2.5/";

let weather = "";
let location = "";
let temp = "";
let desc = "";
let humidity = "";
let icon = "http://openweathermap.org/img/wn/02d@2x.png";
let date = moment().format("MMMM Do, YYYY");
let minTemp = "";
let maxTemp = "";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("home", {
    location: location,
    temp: temp,
    humidity: humidity,
    icon: icon,
    desc: desc,
    date: date,
    minTemp: minTemp,
    maxTemp: maxTemp,
  });
});

app.post("/", (req, res) => {
  let query = req.body.placeName;

  fetch(`${base}weather?q=${query}&units=metric&APPID=${openWeatherMapAPI}`)
    .then((weather) => {
      return weather.json();
    })
    .then(displayResults);

  function displayResults(response) {
    weather = response;
    location = `${weather.name}` + ", " + `${weather.sys.country}`;
    temp = Math.round(response.main.temp);
    desc = response.weather[0].description;
    humidity = response.main.humidity;
    icon = `http://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`;
    minTemp = Math.round(response.main.temp_min);
    maxTemp = Math.round(response.main.temp_max);

    res.redirect("/");
  }
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
