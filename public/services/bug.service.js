import { utilService } from "./util.service.js";
const BASE_URL = "/api/bug/";

export const bugService = {
  query,
  get,
  save,
  remove,
  getEmptyBug,
  getDefaultFilter,
  getFilterFromParams,
};

function query(filterBy = getDefaultFilter()) {
  return axios.get(BASE_URL, { params: filterBy }).then((res) => res.data);
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
  return axios.delete(BASE_URL + bugId).then((res) => res.data);
}

function save(bug) {
  if (bug._id) {
    return axios.put(BASE_URL, bug);
  } else {
    return axios.post(BASE_URL, bug);
  }
}

function getEmptyBug() {
  return { title: "", description: "", severity: "4" };
}

function getDefaultFilter() {
  return { txt: "", severity: "", description: "" };
}

function getFilterFromParams(searchParams = {}) {
  const defaultFilter = getDefaultFilter();
  return {
    txt: searchParams.get("txt") || defaultFilter.txt,
    severity: searchParams.get("severity") || defaultFilter.severity,
    description: searchParams.get("description") || defaultFilter.description,
  };
}
