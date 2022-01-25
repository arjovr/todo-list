import '@fortawesome/fontawesome-free/js/all.js';
import {newProject} from './project';

function init(eventManager, projects) {
    const addBtn = document.querySelector('.add-project-button');
    
    addBtn.addEventListener('click', ()=> {
        form(sideMenu, newProject());
        addBtn.style.display = 'none';    
    });

    const sideMenu = document.querySelector('.side-menu');

    for (const project of projects.get()) {
        add(project);
    }

    function add(project, oldElem) {
        const p = document.createElement('div');
        p.classList.add('project');
        p.dataset.projectName = project.name;
        p.textContent = project.name;
        p.innerHTML = `
            <span class="project-name">${project.name}</span>
        `;
        if (project.name != 'default') {
            p.innerHTML +=  `<button class="edit-project-btn"><i class="fas fa-edit"></i></button>`;
            p.innerHTML +=  `<button class="remove-project-btn"><i class="fas fa-trash"></i></button>`;
        }
        if (oldElem) {
            oldElem.parentNode.replaceChild(p, oldElem);
        } else {
            sideMenu.append(p);
        }
        const removeBtn = p.querySelector('.remove-project-btn')
        if (removeBtn) {
            removeBtn.addEventListener('click', ()=> {
                eventManager.on('remove-project', (name)=> {
                    if (project.name == name) {
                        p.remove();
                    }
                });
                eventManager.emit('remove-project-ask', project.name);
            });
        }
        const editBtn = p.querySelector('.edit-project-btn');
        if (editBtn) {
            editBtn.addEventListener('click', () => {
                p.innerHTML = '';
                form(p, project);
            });
        }
        p.addEventListener('click', ()=> {
            // elegimos un projecto, tengo que mostrar sus todos
            eventManager.emit('project-selected', project);
        });
    }
    
    function form(container, project) {
        const projectElem = document.createElement('div');
        projectElem.innerHTML = `
            <div class="new-project-form">
                <input type="text" class="name-project-input" value="${project.name}">
                <button class="save-project-btn"><i class="fas fa-check"></i></button>
                <button class="cancel-project-btn"><i class="fas fa-times"></i></button>
            </div>
        `;
        container.append(projectElem);
        const btn = projectElem.querySelector('.save-project-btn');
        const cancelBtn = projectElem.querySelector('.cancel-project-btn');
        const input = projectElem.querySelector('.name-project-input');
        const removeForm = () => {
            projectElem.remove();
            addBtn.style.display = 'block';
            eventManager.off('invalid-project', invalidHandler);
            eventManager.off('new-project-added', validHandler);
            eventManager.off('new-project-edited', editedHandler);
        }
        const invalidHandler = (msg)=> {
            alert(msg);
        };
        eventManager.on('invalid-project', invalidHandler);
        const validHandler = (p) => {
            removeForm();
            add(p);
        };
        const editedHandler = (p) => {
            console.log('aaaaaaaaaaaaaaa', p)
            removeForm();
            add(p, projectElem);
        }
        eventManager.on('new-project-added', validHandler);
        eventManager.on('new-project-edited', editedHandler);
        btn.addEventListener('click', () => {
            eventManager.emit('edit-project', project);
        });
        cancelBtn.addEventListener('click', removeForm);
    }
    
    return {}
}


export {init};
