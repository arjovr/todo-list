function newTodo({ title, dueDate, priority } = {}) {
  return {
    title,
    dueDate,
    priority,
  };
}

export default newTodo;
