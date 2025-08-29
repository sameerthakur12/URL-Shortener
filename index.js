const express = require("express");
const app = express();
const {connectToMongoDB} = require("./connect");
const URL = require("./models/url");
const path = require("path");
const staticRoute = require("./routes/staticRouter");

const urlRoute = require("./routes/url");
app.use(express.json());
app.use(express.urlencoded({ extended: false}));

const PORT = 8001;

connectToMongoDB("mongodb://localhost:27017/short-url").then(() => console.log("MongoDB connected"));

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.get("/", async(req, res) => {
    const allURLs = await URL.find({});
    return res.render("home", {
        urls: allURLs,
    });
})

app.use("/url", urlRoute);
app.use("/", staticRoute);

app.get("/url/:shortId", async (req, res) => {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate({
        shortId
    }, 
    { 
        $push: {
            visitHistory: {
                timestamp: Date.now()
            },
        },
    },
        { new: true }
    );
    if (!entry) {
        return res.status(404).send("Short URL not found");
    }
    res.redirect(entry.redirectURL);
});

app.listen(PORT, () => console.log(`Server started at port ${PORT}`));