import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import ejs from "ejs";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const apiKey = process.env.api_Key;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
const port = 3000;
const url = "https://api.openweathermap.org/data/2.5/weather?";
const unit = "metric";
const lang = "es";

app.set("view engine", "ejs");

app.get("/", async (req, res) => {
    const cities = ["Buenos Aires", "New York", "Tokyo", "London", "Paris" ,"Ginebra"];
    const weatherData = [];

    try {
        const requests = cities.map(city =>
            axios.get(url, {
                params: {
                    q: city,
                    appid: apiKey,
                    units: unit,
                    lang: lang,
                },
            })
        );

        const responses = await Promise.all(requests);

        responses.forEach(response => {
            weatherData.push({
                city: response.data.name,
                temp: response.data.main.temp,
                min: response.data.main.temp_min,
                max: response.data.main.temp_max,
                rain: response.data.rain ? response.data.rain["1h"] : "0%",
                clouds: response.data.clouds.all,
                humidity: response.data.main.humidity,
                iconUrl: `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`,
                description: response.data.weather[0].description.charAt(0).toUpperCase() + response.data.weather[0].description.slice(1),
            });
        });

        res.render("index.ejs", { weatherData });
    } catch (error) {
        console.log(error);
        res.render("index.ejs", { weatherData: [] });
    }
});


app.get("/infodetallada", (req, res) => {
    res.render("infodetallada", {
        temp: "",
        desc: "",
        iconUrl: "",
    });
});

app.post("/", async (req, res) => {
    const cityName = req.body.cityName;
    try {
        const response = await axios.get(url, {
            params: {
                q: cityName,
                appid: apiKey,
                units: unit,
                lang: lang,
            },
            
        });

        const temp = response.data.main.temp;
        const desc = response.data.weather[0].description.charAt(0).toUpperCase() + response.data.weather[0].description.slice(1);
        const icon = response.data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;
        const humidity = response.data.main.humidity;
        const clouds = response.data.clouds.all;
        const rain = response.data.rain ? response.data.rain["1h"] : "0%";
        const max = response.data.main.temp_max;
        const min = response.data.main.temp_min;

        res.render("infodetallada", {
            city: cityName.charAt(0).toUpperCase() + cityName.slice(1),
            temp: temp,
            desc: desc,
            iconUrl: iconUrl,
            humidity: humidity,
            clouds: clouds,
            rain: rain,
            max: max,
            min: min
        });
    } catch (error) {
        console.log(error);
        res.render("infodetallada", {
            city: "",
            temp: "",
            desc: "",
            iconUrl: "",
            
        });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
