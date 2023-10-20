import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import connectDB from "./userDatabase.js";
import bcrypt from "bcrypt";
var __dirname = dirname(fileURLToPath(import.meta.url));
console.log(__dirname);

const app = express();
const port = 3000;
var status = 0;
connectDB();

app.use(express.static("./Styles"));
app.use(express.static("/Styles"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: true }));

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  designation: {
    type: String,
    required: true,
  },
});

const userData = new mongoose.model("userData", userSchema);

//Registration and login...

async function userCheck(emailOfUser) {
  try {
    const user = await userData.findOne({ email: emailOfUser });
    if (!user) {
      console.log('The email address', emailOfUser, 'does not exist in the database.');
      return false;
    } else {
      console.log('The email address', emailOfUser, 'exists in the database.');
      console.log("User registered");
      return true;
    }
  } catch (err) {
    // Handle any errors that occur during the database query.
    console.error("Error in userCheck:", err);
    throw err;
  }
}
async function userLogin(username, password) {
  var status = {
    username: false,
    password: false,
  }
  try {
    const user = await userData.findOne({ name: username });
    console.log(user.name, user.password);
    if (!user) {
      console.log('The user', username, 'does not exist in the database.');
      status.username = false;
      status.password = true;
      return status;
    } else {
      console.log('The user', username, 'exists in the database.');
      if(password === user.password) {
        return true;
      }
      // const passwordMatch = await bcrypt.compare(password, user.password);
      // return passwordMatch;
    }
  } catch (err) {
    console.error("Error in userLogin:", err);
    throw err;
  }
}

//Requests and Responses

app.post("/Homepage", async (req, res) => {
  try {
    console.log(req.body.name, req.body.password);
    const userExists = await userLogin(req.body.name, req.body.password);
    if (userExists.username === true && userExists.password === true) {
      console.log("\nSuccessful Login");
      console.log("User: " + req.body.name);
      status = 1;
      res.render(__dirname + "/Views/Homepage.ejs", {
        Status: 1, 
      });
    } else if((userExists.username === true && userExists.password === false) || (userExists.username === false && userExists.password === true)) {
      console.log("\nUser not found");
      res.render(__dirname + "/Views/login.ejs",{
        failedLogin : true,
        Stats: userExists,
      });
    }
  } catch (err) {
    console.error("Error:", err);
    console.log("User not found");
    res.status(500).send("Internal Server Error");
  }
  console.log("Status Delivered: " + status);
});


app.post("/Register", async (req, res) => {
  const data = {
    name: req.body.name,
    password: req.body.password,
    email: req.body.email,
    designation: req.body.designation,
  };

  try {
    const userExists = await userCheck(req.body.email);
    if (userExists) {
      console.log("\nUser Exists!");
      console.log("Resending registration Page");
      res.render(__dirname + "/Views/register.ejs", {
        accountExists: true,
      });
    } else {
      await userData.insertMany([data]);
      res.render(__dirname + "/Views/Homepage.ejs", {
        status: 1,
      });
    }
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/Register", (req, res) => {
  res.render(__dirname + "/Views/register.ejs", {
  });
})

app.get("/Logout", (req, res) => {
  console.log("User logged Out!");
  status = 0;
  res.redirect("/");
});

app.get("/", (req, res) => {
  console.log("Sending file at: " + __dirname + "/Views/Homepage.ejs");
  console.log("User Arrived!");
  res.render(__dirname + "/Views/Homepage.ejs", {
    Status: 0,
  });
});

app.get("/Login", (req, res) => {
  console.log("Sending file at: " + __dirname + "/Views/login.ejs");
  res.render(__dirname + "/Views/login.ejs");
});

app.get("/homepage", (req, res) => {
  console.log("Sending file at: " + __dirname + "/Views/Homepage.ejs");
  res.render(__dirname + "/Views/Homepage.ejs");
});

app.get("/about", (req, res) => {
  console.log("Sending file at: " + __dirname + "/Views/about.html");
  res.sendFile(__dirname + "/Views/about.html");
});

app.get("/contact_us", (req, res) => {
  console.log("Sending file at: " + __dirname + "/Views/Contact_us.html");
  res.sendFile(__dirname + "/Views/Contact_us.html");
});

app.get("/Video_Generator", (req, res) => {
  res.render("categories.ejs", {
    title: "Video Generator",
    Count: 10,
    name: videoGenName,
    link: videoHref,
    path: "Resources/Video/icon",
    ratings: rating,
    description: vid_description,
    tags: vidtags,
  });
});
app.get("/Logo_Generator", (req, res) => {
  res.render("categories.ejs", {
    title: "Logo Generator",
    Count: 10,
    name: logoGenName,
    link: logoHref,
    path: "Resources/Logo/icon",
    ratings: rating,
    description: logo_description,
    tags: logoTags,
  });
});
app.get("/Music_Generator", (req, res) => {
  res.render("categories.ejs", {
    title: "Music Generator",
    Count: 12,
  });
});
app.get("/Copy_Writing", (req, res) => {
  res.render("categories.ejs", {
    title: "Copy_Writing",
    Count: 12,
  });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

const videoGenName = [
  "Veed.io",
  "Descript",
  "Synthesia",
  "HeyGen",
  "Deepbrain",
  "Synthesys",
  "Quickvid.ai",
  "Wavevideo",
  "Designs.AI",
  "Runway",
];

const videoHref = [
  "https://www.veed.io/",
  "https://www.descript.com/?lmref=Qln6zg&lm_meta=cdescript%20ai-1007753-g",
  "https://www.synthesia.io/tools/video-maker",
  "https://demo.heygen.com/free-video",
  "https://www.deepbrain.io/",
  "https://synthesys.io/ai-video-generator/",
  "https://www.quickvid.ai/",
  "https://wave.video/tools/video-marketing/turn-text-into-video",
  "https://designs.ai/",
  "https://runwayml.com/video-editing/",
];

const rating = [5, 4, 3, 5, 4, 4, 3, 5, 4, 3];

const vid_description = [
  "Record and edit your videos in the cloud. We help scale your brand, channel or vlog. An online video suite for professionals. Record and edit your videos in the cloud.",
  "Use the power of AI & skip the hard part of editing videos. Try Descript for free. Remove video backgrounds, filler words & background noise. Clone your voice. In one click. Overdub. Social Clips & Templates. Transcription. Filler Word Removal. Podcasting.",
  "Create Professional Videos in 15 Minutes. Replace Boring Docs, Powerpoints, And Pdfs. Synthesia Allows You To Create Videos From Plain Text In Minutes. View Products. Browse Features. Explore Resources.",
  "Heygen is a Video Platform That Help you Create Engaging Business Video with Generative AI. .Make your spokesperson or digital teacher video in minutes, as easy as making PowerPoints.",
  "DeepBrain AI offers a leading video generator, transforming text into videos swiftly with photo-realistic AI avatars. It provides multilingual support, diverse customizable avatars, and intuitive editing tools, optimizing video production costs and time.",
  "Creating professional AI content at scale has never been easier. From videos with avatars and voiceovers to images, Synthesys is the only Ai content suite you'll ever need. You can create videos, images, voiceovers, and everything else you might need in a single intuitive platform",
  "Your one-stop solution for crafting engaging YouTube Shorts. Experience an AI-powered streamlined workflow designed for efficiency and ease-of-use. No video editing experience required.",
  "Easiest platform to make and record videos. Live Streaming Studio, Video Editor, Thumbnail Maker, Video Hosting, Video Recording, and Stock Library combined in one platform.Stream live or broadcast pre-recorded videos to multiple channels simultaneously.",
  "Create logos, videos, banners, mockups with A.I. in 2 minutes.Designs.ai helps you save time, cut costs, and simplify your workflow.Use our text-to video technology to transform articles, posts, and text scripts into powerful, fully-edited videos in more than 20 languages.",
  "From basic video editing to advanced post-processing, Runway is like having your own video production studio right inside your browser. Try our professional video editing software on your next project for flawless visual effects, video formatting, color correction and more.",
];

const vidtags = [
  ["Sales Videos", "Editor", "Subtitles", "Translations"],
  ["Podcasting", "Transcription", "Screen Recording"],
  ["Voice cloning", "AI Avatars", "AI Voices", "Video Templates"],
  ["Editor", "Templates", "Avatars", "Assets"],
  ["Avatars", "AI Human", "AI Interview", "Text to video"],
  ["AI Images", "Voice Cloning", "API", "Image Generator"],
  ["Cloning", "Avatar", "Overlays", "Editor"],
  ["Video Editing", "Audio Editing", "Video Hosting", "Converters"],
  ["Logomaker", "Video Editor", "Media Generator"],
  ["Inpainting", "Infinite Image", "Image to Video"],
];

const logoGenName = [
  "Logoai",
  "Tailor Brands",
  "Looka",
  "Designevo",
  "Logo",
  "Wix",
  "Hatchful",
  "Logomaster ai",
  "Logobean",
  "Designs Ai",
];

const logoHref = [
  "https://www.google.com/aclk?sa=l&ai=DChcSEwjBv6voqqqBAxWXD3sHHeo9De8YABABGgJ0bQ&ase=2&gclid=CjwKCAjw3oqoBhAjEiwA_UaLtpxl8nAiNqmelkjT-g74dkatKl_ZbznjOSAvfPFnRDxCAgrrPdltFBoCCL8QAvD_BwE&sig=AOD64_0bMjShKgSBum9BJtlCC0T6940ONQ&nis=4&adurl&ved=2ahUKEwjutqPoqqqBAxU9bfUHHQFIDkcQqyQoAHoECA0QCw",
  "https://www.tailorbrands.com/logo-maker",
  "https://looka.com/logo-maker/",
  "https://www.designevo.com/logo-maker/",
  "https://logo.com/logo-maker",
  "https://www.wix.com/logo/maker",
  "https://help.shopify.com/en/manual/online-store/images/hatchful",
  "https://app.logomaster.ai/edit",
  "https://www.logobean.com/index.html",
  "https://designs.ai/logomaker/start",
];

const logo_description = [];
const logoTags = [["Logo Generator", "AI"], ["12"], ["14"]];
