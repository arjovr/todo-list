function newTodo({title, description, dueDate, priority} = {}) {
    return {
        title,
        description,
        dueDate,
        priority
    }
}

export {newTodo};
