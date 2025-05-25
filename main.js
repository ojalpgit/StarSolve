import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { gsap } from "gsap";

// Create a new Three.js scene where all 3D objects will be added
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

// Set up a perspective camera with field of view 75, appropriate aspect ratio, and view frustum from 0.1 to 1000 units
const camera = new THREE.PerspectiveCamera(
  75,
  (window.innerWidth * 0.6) / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 30, 100); // Position the camera to get a good view of the scene

// Create a WebGL renderer with antialiasing enabled for smoother edges
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth * 0.6, window.innerHeight); // Set renderer size to 60% width of the window
document.getElementById("center-panel").appendChild(renderer.domElement); // Attach the renderer canvas to the HTML DOM

// Add orbit controls to allow user interaction with the camera
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Enable damping for smoother motion

// Add a soft ambient light to illuminate all objects slightly
scene.add(new THREE.AmbientLight(0xffffff, 0.3));
// Add a bright point light to simulate sunlight coming from a specific point
const sunLight = new THREE.PointLight(0xffffff, 2, 300); // White light, high intensity, limited range
scene.add(sunLight);

// Load a texture for the sun using the texture loader
const textureLoader = new THREE.TextureLoader();
// Create a sun mesh using a sphere geometry and apply the sun texture as its material
const sun = new THREE.Mesh(
  new THREE.SphereGeometry(8, 64, 64),
  new THREE.MeshBasicMaterial({ map: textureLoader.load("textures/sun.jpg") })
);
scene.add(sun);

// Array containing metadata for each planet in the solar system
const planetData = [
  {
    name: "Mercury",
    texture: "textures/mercury.jpg",
    size: 1,
    distance: 15,
    speed: 0.004,
    cost: 10,
    currentlyUnlocked: false,
    funFact: "Mercury has no atmosphere to retain heat.",
    difficulty: 1,
  },
  {
    name: "Venus",
    texture: "textures/venus.jpg",
    size: 1.5,
    distance: 25,
    speed: 0.003,
    cost: 20,
    currentlyUnlocked: false,
    funFact: "Venus is hotter than Mercury due to its thick atmosphere.",
    difficulty: 2,
  },
  {
    name: "Earth",
    texture: "textures/earth.jpg",
    size: 2,
    distance: 35,
    speed: 0.002,
    cost: 30,
    currentlyUnlocked: true,
    funFact: "Earth is the only known planet with life.",
    difficulty: 1,
  },
  {
    name: "Mars",
    texture: "textures/mars.jpg",
    size: 1.8,
    distance: 45,
    speed: 0.0015,
    cost: 40,
    currentlyUnlocked: false,
    funFact: "Mars has the tallest volcano in the solar system.",
    difficulty: 2,
  },
  {
    name: "Jupiter",
    texture: "textures/jupiter.jpg",
    size: 4,
    distance: 60,
    speed: 0.001,
    cost: 50,
    currentlyUnlocked: false,
    funFact: "Jupiter has a giant red storm that's been active for centuries.",
    difficulty: 3,
  },
  {
    name: "Saturn",
    texture: "textures/saturn.jpg",
    size: 3.5,
    distance: 75,
    speed: 0.0008,
    cost: 60,
    currentlyUnlocked: false,
    funFact: "Saturn's rings are made of ice and rock.",
    difficulty: 3,
  },
  {
    name: "Uranus",
    texture: "textures/uranus.jpg",
    size: 3,
    distance: 90,
    speed: 0.0006,
    cost: 70,
    currentlyUnlocked: false,
    funFact: "Uranus rotates on its side.",
    difficulty: 4,
  },
  {
    name: "Neptune",
    texture: "textures/neptune.jpg",
    size: 3,
    distance: 105,
    speed: 0.0005,
    cost: 80,
    currentlyUnlocked: false,
    funFact: "Neptune has supersonic winds.",
    difficulty: 4,
  },
];

// Arrays to store generated planet and orbit objects
const planets = [];
const orbits = [];

// Iterate over each planet's data to create its 3D representation
planetData.forEach((data) => {
  // Create an empty Object3D to represent the orbit path center
  const orbit = new THREE.Object3D();
  scene.add(orbit); // Add orbit object to the scene

  // Create a mesh for the planet using a high-detail sphere and a textured material
  const planet = new THREE.Mesh(
    new THREE.SphereGeometry(data.size, 64, 64),
    new THREE.MeshStandardMaterial({
      map: textureLoader.load(data.texture),
      emissive: new THREE.Color(0x333333),
      emissiveIntensity: 1.5,
    })
  );
  planet.position.x = data.distance; // Place the planet at the correct distance from the orbit center
  planet.userData = data;

  orbit.add(planet); // Add the planet to its orbit
  orbits.push({ orbit, speed: data.speed }); // Store orbit with its rotation speed
  planets.push(planet); // Keep reference to the planet for interaction
});

// Create a raycaster to detect object intersections with mouse clicks
const raycaster = new THREE.Raycaster();
// Create a 2D vector to store the normalized mouse coordinates
const mouse = new THREE.Vector2();
// Reference to the HTML element that displays planet information
const infoDiv = document.getElementById("info");

// Add a click event listener to the window to handle planet selection
window.addEventListener("click", (event) => {
  // Convert the mouse X coordinate to normalized device coordinates (-1 to +1)
  mouse.x =
    ((event.clientX - document.getElementById("left-panel").offsetWidth) /
      (window.innerWidth * 0.6)) *
      2 -
    1;
  // Convert the mouse Y coordinate to normalized device coordinates
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  // Set the raycaster using the normalized mouse coordinates and the camera
  raycaster.setFromCamera(mouse, camera);
  // Find intersections between the ray and the planets
  const intersects = raycaster.intersectObjects(planets);
  // If the ray intersects at least one planet
  if (intersects.length > 0) {
    const planet = intersects[0].object; // Get the first intersected object
    const data = planet.userData; // Access the stored planet data
    // Populate the infoDiv with planet details and status
    infoDiv.innerHTML = `
  <h3>${data.name}</h3>
  <p><strong>Fun Fact:</strong> ${data.funFact}</p>
  <p><strong>Difficulty:</strong> ${data.difficulty}</p>
  <p>${
    data.currentlyUnlocked
      ? "✅ This planet is already conquered."
      : `🪙 To conquer this planet, you need <strong>${data.cost} coins</strong>.`
  }</p>
`;
  } else {
    // If no planet was clicked, clear the info box
    infoDiv.innerHTML = "";
  }
});

// Event listener for the back button in the planet view
document.getElementById("back-button").addEventListener("click", () => {
  // Hide the planet selection UI
  document.getElementById("planet-selection").style.display = "none";
  // Show the question container UI
  document.getElementById("question-container").style.display = "block";
  // Hide the back button itself
  document.getElementById("back-button").style.display = "none";
});

// Handle browser window resize events
window.addEventListener("resize", () => {
  // Update camera aspect ratio based on resized window
  camera.aspect = (window.innerWidth * 0.6) / window.innerHeight;
  camera.updateProjectionMatrix();
  // Update the renderer size accordingly
  renderer.setSize(window.innerWidth * 0.6, window.innerHeight);
});

// Save the initial camera position and target
const initialCameraPosition = camera.position.clone();
const initialTarget = controls.target.clone();

// Event listener for the reset view button
document.getElementById("reset-view-button").addEventListener("click", () => {
  // Play and loop background audio
  audio.play();
  audio.loop = true;
  // Smoothly transition camera back to initial position using GSAP animation
  gsap.to(camera.position, {
    duration: 2,
    x: initialCameraPosition.x,
    y: initialCameraPosition.y,
    z: initialCameraPosition.z,
    ease: "power2.inOut",
    onUpdate: () => {
      // Gradually interpolate the controls' target for a smooth visual effect
      controls.target.lerp(initialTarget, 0.1);
      controls.update();
    },
    onComplete: () => {
      // Snap the target to exact original position and re-enable controls
      controls.target.copy(initialTarget);
      controls.enabled = true;
    },
  });
});

// Create and return a field of stars using a self-invoking function
const stars = (() => {
  const geometry = new THREE.BufferGeometry();
  const starCount = 3000;
  const starVertices = [];
  // Generate random positions for each star within a cubic space
  for (let i = 0; i < starCount; i++) {
    const x = THREE.MathUtils.randFloatSpread(2000);
    const y = THREE.MathUtils.randFloatSpread(2000);
    const z = THREE.MathUtils.randFloatSpread(2000);
    starVertices.push(x, y, z);
  }
  // Add star vertex data to the geometry
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(starVertices, 3)
  );
  // Create material for the stars (white dots with slight opacity)
  const material = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 2.5,
    transparent: true,
    opacity: 1.0,
  });
  // Create the star field and add it to the scene
  const stars = new THREE.Points(geometry, material);
  scene.add(stars);
  return stars;
})();

// Function to animate the star field (pulsing opacity and slow rotation)
function animateStars() {
  const time = Date.now() * 0.0005;
  stars.material.opacity = 0.7 + 0.3 * Math.sin(time); // Create a twinkling effect
  stars.rotation.y += 0.0001; // Very slow rotation of the star field
}

// Main animation loop
function animate() {
  requestAnimationFrame(animate); // Keep the loop going
  // Rotate each planet's orbit around the sun
  orbits.forEach(({ orbit, speed }) => (orbit.rotation.y += speed));
  // Animate stars (twinkle and rotate)
  animateStars();
  // Update camera controls (for smooth movement)
  controls.update();
  // Render the current scene
  renderer.render(scene, camera);
}
// Start the animation loop
animate();

// Game Logic
// Global state variables
let currentAnswer = 0; // The correct answer to the current math question
let difficulty = 1; // Current difficulty level (1–4)
let currentPlanet = null; // Currently selected planet
let unlockedPlanets = []; // Array to store conquered planets
let coins = 0; // Player's current coin count

// Array of planets with their properties
const planetsData = [
  { name: "Earth", image: "🌍", cost: 0, unlocked: true }, // Earth is free to start
  { name: "Mercury", image: "☿", cost: 10 },
  { name: "Venus", image: "♀", cost: 20 },
  { name: "Mars", image: "♂", cost: 40 },
  { name: "Saturn", image: "♄", cost: 60 },
  { name: "Jupiter", image: "♃", cost: 50 },
  { name: "Uranus", image: "⛢", cost: 70 },
  { name: "Neptune", image: "♆", cost: 80 },
];

// Update the coin display on the screen
function updateCoinDisplay() {
  document.getElementById("coin-display").textContent = `Coins: ${coins}`;
}

// Return the number of coins rewarded based on current difficulty
function getCoinsForDifficulty() {
  switch (difficulty) {
    case 1:
      return 5;
    case 2:
      return 10;
    case 3:
      return 15;
    case 4:
      return 20;
    default:
      return 5;
  }
}

// Submit answer logic (exposed to global scope)
window.submitAnswer = function () {
  const userAnswer = parseInt(document.getElementById("answer").value);
  const feedback = document.getElementById("feedback");

  // Correct answer
  if (userAnswer === currentAnswer) {
    const reward = getCoinsForDifficulty();
    feedback.textContent = `✅ Correct! You earned ${reward} coins.`;
    coins += reward;
    updateCoinDisplay();
    document.getElementById("answer").value = "";

    // First time answering correctly (no current planet yet)
    if (!currentPlanet && planetsData.length > 0) {
      showPlanetSelection();
      document.getElementById("expand-empire-button").style.display = "none";
    } else {
      increaseDifficulty(); // Progress difficulty if already on a planet
    }

    // Show expand button only after more than 1 planet is unlocked
    if (currentPlanet && unlockedPlanets.length > 1 && planetsData.length > 1) {
      document.getElementById("expand-empire-button").style.display = "block";
    }
  } else {
    feedback.textContent = "❌ Try again!"; // Incorrect answer feedback
  }
};

// Generate a new math question based on current difficulty level
function generateQuestion() {
  let a, b;

  if (difficulty === 1) {
    // Easy addition
    a = Math.floor(Math.random() * 10);
    b = Math.floor(Math.random() * 10);
    currentAnswer = a + b;
    document.getElementById("question").textContent = `What is ${a} + ${b}?`;
  } else if (difficulty === 2) {
    // Subtraction (no negatives)
    a = Math.floor(Math.random() * 21);
    b = Math.floor(Math.random() * (a + 1));
    currentAnswer = a - b;
    document.getElementById("question").textContent = `What is ${a} - ${b}?`;
  } else if (difficulty === 3) {
    // Multiplication
    a = Math.floor(Math.random() * 11);
    b = Math.floor(Math.random() * 11);
    currentAnswer = a * b;
    document.getElementById("question").textContent = `What is ${a} * ${b}?`;
  } else {
    // Division with whole number result
    b = Math.floor(Math.random() * 9) + 1;
    currentAnswer = Math.floor(Math.random() * 11);
    a = b * currentAnswer;
    document.getElementById("question").textContent = `What is ${a} / ${b}?`;
  }
}

// Progress to the next difficulty level, wrapping around from 4 to 1
function increaseDifficulty() {
  difficulty = (difficulty % 4) + 1;
  generateQuestion();
}

// Show available planets for selection or purchase
function showPlanetSelection() {
  document.getElementById("question-container").style.display = "none";
  document.getElementById("planet-selection").style.display = "block";
  document.getElementById("back-button").style.display = "inline-block";

  const container = document.getElementById("available-planets");
  container.innerHTML = ""; // Clear existing options

  planetsData.forEach((planet) => {
    const div = document.createElement("div");
    div.className = "planet-option";
    div.style.border = "2px solid transparent";
    div.style.borderRadius = "5px";
    div.style.padding = "5px";

    // Planet emoji
    const planetEmoji = document.createElement("div");
    planetEmoji.style.fontSize = "30px";
    planetEmoji.textContent = planet.image;
    div.appendChild(planetEmoji);

    // Planet name
    const planetName = document.createElement("div");
    planetName.textContent = planet.name;
    div.appendChild(planetName);

    // Planet cost
    const planetCost = document.createElement("div");
    planetCost.style.fontSize = "12px";
    planetCost.style.color = "gold";
    planetCost.textContent =
      planet.cost > 0 ? `Cost: ${planet.cost} 💰` : "Free";
    div.appendChild(planetCost);

    // If not already unlocked
    if (!unlockedPlanets.some((p) => p.name === planet.name)) {
      if (coins >= planet.cost) {
        // Sufficient coins: highlight and allow selection
        div.style.borderColor = "#4CAF50";
        div.style.cursor = "pointer";
        div.onclick = () => purchasePlanet(planet);
      } else if (planet.cost > 0) {
        // Insufficient coins: disable selection
        div.style.borderColor = "#f44336";
        div.style.opacity = 0.7;
        div.style.cursor = "not-allowed";
      } else {
        // Free planet (e.g., Earth): allow starting
        div.style.cursor = "pointer";
        div.onclick = () => selectStartingPlanet(planet.name);
      }
    }
    container.appendChild(div); // Add to UI
  });
}

function purchasePlanet(planet) {
  // Check if player has enough coins to purchase the planet
  if (coins >= planet.cost) {
    // Deduct the cost from player's coin balance
    coins -= planet.cost;

    // Find the matching planet object in the data array (note: should be planetsData, not planetData)
    const targetPlanet = planetData.find((p) => p.name === planet.name);

    // If the planet exists in the data array, mark it as unlocked
    if (targetPlanet) {
      targetPlanet.currentlyUnlocked = true;
    }

    // Update the coin display on the UI
    updateCoinDisplay();

    // Add the newly unlocked planet to the list of unlocked planets
    unlockedPlanets.push(planet);

    // Update the UI to show unlocked planets (e.g., in side panel or galaxy view)
    updateUnlockedPlanetsDisplay();

    // Hide the planet selection screen and show the math question interface
    document.getElementById("planet-selection").style.display = "none";
    document.getElementById("question-container").style.display = "block";

    // Make the "expand empire" button visible
    document.getElementById("expand-empire-button").style.display = "block";

    // Display conquest feedback to the user
    document.getElementById(
      "feedback"
    ).textContent = `Planet ${planet.name} conquered!`;

    // Find the 3D mesh of the conquered planet in the scene
    const planetMesh = planets.find((p) => p.userData.name === planet.name);

    if (planetMesh) {
      // Ensure world transformations are up-to-date
      planetMesh.parent.updateMatrixWorld();

      // Get the world position of the planet
      const targetPos = new THREE.Vector3();
      planetMesh.getWorldPosition(targetPos);

      // Calculate zoom-in distance and camera offset for a dramatic fly-in
      const zoomDistance = planetMesh.geometry.boundingSphere.radius * 6;
      const zoomOffset = new THREE.Vector3(0, zoomDistance * 0.5, zoomDistance);
      const destination = targetPos.clone().add(zoomOffset);

      // Save the original camera position so we can return after zooming
      const originalCamPos = camera.position.clone();

      // Variables for orbiting animation around the planet
      let isOrbiting = false;
      let orbitAngle = 0;
      const orbitRadius = zoomDistance;
      const orbitSpeed = 0.3; // Controls how fast the orbiting is
      const clock = new THREE.Clock();

      // Function to update camera position in an orbit around the planet
      const updateOrbit = () => {
        if (!isOrbiting) return;

        planetMesh.getWorldPosition(targetPos);
        orbitAngle += orbitSpeed * clock.getDelta();

        const x = targetPos.x + orbitRadius * Math.cos(orbitAngle);
        const z = targetPos.z + orbitRadius * Math.sin(orbitAngle);
        const y = targetPos.y + orbitRadius * 0.3;

        // Smooth camera transition to new orbit position
        camera.position.lerp(new THREE.Vector3(x, y, z), 0.05);
        controls.target.copy(targetPos);
        controls.update();
      };

      // Starts the orbit animation
      const startOrbit = () => {
        orbitAngle = 0;
        clock.start();
        isOrbiting = true;
        gsap.ticker.add(updateOrbit);
      };

      // Stops the orbit animation
      const stopOrbit = () => {
        isOrbiting = false;
        gsap.ticker.remove(updateOrbit);
      };

      // Create GSAP timeline for smooth zoom and orbit effects
      const timeline = gsap.timeline({
        onComplete: () => stopOrbit(), // Ensure orbiting stops after timeline finishes
      });

      // Step 1: Smooth zoom-in to the planet
      timeline.to(camera.position, {
        duration: 2,
        x: destination.x,
        y: destination.y,
        z: destination.z,
        ease: "power2.inOut",
        onStart: () => (controls.enabled = false), // Disable controls during animation
        onUpdate: () => {
          planetMesh.getWorldPosition(targetPos);
          controls.target.copy(targetPos);
          controls.update();
        },
        onComplete: startOrbit, // Begin orbiting after zoom completes
      });

      // Step 2: Orbit the planet for 5 seconds
      timeline.to(
        {},
        {
          duration: 5,
          onComplete: stopOrbit,
        }
      );

      // Step 3: Smoothly zoom back out to the original camera position
      timeline.to(camera.position, {
        duration: 2,
        x: originalCamPos.x,
        y: originalCamPos.y,
        z: originalCamPos.z,
        ease: "power2.inOut",
        onUpdate: () => {
          controls.target.set(0, 0, 0); // Point back to the center (e.g., the Sun)
          controls.update();
        },
        onComplete: () => (controls.enabled = true), // Re-enable user controls
      });
    }

    // Trigger any events or logic tied to conquering a planet
    checkInvasionEvent();
  } else {
    // Inform the player they don't have enough coins
    document.getElementById(
      "feedback"
    ).textContent = `Not enough coins to conquer ${planet.name}.`;
  }
}

// Handles the logic for selecting a starting planet
function selectStartingPlanet(name) {
  currentPlanet = name;
  const planet = planetsData.find((p) => p.name === name);

  // If the planet isn't already unlocked, unlock it
  if (planet && !unlockedPlanets.some((p) => p.name === planet.name)) {
    unlockedPlanets.push(planet);
    updateUnlockedPlanetsDisplay(); // Update the display of unlocked planets
  }

  // Show the question container and expansion button
  document.getElementById("planet-selection").style.display = "none";
  document.getElementById("question-container").style.display = "block";
  document.getElementById("expand-empire-button").style.display = "block";

  // Provide user feedback
  document.getElementById(
    "feedback"
  ).textContent = `Empire started on ${name}! Solve questions to earn coins.`;

  increaseDifficulty(); // Increase difficulty for next questions
}

// Deprecated function - unlocking planets is now handled via purchasing
function unlockNewPlanet() {}

// Updates the display of all currently unlocked planets
function updateUnlockedPlanetsDisplay() {
  const div = document.getElementById("current-empire");
  div.innerHTML = ""; // Clear current display

  unlockedPlanets.forEach((planet) => {
    const p = document.createElement("div");
    p.className = "unlocked-planet";
    p.innerHTML = `<div style="font-size: 24px">${planet.image}</div><div class="unlocked-planet-name">${planet.name}</div>`;
    div.appendChild(p); // Add each unlocked planet to the display
  });
}

// Initialize coin display and first question
updateCoinDisplay();
generateQuestion();

// If the first planet is already unlocked, initialize empire with it
if (planetsData.length > 0 && planetsData[0].unlocked) {
  unlockedPlanets.push(planetsData[0]);
  updateUnlockedPlanetsDisplay();
  currentPlanet = planetsData[0].name;
  document.getElementById("expand-empire-button").style.display = "block";
} else if (planetsData.length > 0) {
  // If not, show planet selection screen
  showPlanetSelection();
}

// Load background and click sounds
const audio = new Audio("music/mixkit-serene-view-443.wav");
//audio.play();
//audio.loop = true;

const clickSound = new Audio("music/mixkit-sci-fi-click-900.wav");

// Handle submission of math answer
document
  .getElementById("submit-answer-button")
  .addEventListener("click", () => {
    //audio.play(); // Play background music
    //audio.loop = true;
    clickSound.play(); // Play click sound
    clickSound.volume = 0.1;
    window.submitAnswer(); // Submit the answer
  });

// Sound for expanding the empire
const expandSound = new Audio("music/mixkit-interface-device-click-2577.wav");

// When expand button is clicked, show planet selection
document
  .getElementById("expand-empire-button")
  .addEventListener("click", showPlanetSelection);

console.log("Attempting to play music"); // Debug log

// Invasion settings
const invasionChance = 0.4; // 40% chance of invasion after conquering a planet
let isUnderAttack = false;
let invadingPlanet = null;

// Random chance to trigger an invasion
function checkInvasionEvent() {
  if (
    Math.random() < invasionChance &&
    unlockedPlanets.length > 1 &&
    !isUnderAttack
  ) {
    startInvasion();
  }
}

// Initiates an invasion event
function startInvasion() {
  isUnderAttack = true;

  // Select a random unlocked planet as the target
  const targetPlanetIndex = Math.floor(Math.random() * unlockedPlanets.length);
  const targetPlanet = unlockedPlanets[targetPlanetIndex];

  // Select a random locked planet as the invader
  const availableInvaders = planetsData.filter(
    (p) => !unlockedPlanets.some((up) => up.name === p.name)
  );

  if (availableInvaders.length > 0) {
    const invaderIndex = Math.floor(Math.random() * availableInvaders.length);
    invadingPlanet = availableInvaders[invaderIndex];

    // Notify user of invasion
    feedbackElement.textContent = `⚠️ ${invadingPlanet.name} is planning an attack on ${targetPlanet.name}!`;
    showInvasionPopup(targetPlanet, invadingPlanet); // Show invasion UI
  } else {
    isUnderAttack = false;
  }
}

// Displays the invasion popup and handles the challenge logic
function showInvasionPopup(target, invader) {
  let attemptCount = 0;
  const challenge = generateMathChallenge();

  const popupContainer = document.createElement("div");
  popupContainer.id = "invasion-popup";
  Object.assign(popupContainer.style, {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#222",
    color: "#eee",
    padding: "20px",
    borderRadius: "8px",
    zIndex: "1000",
    border: "2px solid red",
    textAlign: "center",
  });

  // Display alert and challenge
  const message = document.createElement("p");
  message.textContent = `🚨 Invasion Alert! 🚨\n${invader.name} is eyeing your planet ${target.name}!`;
  popupContainer.appendChild(message);

  const challengeElement = document.createElement("p");
  challengeElement.textContent = challenge.question;
  popupContainer.appendChild(challengeElement);

  // Input field for user to enter answer
  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = "Enter your answer";
  input.style.margin = "10px";
  popupContainer.appendChild(input);

  // Feedback for user's answer
  const localFeedback = document.createElement("p");
  localFeedback.style.marginTop = "10px";
  popupContainer.appendChild(localFeedback);

  // Button to submit answer and defend planet
  const answerButton = createButton("Defend with Math!", () => {
    const userAnswer = parseFloat(input.value);

    if (Math.abs(userAnswer - challenge.answer) < 0.01) {
      // Correct answer: defense successful
      localFeedback.textContent = `✅ Correct! You defended ${target.name} with brainpower!`;
      feedbackElement.textContent = `🛡️ ${target.name} was successfully defended against ${invader.name}.`;
      closeInvasionPopup();
    } else {
      attemptCount++;
      if (attemptCount === 1) {
        localFeedback.textContent = `❌ Incorrect. You get one more try or choose an alternate path.`;
      } else {
        // Failed both attempts
        localFeedback.textContent = `❌ Still incorrect. Choose how to handle the invasion.`;
        feedbackElement.textContent = `🛑 Failed math defense! ${target.name} is at risk. Choose your next move.`;
        answerButton.disabled = true;
        input.disabled = true;
        popupContainer.appendChild(fallbackOptions(target, localFeedback));
      }
    }
  });

  popupContainer.appendChild(answerButton);
  document.body.appendChild(popupContainer);
}
// Generate a random fractions or decimals word problem
function generateMathChallenge() {
  // Array of different word problem templates using fractions and decimals
  const templates = [
    () => {
      const numerator = Math.floor(Math.random() * 3) + 1; // 1 to 3
      const denominator = 4;
      const decimal = parseFloat((Math.random() * 0.4 + 0.1).toFixed(2)); // 0.1 to 0.5
      const total = numerator / denominator + decimal;
      return {
        question: `If you ate ${numerator}/${denominator} of a pizza and your friend ate ${decimal}, how much pizza did you both eat in total?`,
        answer: parseFloat(total.toFixed(2)), // round total to 2 decimal places
      };
    },
    () => {
      const miles1 = parseFloat((Math.random() * 2 + 0.5).toFixed(2)); // 0.5 to 2.5 miles
      const miles2 = parseFloat((Math.random() * 2 + 1).toFixed(2)); // 1 to 3 miles
      const total = miles1 + miles2;
      return {
        question: `You ran ${miles1} miles on Monday and ${miles2} miles on Tuesday. How far did you run in total?`,
        answer: parseFloat(total.toFixed(2)),
      };
    },
    () => {
      const numerator = Math.floor(Math.random() * 4) + 1; // 1 to 4
      const denominator = 5;
      const decimal = parseFloat((Math.random() * 0.3 + 0.2).toFixed(2)); // 0.2 to 0.5
      const total = numerator / denominator + decimal;
      return {
        question: `Emma drank ${numerator}/${denominator} of a bottle of juice. Her brother drank ${decimal} of the bottle. How much did they drink together?`,
        answer: parseFloat(total.toFixed(2)),
      };
    },
    () => {
      const numerator = Math.floor(Math.random() * 4) + 1; // 1 to 4
      const denominator = 10;
      const decimal = parseFloat((Math.random() * 0.3 + 0.3).toFixed(2)); // 0.3 to 0.6
      const total = numerator / denominator + decimal;
      return {
        question: `You have ${numerator}/${denominator} of a dollar and find ${decimal} dollars more. How much do you have now?`,
        answer: parseFloat(total.toFixed(2)),
      };
    },
    () => {
      const sugar = parseFloat((Math.random() * 0.6 + 0.2).toFixed(2)); // 0.2 to 0.8
      const milkNumerator = 1;
      const milkDenominator = 4;
      const total = sugar + milkNumerator / milkDenominator;
      return {
        question: `A recipe needs ${sugar} cups of sugar and ${milkNumerator}/${milkDenominator} cup of milk. What’s the total liquid amount?`,
        answer: parseFloat(total.toFixed(2)),
      };
    },
  ];

  // Randomly select a template to generate a question
  const randomTemplate =
    templates[Math.floor(Math.random() * templates.length)];
  return randomTemplate();
}

// Create and return buttons to offer tribute or surrender when math defense fails
function fallbackOptions(target, feedbackTarget) {
  const container = document.createElement("div");
  container.style.display = "flex";
  container.style.gap = "10px";
  container.style.justifyContent = "center";
  container.style.marginTop = "10px";

  // Button to offer tribute (pay 10% of coins)
  const giveCoinsButton = createButton("Offer Tribute", () => {
    const tributeAmount = Math.ceil(coins * 0.1); // Calculate 10% tribute
    if (coins >= tributeAmount) {
      coins -= tributeAmount;
      updateCoinDisplay(); // Reflect updated coin count
      feedbackTarget.textContent = `Paid ${tributeAmount} coins as tribute. For now...`;
      feedbackElement.textContent = `💰 Tribute paid to ${invadingPlanet.name}. ${target.name} is safe.`;
      closeInvasionPopup(); // Close the popup
    } else {
      feedbackTarget.textContent = "Not enough coins to pay tribute!";
    }
  });

  // Button to surrender the planet
  const givePlanetButton = createButton(`Surrender ${target.name}`, () => {
    unlockedPlanets = unlockedPlanets.filter((p) => p.name !== target.name); // Remove planet from unlocked list
    updateUnlockedPlanetsDisplay(); // Refresh display
    feedbackTarget.textContent = `${target.name} has been surrendered!`;
    feedbackElement.textContent = `🪐 ${target.name} has been surrendered to ${invadingPlanet.name}.`;
    closeInvasionPopup(); // Close the popup
  });

  // Append both buttons to the container
  container.appendChild(giveCoinsButton);
  container.appendChild(givePlanetButton);

  return container;
}

// Close the invasion popup and reset state
function closeInvasionPopup() {
  const popup = document.getElementById("invasion-popup");
  if (popup) {
    document.body.removeChild(popup); // Remove popup from DOM
    isUnderAttack = false; // Reset invasion state
    invadingPlanet = null;
  }
}

// Helper function to create styled buttons with click event
function createButton(text, onClick) {
  const button = document.createElement("button");
  button.textContent = text;
  button.style.padding = "10px 15px";
  button.style.borderRadius = "5px";
  button.style.backgroundColor = "#4CAF50";
  button.style.color = "white";
  button.style.border = "none";
  button.style.cursor = "pointer";
  button.addEventListener("click", onClick); // Set click behavior
  return button;
}

// Reference to the main feedback element in the DOM
const feedbackElement = document.getElementById("feedback");

document.getElementById("start-button").addEventListener("click", () => {
  audio.play();
  audio.loop = true;
  audio.volume = 0.05;
  // Hide start screen
  document.getElementById("start-screen").style.display = "none";
  // Show game panels
  document.body.classList.remove("game-not-started");
});
