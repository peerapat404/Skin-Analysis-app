const el = {};

document.addEventListener("DOMContentLoaded", async () => {
  localStorage.setItem("user_id", "42a2d2a9-e77f-48a5-8697-41b505626fe0");
  await loadRoutineTemplate();
  loadUserCreatedRoutines();
  loadPredefinedRoutines(); 
  prepareHandlers();
  addEventListeners();
});

// Prepare the handlers for the elements.
function prepareHandlers() {
  el.addRoutineBtn = document.querySelector("#createRoutine");
  el.routineNameInput = document.querySelector("#routineName");
  el.routineList = document.querySelector("#routineList");
  el.deleteRoutineBtn = document.querySelector(".deleteRoutineBtn");
}

// Add event listeners to the elements.
function addEventListeners() {
  el.addRoutineBtn.addEventListener("click", addRoutine);
  el.routineNameInput.addEventListener("keypress", enterKeypress);
}

// Add event listener for the Enter keypress
function enterKeypress(e) {
  if (e.key === "Enter") {
    addRoutine();
  }
}

/// Load the routine template from the server.
async function loadRoutineTemplate() {
  try {
    const response = await fetch("template/routine-template.html");
    const text = await response.text();

    const templateDiv = document.createElement("div");
    templateDiv.innerHTML = text.trim();

    const templateEl = templateDiv.querySelector("template");
    if (!templateEl) {
      throw new Error("Template element not found in the fetched HTML.");
    }

    el.routineTemplate = templateEl;

  } catch (error) {
    console.error("Failed to load routine template:", error);
  }
}

/// Routine class to create routine cards from routine data.
class Routine {
  constructor(data, predefined) {
    this.id = data.routine_id;
    if (!predefined) {
      this.routine_name = data.routine_name
    } else {
      this.routine_name = 
      `
      ${data.time.charAt(0).toUpperCase() + data.time.slice(1).toLowerCase()} 
      Routine For 
      ${data.skin_type.charAt(0).toUpperCase() + data.skin_type.slice(1).toLowerCase()} 
      Skin
      `;
    }
    
    if (!el.routineTemplate) {
      throw new Error("Routine template not loaded.");
    }

    // Clone the template content
    const routineClone = el.routineTemplate.content.cloneNode(true);

    const routineContainer = routineClone.querySelector(".routineContainer");
    if (!routineContainer) {
      throw new Error("Routine container not found in the template.");
    }

    // Set the routine id and name
    routineContainer.setAttribute("data-id", this.id);
    routineContainer.querySelector(".routine-name").textContent = this.routine_name;
    routineContainer.href = `/routine_details.html?id=${this.id}&predefined=${predefined}`;

    // routineContainer.querySelector(".product").textContent = this.product;

    // Add delete button event listener
    el.deleteRoutineBtn = routineClone.querySelector(".deleteRoutineBtn");
    if (el.deleteRoutineBtn) {
      el.deleteRoutineBtn.addEventListener("click", async (event) => {
        event.preventDefault();
        await deleteRoutine(this.id, routineContainer);
      });
    }
    // Append the routine list
    el.routineList.appendChild(routineContainer);
  }
}

/// Create a new routine element and append it to the routine list.
function createRoutineEl(routine, predefined) {
  new Routine(routine, predefined);

}

/// Load user-created routines from the server.
async function loadUserCreatedRoutines() {
  try {
    const response = await fetch("/getRoutines", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: localStorage.getItem("user_id") }),
    });

    const routines = await response.json();
    routines.forEach(routine => createRoutineEl(routine, false));
  } catch (error) {
    console.error("Failed to load routines:", error);
  }
}

/// Load predefined routines based on the user's skin type.
async function loadPredefinedRoutines() {
  try {
    const response = await fetch(`/predefined-routines/skin/${localStorage.getItem("skin_type")}`);
    if (!response.ok) {
      throw new Error("Failed to load predefined routines.");
    }

    const predefinedRoutines = await response.json();
    predefinedRoutines.forEach(routine => createRoutineEl(routine, true));

  } catch (error) {
    console.error("Failed to load predefined routines:", error);
  }
}

// Add a new routine to the server and display it in the list.
async function addRoutine() {
  const routineName = el.routineNameInput.value.trim();
  if (!routineName) {
    alert("Please enter a routine name");
    return;
  }
  
  const routineData = { routineName, user_id: localStorage.getItem("user_id") };

  try {
    const response = await fetch("/routines", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(routineData),
    });

    if (!response.ok) {
      throw new Error("Failed to create routine.");
    }

    const newRoutine = await response.json();
    createRoutineEl(newRoutine);
    el.routineNameInput.value = "";

  } catch (error) {
    console.error("Failed to add routine:", error);
  }
}

// Delete a routine from the server and remove it from the list.
async function deleteRoutine(id) {
  try {
    const response = await fetch(`/updateRoutines/${id}`, {
      method: "POST",
    });

    if (!response.ok) {
      throw new Error("Failed to delete routine.");
    }

    const routineEl = document.querySelector(`.routineContainer[data-id="${id}"]`);
    routineEl.remove();

  } catch (error) {
    console.error("Failed to delete routine:", error);
  }
}