import fs from "fs";
import { loggerService } from "./logger.service.js";
import { utilService } from "./utils.service.js";

const PAGE_SIZE = 3;

export const bugService = {
  query,
  getById,
  remove,
  save,
};

const bugs = utilService.readJsonFile("data/bug.json");

function query(filterBy) {
  let bugsToReturn = bugs;
  if (filterBy.title) {
    const regex = new RegExp(filterBy.title, "i");
    bugsToReturn = bugsToReturn.filter((bug) => regex.test(bug.title));
  }
  if (filterBy.severity) {
    bugsToReturn = bugsToReturn.filter(
      (bug) => bug.severity >= filterBy.severity
    );
  }
  if (filterBy.description) {
    const regex = new RegExp(filterBy.description, "i");
    bugsToReturn = bugsToReturn.filter((bug) => regex.test(bug.description));
  }
  if (filterBy.pageIdx !== undefined) {
    const pageIdx = +filterBy.pageIdx;
    const startIdx = pageIdx * PAGE_SIZE;
    bugsToReturn = bugsToReturn.slice(startIdx, startIdx + PAGE_SIZE);
  }
  return Promise.resolve(bugsToReturn);
  // return Promise.resolve(bugs);
}

function getById(id) {
  const bug = bugs.find((bug) => bug._id === id);
  if (!bug) return Promise.reject("bug does not exist!");
  return Promise.resolve(bug);
}

function remove(id) {
  const bugIdx = bugs.findIndex((bug) => bug._id === id);
  bugs.splice(bugIdx, 1);
  return _saveBugsToFile();
}

function save(bug) {
  console.log("SAVE", bug);
  if (bug._id) {
    const bugIdx = bugs.findIndex((currBug) => currBug._id === bug._id);
    bugs[bugIdx] = bug;
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
