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
        p.textContent = project.name;
        sideMenu.append(p);
    }
    
    function form() {
        const project = document.createElement('div');
        project.innerHTML = `
            <div class="new-project-form">
                <input type="text" class="name-project-input">
                <button class="save-project-btn"><i class="fas fa-check"></i></button>
            </div>
        `;
        sideMenu.append(project);
        const btn = project.querySelector('.save-project-btn');
        const input = project.querySelector('.name-project-input');
        const invalidHandler = (msg)=> {
            alert(msg);
        };
        eventManager.on('invalid-project', invalidHandler);
        const validHandler = (p) => {
            project.remove();
            addBtn.style.display = 'block';
            eventManager.off('invalid-project', invalidHandler);
            eventManager.off('new-project-added', validHandler);
            add(p);
        };
        eventManager.on('new-project-added', validHandler);
        btn.addEventListener('click', () => {
            eventManager.emit('new-project', input.value);
        });
    }
    
    return {}
}


export {init};
