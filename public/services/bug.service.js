const BASE_URL = "/api/bug/";

export const bugService = {
  query,
  get,
  save,
  remove,
  getEmptyBug,
  getDefaultFilter,
};

function query(filterBy = {}) {
  return axios
    .get(BASE_URL)
    .then((res) => res.data)
    .then((bugs) => {
      if (filterBy.txt) {
        const regExp = new RegExp(filterBy.txt, "i");
        bugs = bugs.filter(
          (bug) => regExp.test(bug.title) || regExp.test(bug.description)
        );
      }

      if (filterBy.severity) {
        bugs = bugs.filter((bug) => bug.severity >= filterBy.severity);
      }
      return bugs;
    });
}

function get(bugId) {
  return axios
    .get(BASE_URL + bugId)
    .then((res) => res.data)
    .catch((err) => {
      console.log("err:", err);
    });
}
function remove(bugId) {
  return axios.get(BASE_URL + bugId + "/remove").then((res) => res.data);
}

function save(bug) {
  // const url = BASE_URL + "save";

  // const { title, description, severity } = bug;
  // const queryParams = { title, description, severity };

  if (bug._id) return axios.put(BASE_URL, bug);
  else axios.post(BASE_URL, bug);
}

function getEmptyBug() {
  return { title: "", description: "", severity: 5 };
}

function getDefaultFilter() {
  return { txt: "", severity: "" };
}
