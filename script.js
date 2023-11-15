"use strict";


let programs = [];

// Ladda program från local storage vid start
loadProgramsFromLocalStorage();
displayPrograms(programs);

//  för att ändra storleken på bilder
function resizeImages() {
    const images = document.querySelectorAll('#RekomenderasList img');
    const cmToPixel = 37;
    const widthInCm = 5;
    const heightInCm = 5;
    const widthInPixels = widthInCm * cmToPixel;
    const heightInPixels = heightInCm * cmToPixel;

    images.forEach(image => {
       
        if (!image.style.width && !image.style.height && !image.classList.contains('no-resize')) {
            image.style.width = widthInPixels + 'px';
            image.style.height = heightInPixels + 'px';
        }
    });
}

// för att ändra bildstorlek när sidan laddas
document.addEventListener('DOMContentLoaded', resizeImages);

// för att visa program
function displayPrograms(programsToDisplay) {
    const rekomenderasList = document.getElementById("RekomenderasList");
    rekomenderasList.innerHTML = "";

    programsToDisplay.forEach(program => {
        const programElement = createProgramElement(program);
        rekomenderasList.appendChild(programElement);
    });

    
    resizeImages();
}

// skapa HTML-element för ett program
function createProgramElement(program) {
    const programElement = document.createElement("div");
    programElement.classList.add("program-box");

    programElement.innerHTML = `<h3>${program.title}</h3>
                                ${program.imageUrl ? `<img src="${program.imageUrl}" alt="${program.title} Bild">` : ''}
                                <p>${program.description}</p>
                                <p>Åldersgräns: ${program.ageLimit}</p>
                                <p>Kategori: ${program.category}</p>`;
    return programElement;
}


function adjustDescriptionTextarea() {
    const descriptionTextarea = document.getElementById("description");
    descriptionTextarea.style.height = "auto";
    descriptionTextarea.style.height = (descriptionTextarea.scrollHeight) + "px";
}


document.getElementById("description").addEventListener("input", adjustDescriptionTextarea);

// lägga till ett program
function addProgram(event) {
    event.preventDefault();

    const title = getValueById("title");
    const description = getValueById("description");
    const ageLimit = getValueById("ageLimit");
    const imageUrl = getValueById("imageUrl");
    const category = getCategory();

    const program = {
        title,
        description,
        ageLimit,
        imageUrl,
        category
    };

    programs.push(program);
    saveProgramsToLocalStorage();
    displayPrograms(programs);
}

//  söka program
function searchPrograms() {
    const searchInput = getValueById("searchInput").toLowerCase();

    const searchResults = programs.filter(program =>
        program.title.toLowerCase().includes(searchInput)
    );

    displayPrograms(searchResults);
}

function getCategory() {
    const categorySelect = document.getElementById("category");
    return categorySelect.options[categorySelect.selectedIndex].value;
}

// Funktion för program baserat på kategori
function filterPrograms(category) {
    if (category === 'all') {
        // Visa alla program om kategorin är 'all'
        displayPrograms(programs);
    } else {
        // Filtrera program baserat på vald kategori
        const filteredPrograms = programs.filter(program => program.category === category);
        displayPrograms(filteredPrograms);
    }
}

function getCategory() {
    const categorySelect = document.getElementById("category");
    return categorySelect.options[categorySelect.selectedIndex].value;
}


function clearLocalStorage() {
    console.log("Clearing local storage...");
    localStorage.clear();
    programs = [];
    displayPrograms(programs);
}

//  radera ett program
function clearProgram() {
    
    const programTitles = programs.map(program => program.title);

    const programToDelete = prompt("Vilket program vill du radera? (Ange programtiteln)", programTitles[0]);

    if (programToDelete !== null) {
        
        const programExists = programs.some(program => program.title === programToDelete);

        if (programExists) {
            const confirmDelete = confirm(`Vill du verkligen radera programmet "${programToDelete}"?`);

            
            if (confirmDelete) {
                programs = programs.filter(program => program.title !== programToDelete);
                saveProgramsToLocalStorage();
                displayPrograms(programs);
            }
        } else {
            alert(`Programmet "${programToDelete}" finns inte.`);
        }
    } else {
       
        alert("Radering avbruten.");
    }
}


function getValueById(id) {
    return document.getElementById(id).value;
}

// spara programdata till local storage
function saveProgramsToLocalStorage() {
    localStorage.setItem("programs", JSON.stringify(programs));
}

// ladda programdata från local storage
function loadProgramsFromLocalStorage() {
    try {
        const storedPrograms = localStorage.getItem("programs");
        programs = storedPrograms ? JSON.parse(storedPrograms) : [];
    } catch (error) {
        console.error("Fel vid inläsning av program från local storage:", error);
    }
}
