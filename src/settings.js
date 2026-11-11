/* Created by Alexander Pen
this is the settings file handles all the functionality for the settings */

export function settings(camera, controls) { // handles all the functionality for the settings page
	const colorPicker = document.getElementById('crosshairColourInput'); // gets the colour wheel input 
	const sizePicker = document.getElementById('crosshairSizeInput');// gets the size input 
	const crosshair = document.getElementById('crosshair');// gets the crosshair the player uses 
	const crosshairPreview = document.getElementById('crosshairPreview');// gets the preview the player sees

	const sensPicker = document.getElementById('sensitivityInput'); // gets the sensitivity input
	const fovPicker = document.getElementById('fovInput'); // gets the fov input
	const sensDisplay = document.getElementById('sensitivityDisplay'); // gets the sensitivity display
	const fovDisplay = document.getElementById('fovDisplay'); // gets the fov display

	colorPicker.addEventListener('input', (e) => { // if the colour is changed it is  displayed to the preview
		if (crosshairPreview) {
			crosshairPreview.style.color = e.target.value;
		}
	});

	sizePicker.addEventListener('input', (e) => { // if the size is changed it is  displayed to the preview
		const size = e.target.value + 'px';
		if (crosshairPreview) {
			crosshairPreview.style.fontSize = size;
		}
	});

	document.getElementById("defaultPreset").addEventListener("click", () => { // changes the preview preset to a +
		if (crosshairPreview) {
			crosshairPreview.textContent = '+';
		}
	});

	document.getElementById("dotPreset").addEventListener("click", () => { // changes the preview preset to a •
		if (crosshairPreview) {
			crosshairPreview.textContent = '•';
		}
	});

	document.getElementById("saveCrosshairBtn").addEventListener("click", () => { // saves the preview settings to the actual crosshair if the save button is clicked
		crosshair.style.color = colorPicker.value;
		crosshair.style.fontSize = sizePicker.value + 'px';
		if (crosshairPreview) {
			crosshair.textContent = crosshairPreview.textContent;
		}
	});


	sensPicker.addEventListener('input', (e) => { // if the sensitivity is changed it is displayed to the display
		document.getElementById('sensitivityDisplay').textContent = e.target.value + 'x';
	})

	fovPicker.addEventListener('input', (e) => { // if the fov is changed it is displayed to the display
		document.getElementById('fovDisplay').textContent = e.target.value;
	})

	document.getElementById("saveUserOptionsBtn").addEventListener("click", () => { // saves the preview settings to the actual crosshair if the save button is clicked
		camera.fov = document.getElementById('fovDisplay').textContent;
		camera.updateProjectionMatrix();
		controls.sensitivity = 0.002 * parseFloat(document.getElementById('sensitivityDisplay').textContent.replace('x', ''));
	});
}