// lien des 2 api
const apiProjets = "https://webcraft-api.vercel.app/data/projects.json";
const apiFormations = "https://webcraft-api.vercel.app/data/courses.json";

let tousLesProjets = [];
let toutesLesFormations = [];

// menu burger (mobile)
const burger = document.getElementById("burger");
const nav = document.getElementById("menu");

burger.addEventListener("click", () => {
    nav.classList.toggle("active");
});

// pour remplir les select des filtres
function remplirFiltre(id, tableau) {
    const select = document.getElementById(id);
    tableau.forEach(item => {
        select.innerHTML += `<option value="${item}">${item}</option>`;
    });
}

// recuperation des projets avec fetch
async function getProjets() {
    const loader = document.getElementById("loader1");
    const msgErreur = document.getElementById("erreur1");

    try {
        const response = await fetch(apiProjets);

        if (!response.ok) {
            throw new Error("Erreur " + response.status);
        }

        const data = await response.json();
        console.log(data);

        tousLesProjets = data.projects;
        remplirFiltre("filtreTechno", data.technologies);
        remplirFiltre("filtreCategorie", data.categories);
        afficherProjets(tousLesProjets);

        loader.style.display = "none";
    } catch (e) {
        loader.style.display = "none";
        msgErreur.textContent = "Impossible de charger les projets, veuillez réessayer plus tard.";
        console.log(e);
    }
}

// pareil pour les formations
async function getFormations() {
    const loader = document.getElementById("loader2");
    const msgErreur = document.getElementById("erreur2");

    try {
        const res = await fetch(apiFormations);
        const data = await res.json();

        toutesLesFormations = data.courses;
        remplirFiltre("filtreCategorie2", data.categories);
        remplirFiltre("filtreNiveau", data.levels);
        remplirFiltre("filtreTechno2", data.technologies);
        afficherFormations(toutesLesFormations);

        loader.style.display = "none";
    } catch (error) {
        loader.style.display = "none";
        msgErreur.textContent = "Erreur : les formations n'ont pas pu être chargé.";
    }
}

// affiche les cartes des projets
function afficherProjets(tab) {
    const div = document.getElementById("listeProjets");
    div.innerHTML = "";

    if (tab.length == 0) {
        div.innerHTML = "<p>Aucun projet trouvé.</p>";
        return;
    }

    tab.forEach(projet => {
        const badges = projet.technologies.map(t => `<span class="badge">${t}</span>`).join("");

        div.innerHTML += `
            <article class="card">
                <img src="${projet.image}" alt="${projet.title}">
                <div class="card-content">
                    <h3>${projet.title}</h3>
                    <p class="client">${projet.client}</p>
                    <p class="categorie">${projet.category}</p>
                    <div class="badges">${badges}</div>
                    <div class="btns">
                        <button class="btn-voir" onclick="voirProjet(${projet.id})">Voir détails</button>
                    </div>
                </div>
            </article>
        `;
    });
}

function afficherFormations(tab) {
    const div = document.getElementById("listeFormations");
    div.innerHTML = "";

    if (tab.length == 0) {
        div.innerHTML = "<p>Aucune formation trouvée.</p>";
        return;
    }

    tab.forEach(formation => {
        const badges = formation.technologies.map(t => `<span class="badge">${t}</span>`).join("");
        let dispo = "";

        // badge dispo ou complet
        if (formation.available) {
            dispo = `<span class="dispo">Disponible</span>`;
        } else {
            dispo = `<span class="complet">Complet</span>`;
        }

        div.innerHTML += `
            <article class="card">
                <img src="${formation.image}" alt="image formation">
                <div class="card-content">
                    <h3>${formation.title}</h3>
                    <p class="categorie">${formation.category}</p>
                    <span class="badge-niveau">${formation.level}</span>
                    <div class="ligne-info">
                        <span>Durée : ${formation.duration}</span>
                        <span class="prix">${formation.price} €</span>
                    </div>
                    <div class="ligne-info">
                        <span>★ ${formation.rating}</span>
                        <span>${formation.students} étudiants</span>
                    </div>
                    <div class="badges">${badges}</div>
                    ${dispo}
                    <div class="btns">
                        <button class="btn-voir" onclick="voirFormation(${formation.id})">Voir détails</button>
                        <a href="inscription.html?formation=${formation.id}" class="btn-inscrire">S'inscrire</a>
                    </div>
                </div>
            </article>
        `;
    });
}

// recherche + filtres projets
function filtrerProjets() {
    const recherche = document.getElementById("searchProjet").value.toLowerCase();
    const techno = document.getElementById("filtreTechno").value;
    const cat = document.getElementById("filtreCategorie").value;

    const resultats = tousLesProjets.filter(p => {
        const bonTexte = p.title.toLowerCase().includes(recherche) || p.client.toLowerCase().includes(recherche);
        const bonneTechno = techno == "" || p.technologies.includes(techno);
        const bonneCat = cat == "" || p.category == cat;
        return bonTexte && bonneTechno && bonneCat;
    });

    afficherProjets(resultats);
}

// recherche + filtres formations
function filtrerFormations() {
    const recherche = document.getElementById("searchFormation").value.toLowerCase();
    const cat = document.getElementById("filtreCategorie2").value;
    const niveau = document.getElementById("filtreNiveau").value;
    const techno = document.getElementById("filtreTechno2").value;

    const resultats = toutesLesFormations.filter(f => {
        const bonTexte = f.title.toLowerCase().includes(recherche);
        const bonneCat = cat == "" || f.category == cat;
        const bonNiveau = niveau == "" || f.level == niveau;
        const bonneTechno = techno == "" || f.technologies.includes(techno);
        return bonTexte && bonneCat && bonNiveau && bonneTechno;
    });

    afficherFormations(resultats);
}

// ouvre la popup avec les details du projet
function voirProjet(id) {
    const projet = tousLesProjets.find(p => p.id == id);
    const badges = projet.technologies.map(t => `<span class="badge">${t}</span>`).join("");
    const features = projet.features.map(f => `<li>${f}</li>`).join("");

    document.getElementById("infosProjet").innerHTML = `
        <img src="${projet.image}" alt="${projet.title}">
        <h3>${projet.title}</h3>
        <p><strong>Client :</strong> ${projet.client}</p>
        <p><strong>Catégorie :</strong> ${projet.category}</p>
        <p><strong>Année :</strong> ${projet.year} - <strong>Durée :</strong> ${projet.duration}</p>
        <p>${projet.description}</p>
        <div class="badges">${badges}</div>
        <h4>Fonctionnalités</h4>
        <ul>${features}</ul>
        <div class="btns">
            <a href="${projet.url}" target="_blank" class="btn-voir">Voir le site</a>
        </div>
    `;

    document.getElementById("modalProjet").classList.add("active");
}

function voirFormation(id) {
    const formation = toutesLesFormations.find(f => f.id == id);
    const badges = formation.technologies.map(t => `<span class="badge">${t}</span>`).join("");
    const modules = formation.modules.map(m => `<li>${m}</li>`).join("");

    document.getElementById("infosFormation").innerHTML = `
        <img src="${formation.image}" alt="${formation.title}">
        <h3>${formation.title}</h3>
        <p><strong>Formateur :</strong> ${formation.instructor}</p>
        <p><strong>Catégorie :</strong> ${formation.category} - <strong>Niveau :</strong> ${formation.level}</p>
        <p><strong>Durée :</strong> ${formation.duration} - <strong>Prix :</strong> ${formation.price} €</p>
        <p>★ ${formation.rating} - ${formation.students} étudiants</p>
        <p>${formation.description}</p>
        <div class="badges">${badges}</div>
        <h4>Modules</h4>
        <ul>${modules}</ul>
        <div class="btns">
            <a href="inscription.html?formation=${formation.id}" class="btn-inscrire">S'inscrire maintenant</a>
        </div>
    `;

    document.getElementById("modalFormation").classList.add("active");
}

// ferme les 2 popups
function fermerModal() {
    document.getElementById("modalProjet").classList.remove("active");
    document.getElementById("modalFormation").classList.remove("active");
}

// pour le debounce
let timeout1;
let timeout2;

// code de la page d'accueil
if (document.getElementById("listeProjets")) {
    getProjets();
    getFormations();

    // on attend 300ms que l'utilisateur arrete d'ecrire
    document.getElementById("searchProjet").addEventListener("input", () => {
        clearTimeout(timeout1);
        timeout1 = setTimeout(filtrerProjets, 300);
    });
    document.getElementById("filtreTechno").addEventListener("change", filtrerProjets);
    document.getElementById("filtreCategorie").addEventListener("change", filtrerProjets);

    document.getElementById("searchFormation").addEventListener("input", () => {
        clearTimeout(timeout2);
        timeout2 = setTimeout(filtrerFormations, 300);
    });
    document.getElementById("filtreCategorie2").addEventListener("change", filtrerFormations);
    document.getElementById("filtreNiveau").addEventListener("change", filtrerFormations);
    document.getElementById("filtreTechno2").addEventListener("change", filtrerFormations);

    // fermeture des popups : croix, clic a coté, echap
    document.getElementById("close1").addEventListener("click", fermerModal);
    document.getElementById("close2").addEventListener("click", fermerModal);

    window.addEventListener("click", (e) => {
        if (e.target.classList.contains("modal")) {
            fermerModal();
        }
    });

    document.addEventListener("keydown", (e) => {
        if (e.key == "Escape") {
            fermerModal();
        }
    });
}

// ----- page inscription -----
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const telRegex = /^\+[0-9]{9,15}$/;

async function remplirSelectFormation() {
    const select = document.getElementById("formation");

    try {
        const response = await fetch(apiFormations);
        const data = await response.json();

        select.innerHTML = `<option value="">-- Choisir une formation --</option>`;
        data.courses.forEach(f => {
            select.innerHTML += `<option value="${f.id}">${f.title}</option>`;
        });

        // si on arrive depuis le bouton s'inscrire on preselectionne la formation
        const params = new URLSearchParams(window.location.search);
        if (params.get("formation")) {
            select.value = params.get("formation");
        }
    } catch (e) {
        select.innerHTML = `<option value="">Formations indisponibles</option>`;
        document.getElementById("erreur-formation").textContent = "Impossible de charger les formations.";
    }
}

// verifie un champ et affiche l'erreur en dessous
function verif(input) {
    const val = input.value.trim();
    let msg = "";

    if (input.id == "prenom" && val.length < 2) {
        msg = "Le prénom doit contenir au moins 2 caractères.";
    }
    if (input.id == "nom" && val.length < 2) {
        msg = "Le nom doit contenir au moins 2 caractères.";
    }
    if (input.id == "email" && !emailRegex.test(val)) {
        msg = "L'adresse email n'est pas valide (ex : jean.dupont@mail.fr).";
    }
    if (input.id == "tel" && !telRegex.test(val)) {
        msg = "Le numéro doit être au format international (ex : +33612345678).";
    }
    if (input.id == "formation" && val == "") {
        msg = "Veuillez choisir une formation.";
    }
    if (input.id == "niveau" && val == "") {
        msg = "Veuillez choisir votre niveau.";
    }
    if (input.id == "motivation" && val.length < 50) {
        msg = "La motivation doit contenir au moins 50 caractères.";
    }
    if (input.id == "experience" && val < 0) {
        msg = "L'expérience ne peut pas être négative.";
    }

    document.getElementById("erreur-" + input.id).textContent = msg;

    if (msg != "") {
        input.classList.add("error");
        input.classList.remove("success");
        return false;
    }

    input.classList.remove("error");
    if (val != "") {
        input.classList.add("success");
    }
    return true;
}

if (document.getElementById("formulaire")) {
    const formulaire = document.getElementById("formulaire");
    const inputs = formulaire.querySelectorAll("input, select, textarea");

    remplirSelectFormation();

    // validation en temps reel
    inputs.forEach(input => {
        input.addEventListener("input", () => verif(input));
    });

    formulaire.addEventListener("submit", (e) => {
        e.preventDefault();

        // on verifie tous les champs avant d'envoyer
        let toutEstBon = true;
        inputs.forEach(input => {
            if (!verif(input)) {
                toutEstBon = false;
            }
        });

        if (toutEstBon) {
            const prenom = document.getElementById("prenom").value.trim();
            alert("Merci " + prenom + " ! Votre inscription a bien été envoyée.");

            formulaire.reset();
            inputs.forEach(input => input.classList.remove("success"));
        }
    });
}
