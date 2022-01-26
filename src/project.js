function newProject(name, todos = []) {
    let _todos = todos;

    function addTodo(todo) {
        _todos.push(todo);
    }

    function saveTodo(todo) {
        const found = _todos.find((x)=> {
            return x == todo;
        });
        if (!found) {
            this.addTodo(todo);
        }
    }

    function remove(todo) {
        const idx = _todos.findIndex((x) => {
            return x == todo;
        });
        if (idx >= 0) {
            _todos.splice(idx, 1);
        }
    }

    return {
        name,
        todos: _todos,
        addTodo,
        saveTodo,
        remove,
    }
}


export {newProject};
