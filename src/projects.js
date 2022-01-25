import { newProject } from "./project";
import {newTodo} from './todo';

function initProjects(eventManager) {
    let projects = JSON.parse(window.localStorage.getItem('projects'));
    if (!projects) {
        projects = [
            newProject('default', [newTodo({title: 'mmm', dueDate:'2021-01-01'})]),
        ];
    }

    eventManager.on('new-todo', (project, todo) => {
        project.addTodo(todo);
        save2localStorage();
        eventManager.emit('new-todo-added', todo);
    });

    eventManager.on('remove-project-ask', (project)=> {
        const idx = projects.findIndex((x) => {
            return x == project;
        });
        projects.splice(idx, 1);
        if (idx >= 0) {
            save2localStorage();
            eventManager.emit('remove-project', project);
        }
    });

    function save(project) {
        if (project.name == '') {
            eventManager.emit('invalid-project', `The project name can't be empty`);
            return;
        }
        const found = projects.find(x => {
            return x == project;
        });

        const foundByName = projects.find(x => {
            return project != x && x.name == project.name ;
        });
        if (foundByName) {
            eventManager.emit('invalid-project', `There is a project with this name "${project.name}"`);
            return;
        }

        if (!found) {
            projects.push(project);
            save2localStorage();
            eventManager.emit('new-project-added', project);
            return;
        }
        save2localStorage();
        eventManager.emit('new-project-edited', project);

    }
    
    function get() {
        return projects;
    }

    function save2localStorage() {
        window.localStorage.setItem('projects', JSON.stringify(projects));
    }

    return {
        get,
        save
    }
    
}

export default initProjects;