import EventEmitter from "events";
import { newProject } from "./project";
import * as projectView from './project-view';
import initProjects from './projects';

function init() {
    const eventManager = new EventEmitter();
    const projects = initProjects(eventManager);
    
    projectView.init(eventManager, projects);
    eventManager.on('new-project', (name)=> {
        projects.push(newProject(name));
    });
}

export {init};
