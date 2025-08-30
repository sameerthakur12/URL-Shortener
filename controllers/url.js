const {nanoid} = require("nanoid");
const URL = require('../models/url');

async function handleGenerateNewShortURL(req, res) {
    console.log("Request body:", req.body);
    const body = req.body;
    if(!body || !body.url)
        return res.status(400).json({error: "url is required"});
    const shortID = nanoid(8);
    await URL.create({
        shortId: shortID,
        redirectURL: body.url,
        visitHistory: [],
    })
    const urls = await URL.find();

    return res.render("home", {
        id: shortID,
        urls: urls,
    })
}

async function handleGetAnalytics(req, res) {
    const shortId = req.params.shortId;
    const result = await URL.findOne({shortId});
     if (!result) {
        return res.status(404).json({ error: "Short URL not found" });
    }
    return res.json({
        totalClicks: result.visitHistory.length, 
        analytics: result.visitHistory
    });
}

module.exports = {
    handleGenerateNewShortURL,
    handleGetAnalytics,
}