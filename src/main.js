/* Created by Alexander Pen
this is the main file that the code runs from */
import * as THREE from 'three'; // Importing the Three.js library
import { setupScene } from './setup.js'; // Importing all js files for better organization
import { mouseSetup } from './mouseControls.js';
import { worldSetup, addLight, addSkillWalls, removeAllWalls } from './worldSetup.js';
import { Target, EasyStaticTarget, EasyDynamicTarget, 
        MediumStaticTarget, MediumDynamicTarget, 
        HardStaticTarget, HardDynamicTarget, scenarioTarget } from './target.js';
import { menu } from './menu.js';
import { settings } from './settings.js';
import { addScenarioWalls, camIntersection, removeAllBoxes } from "./scenarioSetup.js";
import './authentication.js';

const { scene, camera, renderer } = setupScene(); // setup scene, camera, renderer
const controls = mouseSetup(camera, document.body); // setup 3D mouse controls
const clock = new THREE.Clock(); // clock to track time between frames
const raycaster = new THREE.Raycaster(); // for detecting if we hit a target
const mouse = new THREE.Vector2(0, 0); // mouse at center of screen for raycaster

// game variables
let targets = [];
let maxTargets = 5;
let lastSpawn = 0;
let targetSpawnTime = 0.1; // seconds between spawn
let startRoundCountdown = 5; // seconds to countdown before round starts

// counters for stats
let hitCounter = 0;
let shotCounter = 0;
let roundStartTime = 0;
let roundDuration = 30; 

//Pause variables
let pauseStartTime = 0;
let totalPausedTime = 0;
let isPaused = false;
let previousGameMode = null; // to store the mode before pausing

// Movement variables
const camSpeed = 10;
const keysPressed = {}; 

// game state
let gameRunning = false;
let gameMode = "";
let specificMode = "";
let targetType = EasyStaticTarget; // default target type
let modeWalls = [];

let scenarioCounter = 0; // for scenario testing

menu(scene, controls, clock, (isGameRunning, mode, walls, targetClass, time, specific) => {
  gameRunning = isGameRunning;
  gameMode = mode;
  specificMode = specific;
  targetType = targetClass;
  roundStartTime = time;
  modeWalls = walls
}); // pass controls to menu for locking/unlocking, and a callback to update gameRunning. And also type of mode


settings(camera, controls); // setup settings functionality
// setup
worldSetup(scene);
addLight(scene);
keyControls();
animate();

window.addEventListener('resize', adjustCamera); // adjust camera and renderer on window resize
document.addEventListener('mousedown', hitsTarget); // on click check if we hit a target

// Listen for pointer lock changes to pause the game when pointer lock is lost. When the user presses escape to unlock the mouse it will pause the game
document.addEventListener('pointerlockchange', () => {
  const isLocked = document.pointerLockElement === document.body;

  if (isLocked && previousGameMode && !gameRunning) {
    // Resuming from pause
    document.getElementById("pauseMenu").style.display = "none";
    document.getElementById("crosshair").style.display = "block";
    gameMode = previousGameMode;
    gameRunning = true;
    isPaused = false;

    totalPausedTime += clock.getElapsedTime() - pauseStartTime;
  }

  // Only set previousGameMode if pausing from a running state
  if (!isLocked && gameRunning) {
    
    const pauseMenu = document.getElementById('pauseMenu'); // Show pause menu if it exists
    if (pauseMenu) {
      pauseMenu.style.display = 'flex';
      document.getElementById("crosshair").style.display = "none";
    }

    pauseStartTime = clock.getElapsedTime(); // record time when paused
    isPaused = true;
    previousGameMode = gameMode; // store the mode string ("skill" or "scenario")
    gameRunning = false;
  }
});

document.getElementById("resumeBtn").addEventListener("click", () => {
  if (previousGameMode && !gameRunning) {
    controls.lock(); // pointer lock will trigger resume logic above
  }
});

document.getElementById("resetBtn").addEventListener("click", () => {
  if (!gameRunning) {
    // reset counters
    totalPausedTime = 0;
    pauseStartTime = clock.getElapsedTime();
    hitCounter = 0;
    shotCounter = 0;
    roundStartTime = clock.getElapsedTime();
    scenarioCounter = 0;
    // removal of stuff in scene
    removeAllTargets();
    camera.position.set(0,4,0);
    camera.lookAt(0, 4, -1);

    document.getElementById("startRoundTimer").style.display = "block";
    document.getElementById("duringRoundTimer").style.display = "none";

    controls.lock()
  } 
});

document.getElementById("backToLibraryBtn").addEventListener("click", () => {
  if (!gameRunning) {
    gameRunning = false; 
    isPaused = false;
    totalPausedTime = 0; 

    // reset counters
    hitCounter = 0;
    shotCounter = 0;
    roundStartTime = 0;
    maxTargets = 5;
    // removal of stuff in scene
    removeAllTargets();
    removeAllWalls(scene, modeWalls);
    modeWalls = [];
    camera.position.set(0,4,0);
    camera.lookAt(0, 4, -1);

    document.getElementById("pauseMenu").style.display = "none";
    document.getElementById("library").style.display = "flex";
    document.getElementById("crosshair").style.display = "none";
    document.getElementById("game-canvas").style.display = "none";
    document.getElementById("startRoundTimer").style.display = "none";
    document.getElementById("duringRoundTimer").style.display = "none";
  } 
});


function animate() { 
  requestAnimationFrame(animate);
  const delta = clock.getDelta(); // Only call ONCE per frame

  if (((gameMode === "accuracy") || (gameMode === "curvedDynamic")) && gameRunning) {

    if (clock.getElapsedTime() - roundStartTime - totalPausedTime > startRoundCountdown) {
      document.getElementById("startRoundTimer").style.display = "none";
      document.getElementById("duringRoundTimer").style.display = "block";
      duringRoundTimer();

      spawnTarget(targetType); // Test to spawn target every frame
      moveTargets(delta); // move targets every frame
      renderer.render(scene, camera); // render scene

      if (clock.getElapsedTime() - roundStartTime - totalPausedTime - startRoundCountdown > roundDuration) { // end game after roundDuration seconds
        document.getElementById("duringRoundTimer").style.display = "none";
        scoreScreen();
      }

    } else {
      startTimer();
      renderer.render(scene, camera); // render scene
    }

  } else if (gameMode === "scenario" && gameRunning) {

    if (clock.getElapsedTime() - roundStartTime - totalPausedTime > startRoundCountdown) {
      document.getElementById("startRoundTimer").style.display = "none";

      if (scenarioCounter === 0) { // spawn scenario targets on the first frame then no others
        // room 1
        spawnScenarioTarget(new THREE.Vector3(0, 5, -40));
        spawnScenarioTarget(new THREE.Vector3(10, 8, -40));
        spawnScenarioTarget(new THREE.Vector3(-10, 8, -40));
        spawnScenarioTarget(new THREE.Vector3(10, 2, -40));
        spawnScenarioTarget(new THREE.Vector3(-10, 2, -40));
        // room 2
        spawnScenarioTarget(new THREE.Vector3(30, 1, -29));
        spawnScenarioTarget(new THREE.Vector3(30, 1, -11));
        spawnScenarioTarget(new THREE.Vector3(30, 1, -20));
        spawnScenarioTarget(new THREE.Vector3(35, 5, -29));
        spawnScenarioTarget(new THREE.Vector3(35, 5, -11));
        spawnScenarioTarget(new THREE.Vector3(35, 5, -20));
        spawnScenarioTarget(new THREE.Vector3(40, 8, -29));
        spawnScenarioTarget(new THREE.Vector3(40, 8, -11));
        spawnScenarioTarget(new THREE.Vector3(40, 8, -20));

        // room 3
        spawnScenarioTarget(new THREE.Vector3(56, 5, 18));
        spawnScenarioTarget(new THREE.Vector3(74, 5, 18));
        spawnScenarioTarget(new THREE.Vector3(65, 5, 18));
        spawnScenarioTarget(new THREE.Vector3(65, 9, 18));
        spawnScenarioTarget(new THREE.Vector3(65, 1, 18));
        spawnScenarioTarget(new THREE.Vector3(56, 5, -58));
        spawnScenarioTarget(new THREE.Vector3(74, 5, -58));
        spawnScenarioTarget(new THREE.Vector3(65, 5, -58));
        spawnScenarioTarget(new THREE.Vector3(65, 9, -58));
        spawnScenarioTarget(new THREE.Vector3(65, 1, -58));

        // room 4
        spawnScenarioTarget(new THREE.Vector3(80, 2, -58));
        spawnScenarioTarget(new THREE.Vector3(85, 5, -58));
        spawnScenarioTarget(new THREE.Vector3(90, 7, -56));
        spawnScenarioTarget(new THREE.Vector3(95, 4, -54));
        spawnScenarioTarget(new THREE.Vector3(100, 2, -52));
        spawnScenarioTarget(new THREE.Vector3(103, 4, -50));
        spawnScenarioTarget(new THREE.Vector3(106, 7, -47));
        spawnScenarioTarget(new THREE.Vector3(108, 4, -43));
        spawnScenarioTarget(new THREE.Vector3(110, 2, -40));
        spawnScenarioTarget(new THREE.Vector3(110, 4, -36));
        spawnScenarioTarget(new THREE.Vector3(110, 7, -32));
        spawnScenarioTarget(new THREE.Vector3(110, 4, -28));
        spawnScenarioTarget(new THREE.Vector3(110, 2, -24));
        spawnScenarioTarget(new THREE.Vector3(110, 4, -20));
        spawnScenarioTarget(new THREE.Vector3(110, 7, -16));
        spawnScenarioTarget(new THREE.Vector3(110, 4, -12));
        spawnScenarioTarget(new THREE.Vector3(110, 2, -8));
        spawnScenarioTarget(new THREE.Vector3(110, 4, -4));
        spawnScenarioTarget(new THREE.Vector3(110, 7, 0));
        spawnScenarioTarget(new THREE.Vector3(110, 4, 4));
        spawnScenarioTarget(new THREE.Vector3(110, 2, 8));
        spawnScenarioTarget(new THREE.Vector3(108, 4, 11));
        spawnScenarioTarget(new THREE.Vector3(106, 7, 14));
        spawnScenarioTarget(new THREE.Vector3(103, 4, 17));
        spawnScenarioTarget(new THREE.Vector3(95, 2, 19));
        spawnScenarioTarget(new THREE.Vector3(90, 4, 19));
        spawnScenarioTarget(new THREE.Vector3(85, 7, 19));
        spawnScenarioTarget(new THREE.Vector3(80, 4, 19));

      }
      scenarioCounter++;
      

      moveCam(delta); // move player

      renderer.render(scene, camera); // render scene
      
      if (targets.length === 0) { // if all targets are gone
        scoreScreen();
      }

    } else {
      startTimer();
      renderer.render(scene, camera); // render scene
    }

  } else if (gameMode === "flicking" && gameRunning) {
    maxTargets = 3; // only three targets at a time

    if (clock.getElapsedTime() - roundStartTime - totalPausedTime > startRoundCountdown) {
      document.getElementById("startRoundTimer").style.display = "none";
      document.getElementById("duringRoundTimer").style.display = "block";
      duringRoundTimer();

      spawnTarget(targetType); // Test to spawn target every frame
      checkLifespan(delta); // check if any targets have exceeded their lifespan and remove them

      renderer.render(scene, camera); // render scene

      if (clock.getElapsedTime() - roundStartTime - totalPausedTime - startRoundCountdown > roundDuration) { // end game after roundDuration seconds
        scoreScreen();
      }
    } else {
      startTimer();
      renderer.render(scene, camera); // render scene
    }


  } else if (gameMode === "singularTracking" && gameRunning) {

    if (clock.getElapsedTime() - roundStartTime - totalPausedTime > startRoundCountdown) {
      document.getElementById("startRoundTimer").style.display = "none";
      document.getElementById("duringRoundTimer").style.display = "block";
      duringRoundTimer();

      maxTargets = 1;

      spawnTarget(targetType); // Test to spawn target every frame
      updateTrackingTarget(delta); // update tracking targets
      checkTrackingTargets(delta); // check if crosshair is aiming at a target

      highlightHoveredTarget(); // highlight target if crosshair is on it

      renderer.render(scene, camera); // render scene

      if (clock.getElapsedTime() - roundStartTime - totalPausedTime - startRoundCountdown > roundDuration) {
        scoreScreen();
      }
    } else {
      startTimer();
      renderer.render(scene, camera); // render scene
    }

  } else if (gameMode === "multipleTracking" && gameRunning) {

    if (clock.getElapsedTime() - roundStartTime - totalPausedTime > startRoundCountdown) {
      document.getElementById("startRoundTimer").style.display = "none";
      document.getElementById("duringRoundTimer").style.display = "block";
      duringRoundTimer();

      spawnTarget(targetType); // Test to spawn target every frame
      updateTrackingTarget(delta); // update tracking targets
      checkTrackingTargets(delta); // check if crosshair is aiming at a target
      checkLifespan(delta); // check if any targets have exceeded their lifespan and remove them

      highlightHoveredTarget(); // highlight target if crosshair is on it

      renderer.render(scene, camera); // render scene

      if (clock.getElapsedTime() - roundStartTime - totalPausedTime - startRoundCountdown > roundDuration) {
        scoreScreen();
      }    
    } else {
      startTimer();
      renderer.render(scene, camera); // render scene
    }
  }
}

function keyControls() { // setup key controls - for movement 
  document.addEventListener('keydown', e => { //
    const key = e.key.toLowerCase();
    keysPressed[key] = true;
  });

  document.addEventListener('keyup', e => {
    keysPressed[e.key.toLowerCase()] = false;
  });
}

function moveCam(delta) {  // Move camera based on keys pressed 
  if (!controls.isLocked) return;
  // Delta is the time between frames

  if (keysPressed['w']) {
    controls.moveForward(camSpeed * delta);
    if (camIntersection(camera.position)) controls.moveForward(-camSpeed * delta); // move back if intersecting
  }
  if (keysPressed['s']) {
    controls.moveForward(-camSpeed * delta);
    if (camIntersection(camera.position)) controls.moveForward(camSpeed * delta); // move back if intersecting
  }
  if (keysPressed['a']) {
    controls.moveRight(-camSpeed * delta);
    if (camIntersection(camera.position)) controls.moveRight(camSpeed * delta); // move back if intersecting
  }
  if (keysPressed['d']) {
    controls.moveRight(camSpeed * delta);
    if (camIntersection(camera.position)) controls.moveRight(-camSpeed * delta); // move back if intersecting
  }
}

function adjustCamera() { // Adjust camera and renderer on window resize
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}


function spawnTarget(targetType) { // spawn a target of type targetType if less than maxTargets in scene
  const now = clock.getElapsedTime();

  if ((now - lastSpawn) > targetSpawnTime && targets.length < maxTargets) { // spawn a target every targetSpawnTime seconds 

    if (gameMode !== "flicking") {
      const t = new targetType(); // create a target of type targetType
      t.addToScene(scene); // add target to scene
      targets.push(t); // add target to array
      lastSpawn = now; // update last spawn time

    } else {
      let validDistance = false;
      let counter = 0;

      while (!validDistance && counter < 10) { // try to find a valid position for the target, but only try 10 times
        counter++;
        const t = new targetType(); // create a target of type targetType

        if (isFarEnough(t.mesh.position)) {
          validDistance = true;
          t.addToScene(scene); // add target to scene
          targets.push(t); // add target to array
          lastSpawn = now; // update last spawn time
        }
      }
    }
  }
}

function moveTargets(delta) { // move all targets in array
  for (let t of targets) {
    if (gameMode === "accuracy") {
      t.moveTarget(delta);
    } else if (gameMode === "curvedDynamic") { // curved dynamic mode different update function
      t.update(delta);
      if (t.alive === false) {
        removeTarget(t.mesh);
      }
    }
  }
}

function removeTarget(Mesh) { // remove target from scene and array
  let found = null;
  for (let i = 0; i < targets.length; i++) {
    if (targets[i].mesh === Mesh) { //search for specific target with this mesh
      found = targets[i];
      break;
    }
  }
  if (found) { // if found remove it
    found.removeFromScene(scene);
    const targetIndex = targets.indexOf(found);
    targets.splice(targetIndex, 1); // remove from array
  } else {
  }
}

function hitsTarget(){ // check if crosshair is aiming at a target
  if (!gameRunning) return;
  if (!controls.isLocked) return; // do nothing if game is paused
  if (gameMode === "singularTracking" || gameMode === "multipleTracking") return; // do nothing in tracking mode

  shotCounter++;

  raycaster.setFromCamera(mouse, camera);

  const hits = raycaster.intersectObjects(scene.children);

  for (let i = 0; i < hits.length; i++) { // only remove first target hit so no double hits
    const obj = hits[i].object;

    if (obj.geometry.type === "SphereGeometry"){ //
      removeTarget(obj);
      hitCounter++; 
      break;
    }
  }
}

function removeAllTargets() { // remove all targets from scene and array
  for (let t of targets) {
    t.removeFromScene(scene);
  }
  targets = [];
}

function spawnScenarioTarget(position) { // spawn a scenario target at a specific position
  const t = new scenarioTarget(position);
  targets.push(t);
  t.addToScene(scene);
}

function isFarEnough(position) { // check if position is far enough from all existing targets
  if (targets.length === 0) return true; // if no targets, always valid
  for (let t of targets) {
    const dist = position.distanceTo(t.mesh.position);
    if (dist < 7) { // if less than 7 units away from any target, return false
      return false;
    }
  }
  return true;
}

function checkLifespan(delta) { // check lifespan of all targets and remove if exceeded
  for (let t of targets) {
    if (t.checkLifespan(delta)) {
      removeTarget(t.mesh);
    }
  }
}

function updateTrackingTarget(delta) { // update all tracking targets
  for (let t of targets) {
    t.update(delta);
  }
}

function checkTrackingTargets(delta) { // check if crosshair is aiming at a target - for tracking mode
  if (!gameRunning) return;
  if (!controls.isLocked) return; // do nothing if game is paused

  shotCounter += 10 * delta;

  raycaster.setFromCamera(mouse, camera);

  const hits = raycaster.intersectObjects(scene.children);

  for (let i = 0; i < hits.length; i++) { // only remove first target hit so no double hits
    const obj = hits[i].object;

    if (obj.geometry.type === "SphereGeometry"){
      hitCounter += 10 * delta; // give more points for tracking targets, scaled by time between frames
      break;
    }
  }
}

function scoreScreen() { // end game and show score screen
  gameRunning = false;
  // load score screen
  document.getElementById("crosshair").style.display = "none";
  document.getElementById("score").style.display = "flex";
  document.getElementById("game-canvas").style.display = "none";

  document.getElementById("duringRoundTimer").style.display = "none";

  // change stats
  if (shotCounter === 0) {
    document.getElementById("totalShotsFired").innerText = shotCounter;
    shotCounter = 1; // avoid div by 0
  } else {
    document.getElementById("totalShotsFired").innerText = shotCounter;
  }

  if (gameMode === "singularTracking" || gameMode === "multipleTracking") {
    document.getElementById("totalHitH1").innerText = "Score: "; // change heading for tracking modes
    document.getElementById("totalShotH1").innerText = "Score  missed: "; // change heading for tracking modes
    document.getElementById("totalTargetsHit").innerText = hitCounter.toFixed(2);
    document.getElementById("totalShotsFired").innerText = (shotCounter - hitCounter).toFixed(2);
    document.getElementById("overallAccuracy").innerText = ((hitCounter / shotCounter) * 100).toFixed(2) + "%"; // format to 2 decimal places

  } else {
    document.getElementById("totalHitH1").innerText = "Total Targets Hit: "; // change heading back
    document.getElementById("totalShotH1").innerText = "Total Shots Fired: "; // change heading back
    document.getElementById("overallAccuracy").innerText = ((hitCounter / shotCounter) * 100).toFixed(2) + "%"; // format to 2 decimal places
    document.getElementById("totalTargetsHit").innerText = hitCounter;
  }

  if (gameMode === "scenario") {
    let completionTime = clock.getElapsedTime() - roundStartTime - totalPausedTime - startRoundCountdown; // find time spent
    document.getElementById("totalTimePlayed").innerText = completionTime.toFixed(2) + " seconds";
  } else {
    document.getElementById("totalTimePlayed").innerText = roundDuration + " seconds";
  }

  controls.unlock(); // unlock mouse

  console.log(`Mode: ${gameMode}, Hits: ${hitCounter}, Shots: ${shotCounter}, Accuracy: ${(hitCounter / shotCounter) * 100}%`);
  logScoreToServer(specificMode, hitCounter, (hitCounter / shotCounter) * 100);

  // reset counters
  hitCounter = 0;
  shotCounter = 0;
  roundStartTime = 0;
  totalPausedTime = 0;
  maxTargets = 5;
  // removal of stuff in scene
  removeAllTargets();
  removeAllWalls(scene, modeWalls);
  removeAllBoxes(scene);
  modeWalls = [];

  camera.lookAt(0, 4, -1);
  camera.position.set(0,4,0);
}

function highlightHoveredTarget(){
  if (!gameRunning) return;
  if (!controls.isLocked) return;
  
  // Raycast from camera through center of screen
  raycaster.setFromCamera(mouse, camera); 

  // find intersections with all objects in the scene
  const hits = raycaster.intersectObjects(scene.children);

  // Reset all targets to original color (red)
  for (let t of targets) {
    t.mesh.material.color.set(0xFF0000);
  }

  // If hovering over a target, set its color to green
  for (let i = 0; i < hits.length; i++) {
    const obj = hits[i].object;

    if (obj.geometry.type === "SphereGeometry"){
      obj.material.color.set(0x00ff00 );
      break;
    }
  }
}

function startTimer() { // countdown timer before round starts
  if (!gameRunning) return;
  let time = clock.getElapsedTime() - roundStartTime - totalPausedTime; // time since round started minus paused time
  let remaining = Math.max(0, startRoundCountdown - time); // remaining time
  document.getElementById("startRoundTimerText").innerText = remaining.toFixed(1);
}

function duringRoundTimer() { // timer during round
  if (!gameRunning) return;
  let time = clock.getElapsedTime() - roundStartTime - totalPausedTime - startRoundCountdown; // time since round started minus paused time and countdown
  let remaining = Math.max(0, roundDuration - time); // remaining time
  document.getElementById("duringRoundTimerText").innerText = remaining.toFixed(1);
}

// Log score to server
async function logScoreToServer(mode, score, accuracy) {
  // Get auth token from local storage
  const authToken = localStorage.getItem('authToken');
  if (!authToken) {
    console.warn('No auth token found, cannot log score.');
    return;
  }

  // Send score to server
  try {
    const res = await fetch('http://localhost:3000/api/score', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}` 
      },
      body: JSON.stringify({ mode, score, accuracy})
    });

    const data = await res.json();

    if (res.ok) {
      console.log('Score logged successfully:', data);
    } else {
      console.error('Failed to log score:', data.error);
    }
  } catch (err) {
    console.error('Error logging score to server:', err);
  }
}