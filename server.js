import express from "express";
import cookieParser from "cookie-parser";

import { bugService } from "./services/bugs.service.js";
import { loggerService } from "./services/logger.service.js";

const app = express();

// App Configuration
app.use(express.static("public"));
app.use(cookieParser());

/*get bugs */
app.get("/api/bug", (req, res) => {
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

//get bug
app.get("/api/bug/:id", (req, res) => {
  loggerService.debug("req.query", req.query);

  const bugId = req.params.id;
  bugService
    .getById(bugId)
    .then((bug) => res.send(bug))
    .catch((err) => {
      loggerService.error("Cannot save bug", err);
      res.status(400).send("Cannot save bug");
    });
});

//save bug
app.get("/api/bug/save", (req, res) => {
  loggerService.debug("req.query", req.query);

  const { title, description, severity, _id } = req.query;
  console.log("req.query", req.query);
  const bug = {
    _id,
    title,
    description,
    severity: +severity,
  };

  bugService
    .save(bug)
    .then((savedBug) => {
      res.send(savedBug);
    })
    .catch((err) => {
      loggerService.error("Cannot save bug", err);
      res.status(400).send("Cannot save bug");
    });
});

//read
app.get("/api/bug/:bugId", (req, res) => {
  // console.log('inside') // details and edit will go here
  const { bugId } = req.params;
  const { visitedBugs = [] } = req.cookies; // use the default if undefined

  console.log("visitedBugs", visitedBugs);

  if (!visitedBugs.includes(bugId)) {
    if (visitedBugs.length >= 3) return res.status(401).send("Wait for a bit");
    else visitedBugs.push(bugId);
  }

  res.cookie("visitedBugs", visitedBugs, { maxAge: 1000 * 70 });

  bugService
    .getById(bugId)
    .then((bug) => res.send(bug))
    .catch((err) => {
      loggerService.error("Cannot get bug", err);
      res.status(400).send("Cannot get bug");
      // res.status(403).send(err)
    });
});

//remove bug
app.get("/api/bug/:id/remove", (req, res) => {
  const bugId = req.params.id;
  bugService
    .remove(bugId)
    .then((bugs) => res.send(bugs))
    .catch((err) => {
      loggerService.error("Cannot save bug", err);
      res.status(400).send("Cannot get bug");
    });
});

const port = 3000;
app.listen(port, () =>
  console.log(`Server listening on port http://127.0.0.1:${port}/`)
);
