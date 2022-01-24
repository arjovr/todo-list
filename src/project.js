function newProject(name, todos = []) {
    let _todos = todos;
    return {
        name,
        todos: _todos,
    }
}

export {newProject};
