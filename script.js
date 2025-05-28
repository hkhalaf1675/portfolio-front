const baseURL = "http://localhost:6001";

// Theme toggle
const themeToggleButton = document.getElementById("theme-toggle");
themeToggleButton.addEventListener("click", () => {
    const root = document.documentElement;
    const currentTheme = root.getAttribute("data-theme");
    root.setAttribute("data-theme", currentTheme === "dark" ? "light" : "dark");
    themeToggleButton.textContent = currentTheme === "dark" ? "🌙" : "☀️";
});

const sidebar = document.getElementById("sidebar");
const sidebarToggleButton = document.getElementById("sidebar-toggle");

sidebarToggleButton.addEventListener("click", () => {
    sidebar.classList.toggle("collapsed");
});

const sidebarLinks = document.querySelectorAll(".sidebar ul li a");

sidebarLinks.forEach(link => {
    link.addEventListener("click", function () {
        sidebarLinks.forEach(l => l.classList.remove("active"));
            this.classList.add("active");
    });
});

const api = axios.create({
  baseURL,
  timeout: 5000,
  headers: { "Content-Type": "application/json" }
});

async function getSkills() {
  api.get("/skills")
    .then(response => {
      const skillsSection = document.getElementById("skills");
      for (const topic in response.data.data.skills) {
        if(topic == "Languages"){
          continue;
        }
        else {
          const header = document.createElement("h3");
          header.classList = "m-v-1";
          header.innerHTML = `${topic}`;
          skillsSection.appendChild(header);

          const list = document.createElement("div");
          list.classList = "grid-list";

          response.data.data.skills[topic].forEach(skill => {
            const div = document.createElement("div");
            div.classList = "card";
            div.innerHTML = `<h4>${skill.title}</h4>`;
            list.appendChild(div);
          });

          skillsSection.appendChild(list);
        }
      }
    })
    .catch(err => {
      console.error("Error at fetching skills data ...");
      console.error(err);
    });
}
getSkills();

async function getExperiences() {
  api.get('/experiences')
    .then(response => {
      const experienceslist = document.getElementById("experiencesList");
      response.data.data.experiences.forEach(item => {
        const card = document.createElement("div");
        card.classList = "card";

        const jobTitle = document.createElement("h3");
        jobTitle.innerHTML = `${item.jobTitle}`;
        card.appendChild(jobTitle);

        const companyName = document.createElement("h4");
        companyName.innerHTML = item.companyName;
        card.appendChild(companyName);

        const duration = document.createElement("p");
        let startDate = item.startDate;
        let endDate = item.endDate;

        startDate = startDate ? new Date(startDate).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short"
        }) : null;

        endDate = endDate ? new Date(endDate).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short"
        }) : "Current";

        duration.innerHTML = `${startDate} - ${endDate}`;
        card.appendChild(duration);

        const description = document.createElement("p");
        description.classList = "pre-line";
        description.innerHTML = item.description;
        card.appendChild(description);

        experienceslist.appendChild(card);
      });
    })
    .catch(err => {
      console.error("Error at fetching experiences data ...");
      console.error(err);
    });
}
getExperiences();

async function getEducation() {
  api.get("personal-info?title=education")
    .then(response => {
      const education = response.data.data?.personalInfo[0]?.value;
      
      const educationSection = document.getElementById("education");

      const college = document.createElement("h3");
      college.innerHTML = education["College"];
      educationSection.appendChild(college);

      const university = education["University"];
      const graduationYear = education["Graduation Year"] 
        ? new Date(education["Graduation Year"]).toLocaleDateString("en-US", { year: "numeric", month: "short" })
        : "2021";
      const universityAndGraduationYear = document.createElement("p");
      universityAndGraduationYear.innerHTML = `${university}\t-\t${graduationYear}`;
      educationSection.appendChild(universityAndGraduationYear);

      const grade = document.createElement("p");
      grade.innerHTML = `<span class="bold">Grade:</span> ${education["Grade"]}`;
      educationSection.appendChild(grade);

      const graduationProjectHeader = document.createElement("h4");
      graduationProjectHeader.innerHTML = "Graduation Project: ";
      educationSection.appendChild(graduationProjectHeader);

      const graduationProjectDiv = document.createElement("p");
      graduationProjectDiv.classList = "m-h-1";

      const projectName = document.createElement("a");
      projectName.innerHTML = `${education["Graduation Project"]["Name"]}📎`;
      projectName.setAttribute("href", education["Graduation Project"]["Link"]);
      projectName.setAttribute("target", "blank");
      projectName.classList = "href";
      graduationProjectDiv.appendChild(projectName);

      const projectGrade = document.createElement("p");
      projectGrade.innerHTML = `<span class="bold">Grade:</span> ${education["Graduation Project"]["Grade"]}`;
      graduationProjectDiv.appendChild(projectGrade);

      const projectDescription = document.createElement("p");
      projectDescription.innerHTML = education["Graduation Project"]["Description"];
      graduationProjectDiv.appendChild(projectDescription);

      educationSection.appendChild(graduationProjectDiv);
    })
    .catch(err => {
      console.error("Error at fetching education data ...");
      console.error(err);
    });
}
getEducation();