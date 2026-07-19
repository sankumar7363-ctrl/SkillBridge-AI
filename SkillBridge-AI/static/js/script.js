// ================================
// SkillBridge AI
// script.js
// ================================

const form = document.getElementById("resumeForm");
const loading = document.getElementById("loadingOverlay");
const results = document.getElementById("results");

const atsScore = document.getElementById("atsScore");
const atsProgress = document.getElementById("atsProgress");
const atsStatus = document.getElementById("atsStatus");

const missingSkills = document.getElementById("missingSkills");

const roadmapTitle = document.getElementById("roadmapTitle");
const roadmapDescription = document.getElementById("roadmapDescription");

const modulesContainer = document.getElementById("modulesContainer");

// =====================================
// Upload Resume
// =====================================

form.addEventListener("submit", async function (e) {

    e.preventDefault();

    const file = document.getElementById("resume").files[0];

    if (!file) {

        alert("Please select a PDF Resume.");

        return;

    }

    const formData = new FormData();

    formData.append("resume", file);

    loading.style.display = "flex";

    results.style.display = "none";

    try {

        const response = await fetch("/api/upload", {

            method: "POST",

            body: formData

        });

        if (!response.ok) {

            throw new Error("Server Error");

        }

        const data = await response.json();

        loading.style.display = "none";

        results.style.display = "block";

        renderResult(data);

        results.scrollIntoView({

            behavior: "smooth"

        });

    }

    catch (error) {

        loading.style.display = "none";

        alert(error.message);

        console.error(error);

    }

});

// =====================================
// Render Result
// =====================================

function renderResult(data) {

    // ATS Score

    atsScore.innerHTML = data.atsScore + "%";

    atsProgress.style.width = data.atsScore + "%";

    if (data.atsScore >= 80) {

        atsStatus.innerHTML = "Excellent Resume";

        atsProgress.style.background = "#10B981";

    }

    else if (data.atsScore >= 60) {

        atsStatus.innerHTML = "Good Resume";

        atsProgress.style.background = "#F59E0B";

    }

    else {

        atsStatus.innerHTML = "Needs Improvement";

        atsProgress.style.background = "#EF4444";

    }

    // Missing Skills

    missingSkills.innerHTML = "";

    data.missingSkills.forEach(skill => {

        const badge = document.createElement("span");

        badge.className = "skill-badge";

        badge.innerHTML = skill;

        missingSkills.appendChild(badge);

    });

    // Roadmap

    roadmapTitle.innerHTML = data.learningModule.title;

    roadmapDescription.innerHTML = data.learningModule.description;

    // Modules

    modulesContainer.innerHTML = "";

    data.learningModule.modules.forEach(module => {

        const priority = module.priority.toLowerCase();

        let resources = "";

        module.resources.forEach(resource => {

            resources += `<li>${resource}</li>`;

        });

        modulesContainer.innerHTML += `

        <div class="col-lg-6 mb-4">

            <div class="module-card">

                <h4>${module.topic}</h4>

                <p>

                    <strong>Duration:</strong>

                    ${module.duration}

                </p>

                <p>

                    <strong>Priority:</strong>

                    <span class="priority ${priority}">

                        ${module.priority}

                    </span>

                </p>

                <strong>Resources</strong>

                <ul>

                    ${resources}

                </ul>

            </div>

        </div>

        `;

    });

}