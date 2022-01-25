import EventEmitter from "events";
import { newProject } from "./project";
import * as projectView from './project-view';
import initProjects from './projects';
import * as todoView from './todo-view';


function init() {
    const eventManager = new EventEmitter();
    const projects = initProjects(eventManager);
    
    projectView.init(eventManager, projects);
    todoView.init(eventManager);

    // me quedo con el primero (default)
    eventManager.emit('project-selected', projects.get()[0]);

    eventManager.on('edit-project', (project)=> {
        projects.save(project);
    });

}

export {init};
