import {newTodo} from './todo';

function init(eventManager) {
    let currentProject = null;

    const body = document.querySelector('.body');

    const addBtn = document.querySelector('.add-todo-button');
    
    addBtn.addEventListener('click', ()=> {
        form();
        addBtn.style.display = 'none';    
    });

    // muestra el formulario para completar el todo
    function form() {
        const todo = document.createElement('div');
        todo.innerHTML = `
            <div class="new-todo-form">
                <input type="text" class="title-todo-input">
                <input type="date" class="duedate-todo-input">
                <button class="save-todo-btn"><i class="fas fa-check"></i></button>
                <button class="cancel-todo-btn"><i class="fas fa-times"></i></button>
            </div>
        `;
        body.append(todo);

        const btn = todo.querySelector('.save-todo-btn');
        const cancelBtn = todo.querySelector('.cancel-todo-btn');
        const input = todo.querySelector('.title-todo-input');
        const dueDate = todo.querySelector('.duedate-todo-input');
        const removeForm = () => {
            todo.remove();
            addBtn.style.display = 'block';
            eventManager.off('invalid-todo', invalidHandler);
            eventManager.off('new-todo-added', validHandler);

        }
        const invalidHandler = (msg)=> {
            alert(msg);
        };
        eventManager.on('invalid-todo', invalidHandler);
        const validHandler = (todo) => {
            removeForm();
            add(todo);
        };
        eventManager.on('new-todo-added', validHandler);
        btn.addEventListener('click', () => {
            eventManager.emit('new-todo', currentProject, newTodo({
                title: input.value,
                dueDate: dueDate.value
            }));
        });
        cancelBtn.addEventListener('click', removeForm);
    }

    function add(todo) {
        const t = document.createElement('div');
        t.classList.add('todo');
        t.textContent = todo.title;
        t.innerHTML = `
            <span class="todo-title">${todo.title}</span>
        `;
        body.append(t);
    }

    eventManager.on('project-selected', (project) => {
        currentProject = project;

        const todos = body.querySelectorAll(':not(.add-todo-button)');
        todos.forEach((todo) => {
            todo.remove();
        });
        for (const todo of project.todos) {
            add(todo);
        }

    });

}

export {init};
