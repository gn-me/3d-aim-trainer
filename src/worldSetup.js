/* Created by Alexander Pen
this is the worldsetup file this code sets up the world that the user sees */
import * as THREE from 'three'; // Import the entire THREE namespace
export function worldSetup(scene) { // setup the world the player sees
  const floorGeometry = new THREE.PlaneGeometry(500, 500); // large plane for the floor
  const floorMaterial = new THREE.MeshBasicMaterial({ 
    color: 0x7CFC00,
    side: THREE.DoubleSide 
  });

  const floor = new THREE.Mesh(floorGeometry, floorMaterial); // create the floor mesh
  floor.rotation.x = Math.PI / 2; // rotate to be horizontal

  scene.add(floor); // add floor to the scene
  scene.background = new THREE.Color(0x87CEEB); // set background to sky blue
}



export function addLight(scene) { // adds light to the scene 
  const ambient = new THREE.AmbientLight(0xffffff, 0.2); // soft white light
  scene.add(ambient); // add ambient light to the scene
  
  const sun = new THREE.DirectionalLight(0xffffff, 0.5); // directional light to simulate sun
  sun.position.set(1, 1, 1); // position the light

  scene.add(sun);
}

export function addSkillWalls(scene) { // adds walls for skill mode
  const wallMaterial = new THREE.MeshBasicMaterial({ color: 0x808080, side: THREE.DoubleSide }); // all walls have the same material - grey walls 

  let skillWalls = []; // array to hold the walls so they can be removed later

  // Creating walls around the player not infront so they can still see targets
  const wall1Geometry = new THREE.PlaneGeometry(100, 20); 
  const wall1 = new THREE.Mesh(wall1Geometry, wallMaterial);
  wall1.position.set(50, 10, 0);
  wall1.rotation.y = -Math.PI / 2;
  scene.add(wall1);
  skillWalls.push(wall1);

  const wall2Geometry = new THREE.PlaneGeometry(100, 20); 
  const wall2 = new THREE.Mesh(wall2Geometry, wallMaterial);
  wall2.position.set(0, 10, 50);
  wall2.rotation.y = Math.PI;
  scene.add(wall2);
  skillWalls.push(wall2);

  const wall3Geometry = new THREE.PlaneGeometry(100, 20); 
  const wall3 = new THREE.Mesh(wall3Geometry, wallMaterial);
  wall3.position.set(-50, 10, 0);
  wall3.rotation.y = Math.PI / 2;
  scene.add(wall3);
  skillWalls.push(wall3);

  return skillWalls;
}

export function removeAllWalls(scene, walls) { // removes all wall in an array given from the scene
  for (let wall of walls) {
    scene.remove(wall);
  }
}