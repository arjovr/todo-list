import EventEmitter from 'events';
import * as projectView from './project-view';
import initProjects from './projects';
import * as todoView from './todo-view';
import * as database from './database';

function init() {
  const eventManager = new EventEmitter();
  const projects = initProjects(database.get(), eventManager);

  projectView.init(eventManager, projects);
  todoView.init(eventManager);

  // me quedo con el primero (default)
  eventManager.emit('project-selected', projects.get()[0]);

  eventManager.on('edit-project', (project) => {
    projects.save(project);
  });

  eventManager.on('edit-todo', (project, todo) => {
    project.saveTodo(todo);
    database.save(projects.get());
  });

  eventManager.on('remove-todo-ask', (project, todo) => {
    project.remove(todo);
    database.save(projects.get());
    eventManager.emit('remove-todo', todo);
  });
}

export default init;
