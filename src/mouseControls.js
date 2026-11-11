/* Created by Alexander Pen
this is the file that instantiates the mouse controls so the player can look around */

import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js'; // Import PointerLockControls

export function mouseSetup(camera, gameCanvas) { // PointerLock Controls (for mouse look)
  if (!camera || !gameCanvas) {
    throw new Error("mouseSetup requires a valid camera and DOM element"); // if not there
  }

  const pointerControls = new PointerLockControlsWithSensitivity(camera, gameCanvas); // create pointer lock controls 
  // - it requires a camera and the DOM element to capture mouse events from

  return pointerControls; // return the controls so they can be used elsewhere
}

class PointerLockControlsWithSensitivity extends PointerLockControls { // extend PointerLockControls to add sensitivity
  constructor(camera, domElement, sensitivity = 0.002) {
    super(camera, domElement);
    this.sensitivity = sensitivity; // Default sensitivity

    this.object.rotation.order = 'YXZ'; // Set rotation order to YXZ for proper pitch and yaw handling

    // Mouse move event listener

    domElement.addEventListener('mousemove', (event) => {
      if (!this.isLocked) return;

      const movementX = event.movementX || 0; // horizontal movement
      const movementY = event.movementY || 0; // vertical movement

      // Yaw (horizontal rotation)
      this.object.rotation.y -= movementX * this.sensitivity;

      // Pitch (vertical rotation) with clamp
      this.object.rotation.x -= movementY * this.sensitivity;
      this.object.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.object.rotation.x)); // Clamp between -90 and +90 degrees
    });
  }
}