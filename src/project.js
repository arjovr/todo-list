function newProject(name, todos = []) {
    let _todos = todos;

    function addTodo(todo) {
        _todos.push(todo);
    }

    return {
        name,
        todos: _todos,
        addTodo,
    }
}


export {newProject};
