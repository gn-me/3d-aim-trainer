/* Created by Alexander Pen
this is the target file - it will contain all the target classes and their functions. */
import * as THREE from 'three'; 

export class Target {
  constructor(pos, radius = 1, color = 0xFF0000, speed = 0) { // default red sphere target
    const geometry = new THREE.SphereGeometry(radius, 32, 32); // sphere geometry
    const material = new THREE.MeshStandardMaterial({ color }); // red standard material 

    this.mesh = new THREE.Mesh(geometry, material); // create the mesh
    this.speed = speed;
    this.angle = (Math.random() * (Math.PI / 3) - (Math.PI / 6)); // random angle between -30 and +30 degrees

    this.leftBoundary = -8;
    this.rightBoundary = 8;
    this.ceilingBoundary = 5; 
    this.floorBoundary = 1; 

    // use random if no position in constructor - so just use random for now for testing
    this.mesh.position.copy(pos || new THREE.Vector3(
      (Math.random() * (this.rightBoundary - this.leftBoundary)) + this.leftBoundary,
      this.floorBoundary + Math.random() * (this.ceilingBoundary - this.floorBoundary),
      (Math.random() * 5) - 15
    ));
  }

  addToScene(scene){
    scene.add(this.mesh);
  }

  removeFromScene(scene){
    scene.remove(this.mesh);
  }

  setSpeed(speed){ // set speed of target
    this.speed = speed;
  }

  setRadius(radius){ // set radius of target
    this.mesh.geometry = new THREE.SphereGeometry(radius, 32, 32);
  }

  moveTarget(delta){
    delta = Math.min(delta, 0.05); // cap delta to avoid big jumps when switching tabs


    //moving the targets x and y based on angle and speed
    this.mesh.position.x += Math.cos(this.angle) * this.speed * delta;
    this.mesh.position.y += Math.sin(this.angle) * this.speed * delta;
    
    if (this.mesh.position.x < this.leftBoundary || this.mesh.position.x > this.rightBoundary){
      this.angle = Math.PI - this.angle; // Bounce off left and right boundarys
    }

    if (this.mesh.position.y < this.floorBoundary || this.mesh.position.y > this.ceilingBoundary){
      this.angle = -this.angle; // Bounce off floor and ceiling boundarys
    }
  }
}

export class EasyStaticTarget extends Target { // uses default target - radius 1 no speed
  constructor() {
    super(); 
  }
}

export class EasyDynamicTarget extends EasyStaticTarget { // extends easy static - adding speed
  constructor() {
    super(); 
    this.setSpeed(5.0);
  }
}

export class MediumStaticTarget extends Target { // uses default target but radius 0.7 no speed
  constructor() {
    super(null, 0.7); 
  }
}

export class MediumDynamicTarget extends MediumStaticTarget { // extends medium static - adding speed
  constructor() {
    super(); 
    this.setSpeed(7.5);
  }
}

export class HardStaticTarget extends Target {// uses default target but radius 0.5 no speed
  constructor() {
    super(null, 0.5); 
  }
}

export class HardDynamicTarget extends HardStaticTarget { // extends hard static - adding speed
  constructor() {
    super(); 
    this.setSpeed(10.0);
  }
}

export class scenarioTarget extends Target { // extends target bu allowing for position placement
  constructor(pos) {
    super(pos, 1); 
  }
}
