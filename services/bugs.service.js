import fs from "fs";
import { loggerService } from "./logger.service.js";
import { utilService } from "./utils.service.js";

export const bugService = {
  query,
  getById,
  remove,
  save,
};

const bugs = utilService.readJsonFile("data/bug.json");

function query() {
  return Promise.resolve(bugs);
}

function getById(bugId) {
  const bug = bugs.find((bug) => bug._id === bugId);
  if (!bug) return Promise.reject("bug does not exist!");
  return Promise.resolve(bug);
}

function remove(bugId) {
  const bugIdx = bugs.findIndex((bug) => bug._id === bugId);
  bugs.splice(bugIdx, 1);
  return _saveBugsToFile();
}

function save(bug) {
  if (bug._id) {
    const bugIdx = bugs.findIndex((currBug) => currBug._id === bug._id);
    bugs[bugIdx] = { ...bugs[bugIdx], ...bug };
  } else {
    bug._id = utilService.makeId();
    bug.createdAt = Date.now();
    // bug.description = utilService.makeLorem();
    bugs.unshift(bug);
  }
  return _saveBugsToFile().then(() => bug);
}

function _saveBugsToFile() {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(bugs, null, 4);
    fs.writeFile("data/bug.json", data, (err) => {
      if (err) {
        loggerService.error("Cannot write to bugs file", err);
        return reject(err);
      }
      resolve();
    });
  });
}
