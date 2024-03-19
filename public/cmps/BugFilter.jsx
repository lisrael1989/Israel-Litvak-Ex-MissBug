const { useState, useEffect } = React;

export function BugFilter({ filterBy, onSetFilter }) {
  const [filterByToEdit, setFilterByToEdit] = useState(filterBy);

  useEffect(() => {
    onSetFilter(filterByToEdit);
  }, [filterByToEdit]);

  function onSubmitFilter(ev) {
    ev.preventDefault();
    onSetFilter(filterByToEdit);
  }

  function handleChange({ target }) {
    let { value, name: field, type } = target;
    if (type === "number") value = +value;
    setFilterByToEdit((prevFilterBy) => ({ ...prevFilterBy, [field]: value }));
  }

  const { txt, severity } = filterByToEdit;
  return (
    <section className="bug-filter full main-layout">
      <h2>Filter Our Bugs</h2>

      <form onSubmit={onSubmitFilter}>
        <label htmlFor="title">Title:</label>
        <input
          value={txt}
          onChange={handleChange}
          name="txt"
          id="title"
          type="text"
          placeholder="By Text"
        />

        <label htmlFor="severity">Severity:</label>
        <input
          value={severity}
          onChange={handleChange}
          type="number"
          name="severity"
          id="severity"
          placeholder="By Severity"
        />

        <button>Filter Bugs</button>
      </form>
    </section>
  );
}
