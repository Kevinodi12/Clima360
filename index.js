import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import ejs from "ejs";

const app = express();
const apiKey = "9eb58f7fdc7bbd1f0ba39e0524ae46bd";
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
const port = 3000;
const url = "https://api.openweathermap.org/data/2.5/weather?";
const unit = "metric";
const lang = "es";

app.get("/", (req, res) => {
    res.render("index.ejs");
});

app.get("/infodetallada", (req, res) => {
    res.render("infodetallada.ejs", {
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
        
    
        res.render("infodetallada.ejs", {
            city: cityName.charAt(0).toUpperCase() + cityName.slice(1), 
            temp: temp,
            desc: desc, 
            iconUrl: iconUrl,
        });
    } catch (error) {
        console.log(error);
        res.render("infodetallada.ejs", {
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