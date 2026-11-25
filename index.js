import {getToken, removeToken} from './tokenHandler.js';
import * as projects from './projects.js';

const token = getToken();
if (!token) {
  window.location.replace('/login.html'); 
}

const logoutBtn = document.getElementById('logout-btn');
logoutBtn.addEventListener('click', () => {
  removeToken();
  window.location.replace('/login.html');
});

const crearBtn = document.getElementById('create-project');
crearBtn.addEventListener('submit', async (event) => {

    event.preventDefault();

    const projName = document.getElementById('name').value;
    const projDescription = document.getElementById('description').value;
    const projTechnologies = document.getElementById('technologies').value.split('\n');
    const projRepository = document.getElementById('repository').value;
    const projImage = document.getElementById('image').value;

    if (projName.trim() === "" || projDescription.trim() === "" || document.getElementById('technologies').value.trim() === "" || projRepository.trim() === "" || projImage.trim() === "") {
        alert("ningun valor puede estar vacio.");
        return;
    }

    try {

        await projects.createProject({"title":projName, "description":projDescription, "technologies":projTechnologies, "repository":projRepository, "images":[projImage]});

        refresh();

    } catch (error) {
        console.error('error:', error);
        alert('error:', error);
    } 
  
});

async function clickProyecto(projectId, tipo) {
    if (tipo == "mod") {
        await actualizarProyecto(projectId);
    } else if (tipo == "elim") {
        await projects.deleteProject(projectId);
        await refresh();
    }
}

async function actualizarProyecto(projectId) {
    
    const divOriginal = document.getElementById(projectId);
    if (!divOriginal) return;
    
    if (divOriginal.classList.contains("mod")) {
        const nameEl = divOriginal.querySelector('[name="name"]');
        const descEl = divOriginal.querySelector('[name="description"]');
        const techEl = divOriginal.querySelector('[name="technologies"]');
        const repoEl = divOriginal.querySelector('[name="repository"]');
        const imgEl = divOriginal.querySelector('[name="image"]');

        const projName = nameEl.value.trim();
        const projDescription = descEl.value.trim();
        const projTechnologies = techEl.value
            .split('\n')
            .map((t) => t.trim())
            .filter(Boolean);
        const projRepository = repoEl.value.trim();
        const projImage = imgEl.value.trim();

        if (
            projName === "" ||
            projDescription === "" ||
            projTechnologies.length === 0 ||
            projRepository === "" ||
            projImage === ""
        ) {
            return;
        }

        try {
            await projects.updateProject(projectId, {
                title: projName,
                description: projDescription,
                technologies: projTechnologies,
                repository: projRepository,
                images: [projImage],
            });

            await refresh();
        } catch (error) {
            console.error('error:', error);
            alert(`error: ${error?.message || error}`);
        }

        return;
    }
    
    const ogName = divOriginal.querySelector('h3');
    const ogDesc = divOriginal.querySelector('.description');
    const ogTecs = divOriginal.querySelectorAll('li');
    const ogRepo = divOriginal.querySelector('a');
    const ogImg = divOriginal.querySelector('img');

    const divCopia = document.createElement("div");
    divCopia.classList.add("project");
    divCopia.classList.add("mod");
    
    const formNuevo = document.createElement("form");
    
    const lblName = document.createElement("label");
    lblName.htmlFor = "name";
    lblName.textContent = "name:";
    formNuevo.appendChild(lblName);
    
    const inputName = document.createElement("input");
    inputName.name = "name";
    inputName.type = "text";
    inputName.minLength = 10;
    inputName.required = true;
    inputName.value = ogName.textContent;
    formNuevo.appendChild(inputName);
    
    const backImage = document.createElement("img");
    backImage.src = ogImg.src;
    backImage.alt = ogImg.alt;
    formNuevo.appendChild(backImage);

    const lblImage = document.createElement("label");
    lblImage.htmlFor = "image";
    lblImage.textContent = "image (url):";
    formNuevo.appendChild(lblImage);
    
    const inputImg = document.createElement("input");
    inputImg.name = "image";
    inputImg.type = "text";
    inputImg.minLength = 10;
    inputImg.required = true;
    inputImg.value = ogImg.src;
    formNuevo.appendChild(inputImg);

    const lblDesc = document.createElement("label");
    lblDesc.htmlFor = "description";
    lblDesc.textContent = "description:";
    formNuevo.appendChild(lblDesc);
    
    const inputDesc = document.createElement("input");
    inputDesc.name = "description";
    inputDesc.type = "text";
    inputDesc.minLength = 3;
    inputDesc.required = true;
    inputDesc.value = ogDesc.textContent;
    formNuevo.appendChild(inputDesc);
    
    let ogTec = ""
    
    ogTecs.forEach((li) => {
        ogTec += li.textContent;
        ogTec += "\n";
    });

    const lblTec = document.createElement("label");
    lblTec.htmlFor = "technologies";
    lblTec.textContent = "technologies:";
    formNuevo.appendChild(lblTec);
    
    const txtTec = document.createElement("textarea");
    txtTec.name = "technologies";
    txtTec.required = true;
    txtTec.textContent = ogTec;
    formNuevo.appendChild(txtTec);
    
    const lblRepo = document.createElement("label");
    lblRepo.htmlFor = "repository";
    lblRepo.textContent = "repository link:";
    formNuevo.appendChild(lblRepo);
    
    const inputRepo = document.createElement("input");
    inputRepo.name = "repository";
    inputRepo.type = "text";
    inputRepo.minLength = 3;
    inputRepo.required = true;
    inputRepo.value = ogRepo.href;
    formNuevo.appendChild(inputRepo);
    
    const divBotones = document.createElement("div");
    divBotones.classList.add("botones");

    const btnMod = document.createElement("button");
    btnMod.textContent = `update`;
    btnMod.classList.add("btn");
    btnMod.type = "button";
    divBotones.appendChild(btnMod);
    btnMod.addEventListener("click", ()=>{clickProyecto(projectId, "mod")})

    const btnEliminar = document.createElement("button");
    btnEliminar.textContent = `delete`;
    btnEliminar.classList.add("btn");
    btnEliminar.type = "button";
    divBotones.appendChild(btnEliminar);
    btnEliminar.addEventListener("click", ()=>{clickProyecto(projectId, "elim")})

    formNuevo.appendChild(divBotones);
    
    const btnCanc = document.createElement("button");
    btnCanc.textContent = `cancel`;
    btnCanc.classList.add("btn");
    btnCanc.classList.add("cancel");
    btnCanc.type = "button";
    btnCanc.addEventListener("click", ()=>{refresh()})
    formNuevo.appendChild(btnCanc);
    
    divCopia.appendChild(formNuevo);
    
    divCopia.id = projectId;
    divOriginal.replaceWith(divCopia);
}

const divProjects = document.getElementById('my-projects');

async function refresh(){
    
    document.getElementById('name').value = ""
    document.getElementById('description').value = ""
    document.getElementById('technologies').value = ""
    document.getElementById('repository').value = ""
    document.getElementById('image').value = ""
    
    const request = await projects.getProjectsByUser();
    
    const projectList = Array.isArray(request) ? request : request?.projects;

    if (projectList) {
        
        divProjects.innerHTML = '';

        projectList.forEach(project => {
            const divProject = document.createElement("div");
            divProject.classList.add("project");
            divProject.id = project._id;
            
            let techItems = ""

            if (project.technologies.length != 0) {
                techItems = "<p><strong>technologies:</strong></p> \n <div class=\"projects-section\"><ul>"
                techItems += (project.technologies)
                .map(tech => `<li>${tech}</li>`)
                .join('');
                techItems += "</ul></div>"
            }


            divProject.innerHTML = `
                <h3>${project.title}</h3>
                <img src="${project.images[0]}" alt="${project.title}" loading="lazy">
                <p class="description">${project.description || ''}</p>
                
                ${techItems}

                <div class="repository">
                    you can find the repository at <a href=${project.repository}>${project.repository}</a>!
                </div>
            `;
            
            const divBotones = document.createElement("div");
            divBotones.classList.add("botones");

            const btnMod = document.createElement("button");
            btnMod.textContent = `modify`;
            btnMod.classList.add("btn");
            divBotones.appendChild(btnMod);
            btnMod.addEventListener("click", ()=>{clickProyecto(divProject.id, "mod")})

            const btnEliminar = document.createElement("button");
            btnEliminar.textContent = `delete`;
            btnEliminar.classList.add("btn");
            divBotones.appendChild(btnEliminar);
            btnEliminar.addEventListener("click", ()=>{clickProyecto(divProject.id, "elim")})

            divProject.appendChild(divBotones);
            
            divProjects.appendChild(divProject);
        });
    }   
}

refresh();