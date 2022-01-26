function newProject(name, _todos = []) {
  const todos = _todos;

  function addTodo(todo) {
    todos.push(todo);
  }

  function saveTodo(todo) {
    const found = todos.find((x) => x === todo);
    if (!found) {
      this.addTodo(todo);
    }
  }

  function remove(todo) {
    const idx = todos.findIndex((x) => x === todo);
    if (idx >= 0) {
      todos.splice(idx, 1);
    }
  }

  return {
    name,
    todos,
    addTodo,
    saveTodo,
    remove,
  };
}

export default newProject;
