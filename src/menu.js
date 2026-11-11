/* Created by Alexander Pen
this is the file for the functionality of the menu */
import { EasyDynamicTarget, EasyStaticTarget, HardDynamicTarget, HardStaticTarget, MediumDynamicTarget, MediumStaticTarget, scenarioTarget } from "./target";
import { EasyFlickingTarget, MediumFlickingTarget, HardFlickingTarget } from "./flickingTarget.js";

import { EasySingularTrackingTarget, MediumSingularTrackingTarget,
	HardSingularTrackingTarget, EasyMultipleTrackingTarget, 
	MediumMultipleTrackingTarget, HardMultipleTrackingTarget } from "./trackingTarget.js";

import { EasyCurvedDynamicTarget, MediumCurvedDynamicTarget, HardCurvedDynamicTarget } from "./curveTarget.js";


import { addSkillWalls } from './worldSetup.js';
import { addScenarioWalls } from "./scenarioSetup.js";

let openedFromPauseMenu = false; // track if settings was opened from pause menu

// Setup menu interactions
export function menu(scene, controls, clock, gameRunning) {
	// Library buttons

	document.getElementById("libraryBtn").addEventListener("click", () => { // open library
		document.getElementById("menu").style.display = "none";
		document.getElementById("library").style.display = "flex";
	});

	document.getElementById("closeLibraryBtn").addEventListener("click", () => { // close library
		document.getElementById("menu").style.display = "flex";
		document.getElementById("library").style.display = "none";
	});

	// Help button

	document.getElementById("helpBtn").addEventListener("click", () => { // open help menu
		document.getElementById("menu").style.display = "none";
		document.getElementById("helpMenu").style.display = "flex";
	});

	document.getElementById("closeHelpBtn").addEventListener("click", () => { // close help menu
		document.getElementById("menu").style.display = "flex";
		document.getElementById("helpMenu").style.display = "none";
	});


	// Accuracy mode buttons

	document.getElementById("staticEasy").addEventListener("click", () => { // start static easy game
		document.getElementById("library").style.display = "none";
		document.getElementById("crosshair").style.display = "block";
		document.getElementById("game-canvas").style.display = "block";
		document.getElementById("startRoundTimer").style.display = "block";

		if (gameRunning) {
			let walls = addSkillWalls(scene);
			gameRunning("true", "accuracy", walls, EasyStaticTarget, clock.getElapsedTime(), "staticEasy");
		}

		controls.lock();
	});

	document.getElementById("dynamicEasy").addEventListener("click", () => { // start dynamic easy game
		document.getElementById("library").style.display = "none";
		document.getElementById("crosshair").style.display = "block";
		document.getElementById("game-canvas").style.display = "block";
		document.getElementById("startRoundTimer").style.display = "block";

		if (gameRunning) {
			let walls = addSkillWalls(scene);
			gameRunning("true", "accuracy", walls, EasyDynamicTarget, clock.getElapsedTime(), "dynamicEasy");
		}
		controls.lock();
	});

	document.getElementById("staticMedium").addEventListener("click", () => { // start static medium game
		document.getElementById("library").style.display = "none";
		document.getElementById("crosshair").style.display = "block";
		document.getElementById("game-canvas").style.display = "block";
		document.getElementById("startRoundTimer").style.display = "block";

		if (gameRunning) {
			let walls = addSkillWalls(scene);
			gameRunning("true", "accuracy", walls, MediumStaticTarget, clock.getElapsedTime(), "staticMedium");
		}
		controls.lock();
	});

	document.getElementById("dynamicMedium").addEventListener("click", () => { // start dynamic medium game
		document.getElementById("library").style.display = "none";
		document.getElementById("crosshair").style.display = "block";
		document.getElementById("game-canvas").style.display = "block";
		document.getElementById("startRoundTimer").style.display = "block";

		if (gameRunning) {
			let walls = addSkillWalls(scene);
			gameRunning("true", "accuracy", walls, MediumDynamicTarget, clock.getElapsedTime(), "dynamicMedium");
		}
		controls.lock();
	});

	document.getElementById("staticHard").addEventListener("click", () => { // start static hard game
		document.getElementById("library").style.display = "none";
		document.getElementById("crosshair").style.display = "block";
		document.getElementById("game-canvas").style.display = "block";
		document.getElementById("startRoundTimer").style.display = "block";

		if (gameRunning) {
			let walls = addSkillWalls(scene);
			gameRunning("true", "accuracy", walls, HardStaticTarget, clock.getElapsedTime(), "staticHard");
		}
		controls.lock();
	});

	document.getElementById("dynamicHard").addEventListener("click", () => { // start dynamic hard game
		document.getElementById("library").style.display = "none";
		document.getElementById("crosshair").style.display = "block";
		document.getElementById("game-canvas").style.display = "block";
		document.getElementById("startRoundTimer").style.display = "block";

		if (gameRunning) {
			let walls = addSkillWalls(scene);
			gameRunning("true", "accuracy", walls, HardDynamicTarget, clock.getElapsedTime(), "dynamicHard");
		}
		controls.lock();
	});

	// Curved Dynamic mode buttons

	document.getElementById("curvedDynamicEasy").addEventListener("click", () => { // start curved dynamic easy game
		document.getElementById("library").style.display = "none";
		document.getElementById("crosshair").style.display = "block";
		document.getElementById("game-canvas").style.display = "block";
		document.getElementById("startRoundTimer").style.display = "block";

		if (gameRunning) {
			let walls = addSkillWalls(scene);
			gameRunning("true", "curvedDynamic", walls, EasyCurvedDynamicTarget, clock.getElapsedTime(), "curvedDynamicEasy");
		}
		controls.lock();
	});

	document.getElementById("curvedDynamicMedium").addEventListener("click", () => { // start curved dynamic medium game
		document.getElementById("library").style.display = "none";
		document.getElementById("crosshair").style.display = "block";
		document.getElementById("game-canvas").style.display = "block";
		document.getElementById("startRoundTimer").style.display = "block";

		if (gameRunning) {
			let walls = addSkillWalls(scene);
			gameRunning("true", "curvedDynamic", walls, MediumCurvedDynamicTarget, clock.getElapsedTime(), "curvedDynamicMedium");
		}
		controls.lock();
	});

	document.getElementById("curvedDynamicHard").addEventListener("click", () => { // start curved dynamic hard game
		document.getElementById("library").style.display = "none";
		document.getElementById("crosshair").style.display = "block";
		document.getElementById("game-canvas").style.display = "block";
		document.getElementById("startRoundTimer").style.display = "block";

		if (gameRunning) {
			let walls = addSkillWalls(scene);
			gameRunning("true", "curvedDynamic", walls, HardCurvedDynamicTarget, clock.getElapsedTime(), "curvedDynamicHard");
		}
		controls.lock();
	});

	// Flicking mode buttons

	document.getElementById("flickingEasy").addEventListener("click", () => { // start dynamic hard game
		document.getElementById("library").style.display = "none";
		document.getElementById("crosshair").style.display = "block";
		document.getElementById("game-canvas").style.display = "block";
		document.getElementById("startRoundTimer").style.display = "block";

		if (gameRunning) {
			let walls = addSkillWalls(scene);
			gameRunning("true", "flicking", walls, EasyFlickingTarget, clock.getElapsedTime(), "flickingEasy");
		}
		controls.lock();
	});

	document.getElementById("flickingMedium").addEventListener("click", () => { // start dynamic hard game
		document.getElementById("library").style.display = "none";
		document.getElementById("crosshair").style.display = "block";
		document.getElementById("game-canvas").style.display = "block";
		document.getElementById("startRoundTimer").style.display = "block";

		if (gameRunning) {
			let walls = addSkillWalls(scene);
			gameRunning("true", "flicking", walls, MediumFlickingTarget, clock.getElapsedTime(), "flickingMedium");
		}
		controls.lock();
	});

	document.getElementById("flickingHard").addEventListener("click", () => { // start dynamic hard game
		document.getElementById("library").style.display = "none";
		document.getElementById("crosshair").style.display = "block";
		document.getElementById("game-canvas").style.display = "block";
		document.getElementById("startRoundTimer").style.display = "block";

		if (gameRunning) {
			let walls = addSkillWalls(scene);
			gameRunning("true", "flicking", walls, HardFlickingTarget, clock.getElapsedTime(), "flickingHard");
		}
		controls.lock();
	});

	// Tracking mode buttons
	// singular tracking buttons

	document.getElementById("singularTrackingEasy").addEventListener("click", () => { // start dynamic hard game
		document.getElementById("library").style.display = "none";
		document.getElementById("crosshair").style.display = "block";
		document.getElementById("game-canvas").style.display = "block";
		document.getElementById("startRoundTimer").style.display = "block";

		if (gameRunning) {
			let walls = addSkillWalls(scene);
			gameRunning("true", "singularTracking", walls, EasySingularTrackingTarget, clock.getElapsedTime(), "singularTrackingEasy");
		}
		controls.lock();
	});

	document.getElementById("singularTrackingMedium").addEventListener("click", () => { // start dynamic hard game
		document.getElementById("library").style.display = "none";
		document.getElementById("crosshair").style.display = "block";
		document.getElementById("game-canvas").style.display = "block";
		document.getElementById("startRoundTimer").style.display = "block";

		if (gameRunning) {
			let walls = addSkillWalls(scene);
			gameRunning("true", "singularTracking", walls, MediumSingularTrackingTarget, clock.getElapsedTime(), "singularTrackingMedium");
		}
		controls.lock();
	});

	document.getElementById("singularTrackingHard").addEventListener("click", () => { // start dynamic hard game
		document.getElementById("library").style.display = "none";
		document.getElementById("crosshair").style.display = "block";
		document.getElementById("game-canvas").style.display = "block";
		document.getElementById("startRoundTimer").style.display = "block";

		if (gameRunning) {
			let walls = addSkillWalls(scene);
			gameRunning("true", "singularTracking", walls, HardSingularTrackingTarget, clock.getElapsedTime(), "singularTrackingHard");
		}
		controls.lock();
	});

	// multiple tracking buttons

	document.getElementById("multipleTrackingEasy").addEventListener("click", () => { // start dynamic hard game
		document.getElementById("library").style.display = "none";
		document.getElementById("crosshair").style.display = "block";
		document.getElementById("game-canvas").style.display = "block";
		document.getElementById("startRoundTimer").style.display = "block";

		if (gameRunning) {
			let walls = addSkillWalls(scene);
			gameRunning("true", "multipleTracking", walls, EasyMultipleTrackingTarget, clock.getElapsedTime(), "multipleTrackingEasy");
		}
		controls.lock();
	});

	document.getElementById("multipleTrackingMedium").addEventListener("click", () => { // start dynamic hard game
		document.getElementById("library").style.display = "none";
		document.getElementById("crosshair").style.display = "block";
		document.getElementById("game-canvas").style.display = "block";
		document.getElementById("startRoundTimer").style.display = "block";

		if (gameRunning) {
			let walls = addSkillWalls(scene);
			gameRunning("true", "multipleTracking", walls, MediumMultipleTrackingTarget, clock.getElapsedTime(), "multipleTrackingMedium");
		}
		controls.lock();
	});

	document.getElementById("multipleTrackingHard").addEventListener("click", () => { // start dynamic hard game
		document.getElementById("library").style.display = "none";
		document.getElementById("crosshair").style.display = "block";
		document.getElementById("game-canvas").style.display = "block";
		document.getElementById("startRoundTimer").style.display = "block";

		if (gameRunning) {
			let walls = addSkillWalls(scene);
			gameRunning("true", "multipleTracking", walls, HardMultipleTrackingTarget, clock.getElapsedTime(), "multipleTrackingHard");
		}
		controls.lock();
	});


	// start scenario mode

	document.getElementById("roomClearingBtn").addEventListener("click", () => { 
		document.getElementById("library").style.display = "none";
		document.getElementById("crosshair").style.display = "block";
		document.getElementById("game-canvas").style.display = "block";
		document.getElementById("startRoundTimer").style.display = "block";

		let walls = addScenarioWalls(scene);
		if (gameRunning) {
			gameRunning("true", "scenario", walls, scenarioTarget, clock.getElapsedTime(), "scenario");
		}
		controls.lock();
	});

 // Score close button

	document.getElementById("closeScoreBtn").addEventListener("click", () => { // close score screen
		document.getElementById("score").style.display = "none";
		document.getElementById("menu").style.display = "flex";
	});

	// Settings buttons

	document.getElementById("settingsBtn").addEventListener("click", () => { // open settings
		document.getElementById("menu").style.display = "none";
		document.getElementById("settings").style.display = "flex";
	});

	document.getElementById("modeToSettingsBtn").addEventListener("click", () => {
		openedFromPauseMenu = true; // settings opened from pause menu 
		document.getElementById("pauseMenu").style.display = "none";
		document.getElementById("settings").style.display = "flex";
	});

	document.getElementById("closeSettingsBtn").addEventListener("click", () => { // close settings
		document.getElementById("settings").style.display = "none";

		if (openedFromPauseMenu) { // return to pause menu if opened from there
			document.getElementById("pauseMenu").style.display = "flex";
			openedFromPauseMenu = false;
		} else { // else return to main menu
			document.getElementById("menu").style.display = "flex";
		}
	});

	// relock the player if they click escape and then click back on the screen
	document.getElementById('game-canvas').addEventListener('click', () => { 
		if (!controls.isLocked) {
			controls.lock();
		}
	});

	// Help button
	document.getElementById('closeHelpBtn').addEventListener('click', () => {
		document.getElementById('helpMenu').style.display = 'none';
		document.getElementById('menu').style.display = 'flex';
	});

	// Stats button

	document.getElementById('statsBtn').addEventListener('click', () => {
		const token = localStorage.getItem('authToken');
		if (!token) { // Not logged in
			alert('You are not logged in. Please log in to view your profile.');
			return;
		}
		document.getElementById('menu').style.display = 'none';
		document.getElementById('statsMenu').style.display = 'flex';
	});

	document.getElementById('closeStatsBtn').addEventListener('click', () => {
		document.getElementById('statsMenu').style.display = 'none';
		document.getElementById('menu').style.display = 'flex';
	});

	// Stats Display Button

	document.querySelectorAll('[data-mode-stats]').forEach(btn => {
		btn.addEventListener('click', () => {
			const mode = btn.dataset.modeStats;
			if (mode) {
				fetchAndShowAdvanced(mode);
			}
		});
	});
	
	document.getElementById('closeStatsDisplayBtn').addEventListener('click', () => {
		document.getElementById('statsDisplayMenu').style.display = 'none';
		document.getElementById('statsMenu').style.display = 'flex';
	});

	// Authentication panel buttons
	document.getElementById('signUpBtn').addEventListener('click', () => {
		document.getElementById('authPanel').style.display = 'flex';
		document.getElementById('menu').style.display = 'none';

		if (localStorage.getItem('authToken')) { // if logged in, hide sign up and login buttons
			document.getElementById('logoutBtn').style.display = 'block';
		}
	});

	document.getElementById('closeAuthBtn').addEventListener('click', () => {
		document.getElementById('authPanel').style.display = 'none';
		document.getElementById('menu').style.display = 'flex';
		document.getElementById('authUser').value = '';
      	document.getElementById('authPass').value = '';
	});

	// Profile panel buttons

	document.getElementById('profileBtn').addEventListener('click', async () => {
		// Get token
		const token = localStorage.getItem('authToken');
		if (!token) { // Not logged in
			alert('You are not logged in. Please log in to view your profile.');
			return;
		}

		// Fetch profile data
		try {
			const res = await fetch('http://localhost:3000/api/profile', {
				method: 'GET',
				headers: { Authorization: `Bearer ${token}` }
			});
			// Check response
			if (!res.ok) {
				throw new Error('Failed to fetch profile');
			}
			// Parse and display profile
			const { user } = await res.json();
			localStorage.setItem('userId', String(user.id));
			showProfile(user.username);

		} catch (err) { // Handle errors
			console.error('Error fetching profile:', err);
			alert('Error fetching profile. Check console for details.');
		}

		// Fetch and display additional stats like total score and accuracy
		try {
			const res = await fetch('http://localhost:3000/api/getScores', {
				method: 'GET',
				headers: { Authorization: `Bearer ${token}` }
			});
			// Check response
			if (!res.ok) {
				throw new Error('Failed to fetch stats');
			}
			// Parse and display stats
			const { totalScore, overallAccuracy, averageScore, count } = await res.json();
			showBaseStats(totalScore, overallAccuracy, averageScore, count);
		} catch (err) { // Handle errors
			console.error('Error fetching stats:', err);
			alert('Error fetching stats. Check console for details.');
		}
	});

	// Close profile button
	document.getElementById('closeProfileBtn').addEventListener('click', () => {
		document.getElementById('profilePanel').style.display = 'none';
		document.getElementById('menu').style.display = 'flex';
	});

	// Logout button

	document.getElementById('logoutBtn').addEventListener('click', () => {
		// Clear local storage
		localStorage.removeItem('authToken');
		localStorage.removeItem('username');
		localStorage.removeItem('userId');
		// Hide logout button
		document.getElementById('logoutBtn').style.display = 'none';
		alert('Logged out successfully.');
	});
}


export function showProfile(username) { // display profile panel
	document.getElementById('menu').style.display = 'none';
	document.getElementById('profilePanel').style.display = 'flex';
	document.getElementById('profileUsername').innerText = `Username: ${username}`;
}

function showBaseStats(totalScore, overallAccuracy, averageScore, count) {
	document.getElementById('profileTotalScore').innerText = `Total Score: ${totalScore}`;
	document.getElementById('profileAccuracy').innerText = `Overall Accuracy: ${overallAccuracy.toFixed(2)}%`;
	document.getElementById('profileScore').innerText = `Average Score: ${averageScore.toFixed(2)}`;
	document.getElementById('profileCount').innerText = `Total Games Played: ${count}`;
}

async function fetchAndShowAdvanced(mode) {
  const token = localStorage.getItem('authToken');
  if (!token) {
    alert('Not logged in. Please log in to view stats.');
    return;
  }

  // Fetch stats from server
  try {
    const res = await fetch(`http://localhost:3000/api/stats?mode=${encodeURIComponent(mode)}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) { // Handle non-OK responses
      const err = await res.json().catch(() => ({}));
      alert(err.error || 'Failed to fetch stats');
      return;
    }
    const data = await res.json();

	// Parse stats
	const highestScore = Number(data.maxScore || 0);
    const averageScore = Number(data.avgScore || 0);
    const averageAccuracyPercent = Number(data.avgAccuracy || 0); // server already multiplies by 100
    const count = Number(data.count || 0);

    // showAdvancedStats 
	document.getElementById('statsDisplayModeName').innerText = `Mode: ${mode}`;
	document.getElementById('statsDisplayHighestScore').innerText = `Highest Score: ${highestScore}`;
	document.getElementById('statsDisplayOverallAccuracy').innerText = `Overall Accuracy: ${averageAccuracyPercent.toFixed(2)}%`;
	document.getElementById('statsDisplayAverageScore').innerText = `Average Score: ${averageScore.toFixed(2)}`;
	document.getElementById('statsDisplayCount').innerText = `Total Games Played: ${count}`;

    // show the stats display
    document.getElementById('statsMenu').style.display = 'none';
    document.getElementById('statsDisplayMenu').style.display = 'flex';


  } catch (err) { // Handle errors
    console.error('Error fetching stats:', err);
    alert('Network or server error. Check console.');
  }
}