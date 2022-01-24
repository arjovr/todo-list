import { newProject } from "./project";

function initProjects(eventManager) {
    const projects = [
        newProject('default'),
    ];
    
    function push(project) {
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