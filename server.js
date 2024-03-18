import express from "express";
import { bugService } from "./services/bugs.service.js";
// import { bugService } from "./services/bugs.service.js";
// import { loggerService } from "./services/logger.service.js";
// import cookieParser from "cookie-parser";

const app = express();

// app.use(express.static("public"));
// app.use(cookieParser())

/*get bugs */
app.get("/api/bug", (req, res) => {
  bugService.query().then((bugs) => {
    res.send(bugs);
  });
});

//get bug
app.get("/api/bug/:id", (req, res) => {
  const bugId = req.params.id;
  bugService.getById(bugId).then((bug) => res.send(bug));
});

//save bug
app.get("/api/bug/save", (req, res) => {
  const bugToSave = {
    title: req.query.title,
    severity: +req.query.severity,
    description: req.query.description,
    _id: req.query._id,
    createdAt: req.query.createdAt,
  };
  bugService.save(bugToSave).then((bug) => res.send(bug));
});

//remove bug
app.get("/api/bug/:id/remove", (req, res) => {
  const bugId = req.params.id;
  bugService.remove(bugId).then((bugs) => res.send(bugs));
});

const port = 3000;
app.listen(port, () =>
  console.log(`Server listening on port http://127.0.0.1:${port}/`)
);
