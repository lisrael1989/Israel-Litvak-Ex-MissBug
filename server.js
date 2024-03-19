import express from "express";
import cookieParser from "cookie-parser";

import { bugService } from "./services/bugs.service.js";
import { loggerService } from "./services/logger.service.js";

const app = express();

// App Configuration
app.use(express.static("public"));
app.use(cookieParser());
app.use(express.json());

/*get bugs */
app.get("/api/bug", (req, res) => {
  console.log("req.query:", req.query);
  const filterBy = {
    title: req.query.title || "",
    description: req.query.description || "",
    severity: +req.query.severity || 0,
    pageIdx: req.query.pageIdx,
  };
  bugService
    .query()
    .then((bugs) => {
      res.send(bugs);
    })
    .catch((err) => {
      loggerService.error("Cannot save bug", err);
      res.status(400).send("Cannot get bug");
    });
});

//create bug
app.post("/api/bug", (req, res) => {
  console.log("req.body:", req.body);
  const bugToSave = req.body;
  bugService
    .save(bugToSave)
    .then((bug) => res.send(bug))
    .catch((err) => {
      loggerService.error("Cannot save bug", err);
      res.status(400).send("Cannot save bug");
    });
});

//Update bug
app.put("/api/bug", (req, res) => {
  console.log("req.query", req.body);

  const bugToSave = {
    _id: req.body._id,
    title: req.body.title,
    description: req.body.description,
    severity: +req.body.severity,
  };

  bugService
    .save(bugToSave)
    .then((bug) => {
      res.send(bug);
    })
    .catch((err) => {
      loggerService.error("Cannot save bug", err);
      res.status(400).send("Cannot save bug");
    });
});

//get bug (Read)
app.get("/api/bug/:id", (req, res) => {
  const bugId = req.params.id;
  bugService
    .getById(bugId)
    .then((bug) => res.send(bug))
    .catch((err) => {
      loggerService.error(err);
      res.status(400).send("Cannot get bug");
    });
});

//remove bug
app.delete("/api/bug/:id", (req, res) => {
  const bugId = req.params.id;
  bugService
    .remove(bugId)
    .then(() => res.send(bugs))
    .catch((err) => {
      loggerService.error("Cannot save bug", err);
      res.status(400).send("Cannot get bug");
    });
});

const port = 3000;
app.listen(port, () =>
  console.log(`Server listening on port http://127.0.0.1:${port}/`)
);
