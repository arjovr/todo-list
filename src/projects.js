import * as database from './database';

function initProjects(projects, eventManager) {
  eventManager.on('new-todo', (project, todo) => {
    project.addTodo(todo);
    database.save();
    eventManager.emit('new-todo-added', todo);
  });

  eventManager.on('remove-project-ask', (project) => {
    const idx = projects.findIndex((x) => x === project);
    projects.splice(idx, 1);
    if (idx >= 0) {
      database.save(projects);
      eventManager.emit('remove-project', project);
    }
  });

  function save(project) {
    if (project.name === '') {
      eventManager.emit('invalid-project', 'The project name can\'t be empty');
      return;
    }
    const found = projects.find((x) => x === project);

    const foundByName = projects.find((x) => project !== x && x.name === project.name);
    if (foundByName) {
      eventManager.emit('invalid-project', `There is a project with this name "${project.name}"`);
      return;
    }

    if (!found) {
      projects.push(project);
      database.save(projects);
      eventManager.emit('new-project-added', project);
      return;
    }
    database.save(projects);
    eventManager.emit('new-project-edited', project);
  }

  function get() {
    return projects;
  }

  return {
    get,
    save,
  };
}

export default initProjects;
