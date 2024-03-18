import express from "express";
import { bugService } from "./services/bugs.service.js";
// import { bugService } from "./services/bugs.service.js";
// import { loggerService } from "./services/logger.service.js";
// import cookieParser from "cookie-parser";

const app = express();

// app.use(express.static("public"));
// app.use(cookieParser())

app.get("/api/bug", (req, res) => {
  bugService.query().then((bugs) => {
    res.send(bugs);
  });
});

const port = 3000;
app.listen(port, () =>
  console.log(`Server listening on port http://127.0.0.1:${port}/`)
);
