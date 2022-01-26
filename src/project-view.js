import '@fortawesome/fontawesome-free/js/all.js';
import {newProject} from './project';

function init(eventManager, projects) {
    const addBtn = document.querySelector('.add-project-button');
    
    addBtn.addEventListener('click', ()=> {
        const container = document.createElement('div');
        drawForm(container, newProject(''));
        addBtn.style.display = 'none';    
        sideMenu.append(container);
    });

    const sideMenu = document.querySelector('.side-menu');

    for (const project of projects.get()) {
        const container = document.createElement('div');
        draw(container, project);
        sideMenu.append(container);
    }

    // draw the project item in the given container.
    function draw(container, project) {
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
        container.append(p);
        const removeBtn = p.querySelector('.remove-project-btn')
        if (removeBtn) {
            removeBtn.addEventListener('click', ()=> {
                eventManager.on('remove-project', (prj)=> {
                    if (project == prj) {
                        p.remove();
                    }
                });
                eventManager.emit('remove-project-ask', project);
            });
        }
        const editBtn = p.querySelector('.edit-project-btn');
        if (editBtn) {
            editBtn.addEventListener('click', () => {
                p.innerHTML = '';
                drawForm(container, project);
            });
        }
        p.addEventListener('click', ()=> {
            // elegimos un projecto, tengo que mostrar sus todos
            eventManager.emit('project-selected', project);
        });
    }
    
    // draws the form in the given container.
    function drawForm(container, project) {
        container.innerHTML = '';

        const clonedProject = Object.assign({}, project);
        
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
        input.addEventListener('change', (e) => {
            project.name = input.value;
        })
        const removeForm = () => {
            container.innerHTML = '';
            addBtn.style.display = 'block';
            eventManager.off('invalid-project', invalidHandler);
            eventManager.off('new-project-added', validHandler);
            eventManager.off('new-project-edited', validHandler);
        }
        const invalidHandler = (msg)=> {
            alert(msg);
        };
        eventManager.on('invalid-project', invalidHandler);
        const validHandler = (p) => {
            removeForm();
            draw(container, p);
        };
        const cancelHandler = () => {
            project = Object(project, clonedProject);
            removeForm();
            if (clonedProject.name !== '') {
                draw(container, project);
            }
        }
        eventManager.on('new-project-added', validHandler);
        eventManager.on('new-project-edited', validHandler);
        btn.addEventListener('click', () => {
            eventManager.emit('edit-project', project);
        });
        cancelBtn.addEventListener('click', cancelHandler);
    }
    
    return {}
}


export {init};
