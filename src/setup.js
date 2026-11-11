/* Created by Alexander Pen
this is the setup file this code sets up the scene camera and renderer so the game can be seen */

import * as THREE from 'three'; // Import the entire THREE namespace

export function setupScene() {
  const scene = new THREE.Scene(); // Create a new scene

  const camera = new THREE.PerspectiveCamera( // create a perspective camera so the player can see the 3D world
    75, // fov = 75
    window.innerWidth / window.innerHeight, // aspect ratio
    0.1, // near plane
    500 // far plane
  ); 
  camera.position.y = 4; // lift cam a bit higher for better view simulate eye level

  const renderer = new THREE.WebGLRenderer({ antialias: true }); // create a renderer
  renderer.setSize(window.innerWidth, window.innerHeight); // set size to full window

  document.getElementById('game-canvas').appendChild(renderer.domElement); // add renderer to the html document

  return { scene, camera, renderer };
}