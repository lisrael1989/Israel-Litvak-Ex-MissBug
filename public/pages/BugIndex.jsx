const { useEffect, useState, useRef } = React;
const { Link, useSearchParams } = ReactRouterDOM;

import { BugFilter } from "../cmps/BugFilter.jsx";
import { BugList } from "../cmps/BugList.jsx";

import { bugService } from "../services/bug.service.js";
import { showSuccessMsg, showErrorMsg } from "../services/event-bus.service.js";
import { utilService } from "../services/util.service.js";

export function BugIndex() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [bugs, setBugs] = useState([]);
  const [filterBy, setFilterBy] = useState(
    bugService.getFilterFromParams(searchParams)
  );
  const debounceOnSetFilter = useRef(utilService.debounce(onSetFilter, 300));

  useEffect(() => {
    setSearchParams(filterBy);
    loadBugs();
    showSuccessMsg("Welcome to bug index!");
  }, [filterBy]);

  function onSetFilter(fieldsToUpdate) {
    setFilterBy((prevFilter) => {
      const newFilter = { ...prevFilter, ...fieldsToUpdate };

      if (prevFilter.pageIdx !== undefined) prevFilter.pageIdx = 0;
      return { ...prevFilter, ...fieldsToUpdate };
    });
  }

  function loadBugs() {
    bugService.query(filterBy).then((bugs) => setBugs(bugs));
  }

  function onChangePage(diff) {
    if (filterBy.pageIdx === undefined) return;
    let nextPageIdx = filterBy.pageIdx + diff;
    if (nextPageIdx < 0) nextPageIdx = 0;
    setFilterBy((prevFilter) => ({ ...prevFilter, pageIdx: nextPageIdx }));
  }

  function onTogglePagination() {
    setFilterBy((prevFilter) => ({
      ...prevFilter,
      pageIdx: filterBy.pageIdx === undefined ? 0 : undefined,
    }));
  }

  function onRemoveBug(bugId) {
    bugService
      .remove(bugId)
      .then(() => {
        setBugs((prevBugs) => prevBugs.filter((bug) => bug._id !== bugId));
        showSuccessMsg(`bug removed successfully (${bugId})`);
      })
      .catch((err) => {
        console.log("Had issues removing bug", err);
        showErrorMsg(`Could not remove (${bugId})`);
      });
  }

  function onUpdateBug(bugToUpdate) {
    bugService
      .save(bugToUpdate)
      .then((savedBug) => {
        setBugs((prevBugs) =>
          prevBugs.map((bug) => (bug._id === savedBug._id ? savedBug : bug))
        );
        showSuccessMsg(`bug updated successfully (${bugToUpdate.id})`);
      })
      .catch((err) => {
        console.log("Had issues with updating bug", err);
        showErrorMsg(`Could not update bug (${bugToUpdate.id})`);
      });
  }

  const { txt, severity, description } = filterBy;
  if (!bugs) return <div>loading...</div>;
  return (
    <section className="bug-index full main-layout">
      <section className="pagination">
        <button onClick={() => onChangePage(-1)}>-</button>
        <span>{filterBy.pageIdx + 1 || "No pagination"}</span>
        <button onClick={() => onChangePage(1)}>+</button>
        <button onClick={onTogglePagination}>Toggle Pagination</button>
      </section>
      <BugFilter
        onSetFilter={debounceOnSetFilter.current}
        filterBy={{ title: txt, severity: severity }}
      />
      <Link to="/bug/edit">Add Bug</Link>
      <BugList
        bugs={bugs}
        onRemoveBug={onRemoveBug}
        onUpdateBug={onUpdateBug}
      />
    </section>
  );
}
