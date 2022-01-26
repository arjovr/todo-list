import {newTodo} from './todo';

function init(eventManager) {
    let currentProject = null;

    const body = document.querySelector('.body');

    const addBtn = document.querySelector('.add-todo-button');
    
    addBtn.addEventListener('click', ()=> {
        const container = document.createElement('div');
        drawForm(container, newTodo({title: ''}));
        addBtn.style.display = 'none';    
        body.append(container);
    });

    // muestra el formulario para completar el todo
    function drawForm(container, todo) {
        container.innerHTML = '';

        const clonedTodo = Object.assign({}, todo);

        const t = document.createElement('div');
        t.innerHTML = `
            <div class="new-todo-form">
                <input type="text" class="title-todo-input" value="${todo.title}">
                <input type="date" class="duedate-todo-input" value="${todo.dueDate}">
                <button class="save-todo-btn"><i class="fas fa-check"></i></button>
                <button class="cancel-todo-btn"><i class="fas fa-times"></i></button>
            </div>
        `;
        container.append(t);

        const btn = t.querySelector('.save-todo-btn');
        const cancelBtn = t.querySelector('.cancel-todo-btn');
        const input = t.querySelector('.title-todo-input');
        const dueDate = t.querySelector('.duedate-todo-input');

        input.addEventListener('input', (e) => {
            todo.title = input.value;
        });
        dueDate.addEventListener('input', ()=> {
            todo.dueDate = dueDate.value;
        });

        const removeForm = () => {
            container.innerHTML = '';
            addBtn.style.display = 'block';
            eventManager.off('invalid-todo', invalidHandler);
            eventManager.off('new-todo-added', validHandler);
            eventManager.off('new-todo-edited', validHandler);

        }
        const invalidHandler = (msg)=> {
            alert(msg);
        };
        eventManager.on('invalid-todo', invalidHandler);
        const validHandler = () => {
            removeForm();
            draw(container, todo);
        };
        const cancelHandler = () => {
            todo = Object.assign(todo, clonedTodo);
            removeForm();
            if (clonedTodo.title != '') {
                draw(container, todo);
            }
        }
        eventManager.on('new-todo-added', validHandler);
        eventManager.on('new-todo-edited', validHandler);
        btn.addEventListener('click', () => {
            eventManager.emit('edit-todo', currentProject, todo);
            removeForm();
            draw(container, todo);
        });
        cancelBtn.addEventListener('click', cancelHandler);
    }

    function draw(container, todo) {
        const t = document.createElement('div');
        t.classList.add('todo');
        t.textContent = todo.title;
        t.innerHTML = `
            <span class="todo-title">${todo.title}</span>
            <button class="edit-todo-btn"><i class="fas fa-edit"></i></button>
            <button class="remove-todo-btn"><i class="fas fa-trash"></i></button>
        `;
        container.append(t);
        const removeBtn = t.querySelector('.remove-todo-btn')
        if (removeBtn) {
            removeBtn.addEventListener('click', ()=> {
                eventManager.on('remove-todo', (tdo)=> {
                    if (todo == tdo) {
                        t.remove();
                    }
                });
                eventManager.emit('remove-todo-ask', currentProject, todo);
            });
        }
        const editBtn = t.querySelector('.edit-todo-btn');
        if (editBtn) {
            editBtn.addEventListener('click', () => {
                t.innerHTML = '';
                drawForm(container, todo);
            });
        }
    }

    eventManager.on('project-selected', (project) => {
        currentProject = project;

        const todos = body.querySelectorAll(':not(.add-todo-button)');
        todos.forEach((todo) => {
            todo.remove();
        });
        for (const todo of project.todos) {
            const container = document.createElement('div');
            draw(container, todo);
            body.append(container);
        }

    });

}

export {init};
