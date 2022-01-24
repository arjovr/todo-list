import '@fortawesome/fontawesome-free/js/all.js';

function init(eventManager, projects) {
    const addBtn = document.querySelector('.add-project-button');
    
    addBtn.addEventListener('click', ()=> {
        form(eventManager);
        addBtn.style.display = 'none';    
    });

    const sideMenu = document.querySelector('.side-menu');

    for (const project of projects.get()) {
        add(project);
    }

    function add(project) {
        const p = document.createElement('div');
        p.classList.add('project');
        p.dataset.projectName = project.name;
        p.textContent = project.name;
        p.innerHTML = `
            <span class="project-name">${project.name}</span>
        `;
        if (project.name != 'default') {
            p.innerHTML +=  `<button class="remove-project-btn"><i class="fas fa-trash"></i></button>`;
        }
        sideMenu.append(p);
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
    }
    
    function form() {
        const project = document.createElement('div');
        project.innerHTML = `
            <div class="new-project-form">
                <input type="text" class="name-project-input">
                <button class="save-project-btn"><i class="fas fa-check"></i></button>
                <button class="cancel-project-btn"><i class="fas fa-times"></i></button>
            </div>
        `;
        sideMenu.append(project);
        const btn = project.querySelector('.save-project-btn');
        const cancelBtn = project.querySelector('.cancel-project-btn');
        const input = project.querySelector('.name-project-input');
        const removeForm = () => {
            project.remove();
            addBtn.style.display = 'block';
            eventManager.off('invalid-project', invalidHandler);
            eventManager.off('new-project-added', validHandler);

        }
        const invalidHandler = (msg)=> {
            alert(msg);
        };
        eventManager.on('invalid-project', invalidHandler);
        const validHandler = (p) => {
            removeForm();
            add(p);
        };
        eventManager.on('new-project-added', validHandler);
        btn.addEventListener('click', () => {
            eventManager.emit('new-project', input.value);
        });
        cancelBtn.addEventListener('click', removeForm);
    }
    
    return {}
}


export {init};
