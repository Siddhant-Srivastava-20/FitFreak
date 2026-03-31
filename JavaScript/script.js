// ================= DATA =================
let exercises = [];
// ================= ELEMENTS =================
const exerciseList = document.getElementById("exerciseList");
const planList = document.getElementById("planList");

// ================= STATE =================
let workoutPlan = [];

// ================= LOAD FROM LOCALSTORAGE =================
const savedPlan = localStorage.getItem("workoutPlan");
if (savedPlan) {
  workoutPlan = JSON.parse(savedPlan);
}

// ================= SAVE FUNCTION =================
function savePlan() {
  localStorage.setItem("workoutPlan", JSON.stringify(workoutPlan));
}

// ================= RENDER EXERCISES =================
function renderExercises(data) {
  if (!exerciseList) return;

  exerciseList.innerHTML = "";

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

// ================= RENDER PLAN =================
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

      savePlan();   // ✅ save after delete
      renderPlan();
    });

    planList.appendChild(li);
  });
}

// ================= ADD TO PLAN =================
function addToPlan(name) {
  if (workoutPlan.includes(name)) {
    alert("Already added!");
    return;
  }

  workoutPlan.push(name);

  savePlan();   // ✅ save after add
  renderPlan();
}
// ================= INITIAL LOAD =================
async function init() {
  exercises = await fetchExercises();
  renderExercises(exercises);
  renderPlan();
}
init();

