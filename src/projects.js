import { newProject } from "./project";
import {newTodo} from './todo';

function initProjects(eventManager) {
    const projects = [
        newProject('default', [newTodo({title: 'mmm', dueDate:'2021-01-01'})]),
    ];

    eventManager.on('new-todo', (project, todo) => {
        project.addTodo(todo);
        eventManager.emit('new-todo-added', todo);
    });

    eventManager.on('remove-project-ask', (name)=> {
        const idx = projects.findIndex((x) => {
            return x.name == name;
        });
        projects.splice(idx, 1);
        if (idx >= 0) {
            eventManager.emit('remove-project', name);
        }
    });
    
    function push(project) {
        if (project.name == '') {
            eventManager.emit('invalid-project', `The project name can't be empty`);
            return;
        }
        const found = projects.find(x => {
            return x.name == project.name;
        });
        if (found) {
            eventManager.emit('invalid-project', `There is a project with this name "${project.name}"`);
            return;
        }
        projects.push(project);
        eventManager.emit('new-project-added', project);
    }

    function get() {
        return projects;
    }

    return {
        push,
        get
    }
    
}

export default initProjects;