import newProject from './project';

function get() {
  let projects = JSON.parse(window.localStorage.getItem('projects'));
  if (!projects) {
    projects = [
      { name: 'default' },
    ];
  }

  projects = projects.map((x) => newProject(x.name, x.todos));

  return projects;
}

function save(projects) {
  window.localStorage.setItem('projects', JSON.stringify(projects));
}

export { get, save };
