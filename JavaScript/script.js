let exercises = [];


const exerciseList = document.getElementById("exerciseList");
const planList = document.getElementById("planList");
const searchInput = document.getElementById("searchInput");
const sortOption = document.getElementById("sortOption");

const categoryFilters = document.querySelectorAll(".category-filter");
const equipmentFilters = document.querySelectorAll(".equipment-filter");


let workoutPlan = [];


const savedPlan = localStorage.getItem("workoutPlan");
if (savedPlan) {
workoutPlan = JSON.parse(savedPlan);
}


function savePlan() {
localStorage.setItem("workoutPlan", JSON.stringify(workoutPlan));
}


function renderExercises(data) {
if (!exerciseList) return;

exerciseList.innerHTML = "";

if (!data || data.length === 0) {
exerciseList.innerHTML = "<p style='color:#64748b;'>No exercises found</p>";
return;
}

data.forEach(ex => {
const card = document.createElement("div");
card.className = "card";


card.innerHTML = `
  <h3>${ex.name}</h3>
  <p>${ex.category}</p>
  <p>${ex.equipment}</p>
  <button class="add-btn">Add</button>
`;

card.querySelector(".add-btn").addEventListener("click", () => {
  addToPlan(ex.name);
});

exerciseList.appendChild(card);


});
}

function renderPlan() {
if (!planList) return;

planList.innerHTML = "";

if (workoutPlan.length === 0) {
planList.innerHTML = "<p style='color:#64748b;'>No exercises added yet</p>";
return;
}

workoutPlan.forEach(name => {
const li = document.createElement("li");


li.innerHTML = `
  ${name}
  <button class="remove-btn">✖</button>
`;

li.querySelector(".remove-btn").addEventListener("click", () => {
  workoutPlan = workoutPlan.filter(item => item !== name);
  savePlan();
  renderPlan();
});

planList.appendChild(li);


});
}

function addToPlan(name) {
if (workoutPlan.includes(name)) {
alert("Already added!");
return;
}

workoutPlan.push(name);
savePlan();
renderPlan();
}

function updateUI() {
let filtered = [...exercises];

//SEARCH
const searchValue = searchInput?.value?.toLowerCase() || "";
if (searchValue) {
filtered = filtered.filter(ex =>
ex.name.toLowerCase().includes(searchValue)
);
}

//CATEGORY
const selectedCategories = [...categoryFilters]
.filter(cb => cb.checked)
.map(cb => cb.value);

if (selectedCategories.length > 0) {
filtered = filtered.filter(ex =>
selectedCategories.includes(ex.category)
);
}

//EQUIPMENT
const selectedEquipment = [...equipmentFilters]
.filter(cb => cb.checked)
.map(cb => cb.value);

if (selectedEquipment.length > 0) {
filtered = filtered.filter(ex =>
selectedEquipment.some(eq =>
ex.equipment.toLowerCase().includes(eq.toLowerCase())
)
);
}

//SORT
if (sortOption && sortOption.value === "az") {
filtered.sort((a, b) => a.name.localeCompare(b.name));
}

renderExercises(filtered);
}


if (searchInput) {
let timeout;
searchInput.addEventListener("input", () => {
clearTimeout(timeout);
timeout = setTimeout(updateUI, 300);
});
}


categoryFilters.forEach(cb => {
cb.addEventListener("change", updateUI);
});

equipmentFilters.forEach(cb => {
cb.addEventListener("change", updateUI);
});

// sort
if (sortOption) {
sortOption.addEventListener("change", updateUI);
}


async function init() {
if (exerciseList) {
exerciseList.innerHTML = "<p style='color:#64748b;'>Loading...</p>";
}

try {
exercises = await fetchExercises();
console.log("Fetched:", exercises); 
updateUI(); 
} catch (error) {
console.error("ERROR:", error);
exerciseList.innerHTML = "<p style='color:red;'>Failed to load data</p>";
}

renderPlan();
}

init();



const themeToggle = document.getElementById("themeToggle");
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
  themeToggle.innerText = "☀️";
}

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {
      localStorage.setItem("theme", "dark");
      themeToggle.innerText = "☀️";
    } else {
      localStorage.setItem("theme", "light");
      themeToggle.innerText = "🌙";
    }
  });
}