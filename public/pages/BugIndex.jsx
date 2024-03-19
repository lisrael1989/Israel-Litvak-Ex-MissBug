const { useEffect, useState } = React;
const { Link } = ReactRouterDOM;

import { BugFilter } from "../cmps/BugFilter.jsx";
import { BugList } from "../cmps/BugList.jsx";
import { bugService } from "../services/bug.service.js";
import { showSuccessMsg, showErrorMsg } from "../services/event-bus.service.js";

export function BugIndex() {
  const [bugs, setBugs] = useState([]);
  const [filterBy, setFilterBy] = useState(bugService.getDefaultFilter());

  useEffect(() => {
    loadBugs();
    showSuccessMsg("Welcome to bug index!");
  }, [filterBy]);

  function loadBugs() {
    bugService.query(filterBy).then((bugs) => setBugs(bugs));
    // bugService.query().then(setBugs)
  }

  function onRemoveBug(bugId) {
    bugService.remove(bugId).then(() => {
      const updatedBugs = bugs.filter((bug) => bug._id !== bugId);
      setBugs(updatedBugs);
      showSuccessMsg(`Bug (${bugId}) removed!`);
    });
  }

  function onSetFilter(filterBy) {
    setFilterBy((prevFilterBy) => ({ ...prevFilterBy, ...filterBy }));
  }

  // console.log('render');
  return (
    <section className="bug-index full main-layout">
      <BugFilter onSetFilter={onSetFilter} filterBy={filterBy} />
      <Link to="/bug/edit">Add Bug</Link>
      <BugList bugs={bugs} onRemoveBug={onRemoveBug} />
    </section>
  );
}
