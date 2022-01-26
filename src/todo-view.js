import newTodo from './todo';

function init(eventManager) {
  let currentProject = null;

  const body = document.querySelector('.body');
  const addBtn = document.querySelector('.add-todo-button');

  function draw(container, todo) {
    const t = document.createElement('div');
    t.classList.add('todo');
    t.textContent = todo.title;
    t.innerHTML = `
            <span class="todo-title">${todo.title}</span>
            <span class="todo-dueDate">${todo.dueDate ? todo.dueDate : ''}</span>
            <button class="edit-todo-btn"><i class="fas fa-edit"></i></button>
            <button class="remove-todo-btn"><i class="fas fa-trash"></i></button>
        `;
    container.append(t);
    const removeBtn = t.querySelector('.remove-todo-btn');
    if (removeBtn) {
      removeBtn.addEventListener('click', () => {
        eventManager.on('remove-todo', (tdo) => {
          if (todo === tdo) {
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
        // eslint-disable-next-line no-use-before-define
        drawForm(container, todo);
      });
    }
  }

  // muestra el formulario para completar el todo
  function drawForm(_container, _todo) {
    const container = _container;
    let todo = _todo;
    container.innerHTML = '';

    const clonedTodo = { ...todo };

    const t = document.createElement('div');
    t.innerHTML = `
            <div class="new-todo-form">
                <input type="text" class="title-todo-input" value="${todo.title}">
                <input type="date" class="duedate-todo-input" value="${todo.dueDate}">
                <input type="number" class="priority-todo-input" value="${todo.priority}">
                <button class="save-todo-btn"><i class="fas fa-check"></i></button>
                <button class="cancel-todo-btn"><i class="fas fa-times"></i></button>
            </div>
        `;
    container.append(t);

    const btn = t.querySelector('.save-todo-btn');
    const cancelBtn = t.querySelector('.cancel-todo-btn');
    const input = t.querySelector('.title-todo-input');
    const dueDate = t.querySelector('.duedate-todo-input');
    const priority = t.querySelector('.priority-todo-input');

    input.addEventListener('input', () => {
      todo.title = input.value;
    });
    dueDate.addEventListener('input', () => {
      todo.dueDate = dueDate.value;
    });
    priority.addEventListener('input', () => {
      todo.priority = priority.value;
    });

    const invalidHandler = (msg) => {
      alert(msg);
    };

    const validHandler = () => {
      // eslint-disable-next-line no-use-before-define
      removeForm();
      draw(container, todo);
    };

    const removeForm = () => {
      container.innerHTML = '';
      addBtn.style.display = 'block';
      eventManager.off('invalid-todo', invalidHandler);
      eventManager.off('new-todo-added', validHandler);
      eventManager.off('new-todo-edited', validHandler);
    };

    eventManager.on('invalid-todo', invalidHandler);
    const cancelHandler = () => {
      todo = Object.assign(todo, clonedTodo);
      removeForm();
      if (clonedTodo.title !== '') {
        draw(container, todo);
      }
    };

    eventManager.on('new-todo-added', validHandler);
    eventManager.on('new-todo-edited', validHandler);
    btn.addEventListener('click', () => {
      eventManager.emit('edit-todo', currentProject, todo);
      removeForm();
      draw(container, todo);
    });
    cancelBtn.addEventListener('click', cancelHandler);
  }

  addBtn.addEventListener('click', () => {
    const container = document.createElement('div');
    drawForm(container, newTodo({ title: '' }));
    addBtn.style.display = 'none';
    body.append(container);
  });

  eventManager.on('project-selected', (project) => {
    currentProject = project;

    const todos = body.querySelectorAll(':not(.add-todo-button)');
    todos.forEach((todo) => {
      todo.remove();
    });

    // eslint-disable-next-line no-restricted-syntax
    for (const todo of project.todos) {
      const container = document.createElement('div');
      draw(container, todo);
      body.append(container);
    }
  });
}

export default init;
