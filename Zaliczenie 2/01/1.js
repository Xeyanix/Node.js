const { MongoClient } = require("mongodb");
const express = require("express");
require("dotenv").config();
const app = express();


const PORT = process.env.PORT;
const DB_NAME = process.env.DB_NAME;
const URI = process.env.CONNECTION_STRING;

let users = [
  {
    id: 1,
    login: "John",
    password: "pass1",
  },
  {
    id: 2,
    login: "Adam",
    password: "pass2",
  },
  {
    id: 3,
    login: "Agatha",
    password: "pass3"
  },
];

if (!process.env.CONNECTION_STRING || !process.env.DB_NAME) {
  console.error(
    "please set up variables in file .env"
  );
  process.exit(1);
}

const client = new MongoClient(process.env.CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function main() {
  await client.connect();
  console.log('Connection to server is ok');
  const db = client.db(process.env.DB_NAME);
  const collectionName = "ADs Panel";
  const adCollection = db.collection(collectionName);
}
main()
  .then(message => console.log(message))
  .catch(error => console.log(error))
  .finally(() => client.close());

let advertisement = [];

function isUserVerified(userData) {
  const passArray = users.map((user) => {
    return user.login + ":" + user.password;
  });
  return passArray.includes(userData);
}

function authenticateUser(req, res, next) {
  const isUserOk = isUserVerified(req.headers.authorization); //John:pass1
  if (isUserOk) {
    next();
  } else {
    res.status(401);
    res.send("Correct your name / password");
  }
}

app.get("/heartbeat", (req, res) => {
  const newDate = new Date().toLocaleString();
  res.send(newDate);
});

app.get("/ads", (req, res) => {
  console.log(advertisement);
  res.json(advertisement);
});

app.use(express.json());

app.post("/addAdsBody", (req, res) => {
  if (
    !req.body.title ||
    !req.body.description ||
    !req.body.author ||
    !req.body.userId ||
    !req.body.category ||
    !req.body.tag ||
    !req.body.price
  ) {
    res.status(400).send("Missing parameters");
  }

  let adIds = advertisement.map((ad) => ad.id);
  let maxAdId = Math.max(...adIds);
  let newAdId = maxAdId == -Infinity ? 1 : maxAdId + 1;

  const newAd = {
    id: newAdId,
    title: req.body.title,
    description: req.body.description,
    author: req.body.author,
    userId: req.body.userId,
    category: req.body.category,
    tag: req.body.tag,
    price: req.body.price,
  };

  advertisement.push(newAd);
  res.statusCode = 201;
  res.send("created");
});

app.get("/ads/search", (req, res) => {
  const { title, description, author, category, tag, price} =
    req.query;

  const adsFound = [];

  advertisement.forEach((ad) => {
    if (title && ad.title.toLowerCase().includes(title.toLowerCase())) {
      adsFound.push(ad);
    }

    if (
      description &&
      ad.description.toLowerCase().includes(description.toLowerCase())
    ) {
      adsFound.push(ad);
    }

    if (author && ad.author.toLowerCase().includes(author.toLowerCase())) {
      adsFound.push(ad);
    }

    if (
      category &&
      ad.category.toLowerCase().includes(category.toLowerCase())
    ) {
      adsFound.push(ad);
    }

    if (
      tag &&
      ad.tag.toLowerCase().includes(tag.toLowerCase())
    ) {
      adsFound.push(ad);
    }

    if (
      price &&
      ad.price.toLowerCase().includes(price.toLowerCase())
    ) {
      adsFound.push(ad);
    }
  });

  if (adsFound.length > 0) {
    res.json(adsFound);
  } else {
    res.status(404).send("Nie znaleziono pasujących ogłoszeń.");
  }
});

app.get("/ads/:id", (req, res) => {
  const ad = advertisement.filter((ad) => ad.id == req.params.id);

  if (ad.length == 0) {
    res.status(404).send("advertisement not found");
  }
  res.format({
    "application/json": function () {
      res.send(ad[0]);
    },
    "text/plain": function () {
      res.send(ad[0]);
    },
    "text/html": function () {
      res.send(ad[0]);
    },

    default: function () {
      res.status(406).send("Not Acceptable");
    },
  });
  res.json(ad[0]);
});

app.put("/ads/:id", authenticateUser, (req, res) => {
  const modyfiedAd = advertisement.find((ad) => ad.id == req.params.id);
  const body = req.body;
  const index = advertisement.indexOf(modyfiedAd);

  if (
    !req.body.title ||
    !req.body.description ||
    !req.body.author ||
    !req.body.category ||
    !req.body.tag ||
    !req.body.price
  ) {
    res.status(400).send("Missing parameters");
  }
  if (modyfiedAd) {
    const updatedAd = { ...modyfiedAd, ...body };
    advertisement[index] = updatedAd;

    res.statusCode = 201;
    res.send("Modified");
  } else {
    res.send(`"Not find id: "${req.params.id}`);
  }
});

app.delete("/ads/:id", authenticateUser, (req, res) => {
  const adsExist = advertisement.find((ad) => ad.id == req.params.id);
  const userId = req.params.userId;

  if (!adsExist) {
    res.statusCode = 404;
    res.send("Not found");
  } else {
    if (+adsExist.userId === +userId) {
      advertisement = advertisement.filter((ad) => ad.id != req.params.id);
      res.statusCode = 201;
      res.send(`Deleted id: ${req.params.id}`);
    } else {
      res.status(403).send("Brak uprawnień do usunięcia tego ogłoszenia.");
    }
  }
});

app.listen(PORT, console.log("server started"));
