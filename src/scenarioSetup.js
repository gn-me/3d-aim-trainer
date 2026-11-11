/* Created by Alexander Pen
this is the file for the setup of the scenatio gamemode*/
import * as THREE from 'three'; // Importing the Three.js library

const wallBoxes = []; // global array for this file that contains all the wall boxes for collision detection

export function addScenarioWalls(scene) { // this function creates the walls whilst adding them to the scene and also adding them to a collision detection array
    const wallMaterial = new THREE.MeshBasicMaterial({ color: 0x808080, side: THREE.DoubleSide }); // material all walls have - grey
    const walls = []; // array that holds all the walls so you can remove them easier

    const wall1Geometry = new THREE.PlaneGeometry(30, 20);
    const wall1 = new THREE.Mesh(wall1Geometry, wallMaterial);
    wall1.position.set(0, 0, -50);
    scene.add(wall1);
    walls.push(wall1);
    wallBoxes.push(new THREE.Box3().setFromObject(wall1));

    const wall2Geometry = new THREE.PlaneGeometry(20, 20);
    const wall2 = new THREE.Mesh(wall2Geometry, wallMaterial);
    wall2.position.set(15, 0, 0);
    wall2.rotation.y = -Math.PI / 2;
    scene.add(wall2);
    walls.push(wall2);
    wallBoxes.push(new THREE.Box3().setFromObject(wall2));

    const wall3Geometry = new THREE.PlaneGeometry(60, 20);
    const wall3 = new THREE.Mesh(wall3Geometry, wallMaterial);
    wall3.position.set(-15, 0, -20);
    wall3.rotation.y = Math.PI / 2;
    scene.add(wall3);
    walls.push(wall3);
    wallBoxes.push(new THREE.Box3().setFromObject(wall3));

    const wall4Geometry = new THREE.PlaneGeometry(30, 20);
    const wall4 = new THREE.Mesh(wall4Geometry, wallMaterial);
    wall4.position.set(0, 0, 10);
    wall4.rotation.y = Math.PI;
    scene.add(wall4);
    walls.push(wall4);
    wallBoxes.push(new THREE.Box3().setFromObject(wall4));

    const wall5Geometry = new THREE.PlaneGeometry(20, 20);
    const wall5 = new THREE.Mesh(wall5Geometry, wallMaterial);
    wall5.position.set(15, 0, -40);
    wall5.rotation.y = -Math.PI / 2;
    scene.add(wall5);
    walls.push(wall5);
    wallBoxes.push(new THREE.Box3().setFromObject(wall5));

    const wall6Geometry = new THREE.PlaneGeometry(40, 20);
    const wall6 = new THREE.Mesh(wall6Geometry, wallMaterial);
    wall6.position.set(35, 0, -30);
    scene.add(wall6);
    walls.push(wall6);
    wallBoxes.push(new THREE.Box3().setFromObject(wall6));

    const wall7Geometry = new THREE.PlaneGeometry(40, 20);
    const wall7 = new THREE.Mesh(wall7Geometry, wallMaterial);
    wall7.position.set(35, 0, -10);
    scene.add(wall7);
    walls.push(wall7);
    wallBoxes.push(new THREE.Box3().setFromObject(wall7));

    const wall8Geometry = new THREE.PlaneGeometry(30, 20);
    const wall8 = new THREE.Mesh(wall8Geometry, wallMaterial);
    wall8.position.set(55, 0, -45);
    wall8.rotation.y = -Math.PI / 2;
    scene.add(wall8);
    walls.push(wall8);
    wallBoxes.push(new THREE.Box3().setFromObject(wall8));

    const wall9Geometry = new THREE.PlaneGeometry(30, 20);
    const wall9 = new THREE.Mesh(wall9Geometry, wallMaterial);
    wall9.position.set(55, 0, 5);
    wall9.rotation.y = -Math.PI / 2;
    scene.add(wall9);
    walls.push(wall9);
    wallBoxes.push(new THREE.Box3().setFromObject(wall9));

    const wall10Geometry = new THREE.PlaneGeometry(30, 20);
    const wall10 = new THREE.Mesh(wall10Geometry, wallMaterial);
    wall10.position.set(75, 0, -45);
    wall10.rotation.y = -Math.PI / 2;
    scene.add(wall10);
    walls.push(wall10);
    wallBoxes.push(new THREE.Box3().setFromObject(wall10));

    const wall11Geometry = new THREE.PlaneGeometry(30, 20);
    const wall11 = new THREE.Mesh(wall11Geometry, wallMaterial);
    wall11.position.set(75, 0, 5);
    wall11.rotation.y = -Math.PI / 2;
    scene.add(wall11);
    walls.push(wall11);
    wallBoxes.push(new THREE.Box3().setFromObject(wall11));

    const wall12Geometry = new THREE.PlaneGeometry(20, 20);
    const wall12 = new THREE.Mesh(wall12Geometry, wallMaterial);
    wall12.position.set(65, 0, -60);
    scene.add(wall12);
    walls.push(wall12);
    wallBoxes.push(new THREE.Box3().setFromObject(wall12));

    const wall13Geometry = new THREE.PlaneGeometry(20, 20);
    const wall13 = new THREE.Mesh(wall13Geometry, wallMaterial);
    wall13.position.set(65, 0, 20);
    scene.add(wall13);
    walls.push(wall13);
    wallBoxes.push(new THREE.Box3().setFromObject(wall13));

    const wall14Geometry = new THREE.PlaneGeometry(40, 20);
    const wall14 = new THREE.Mesh(wall14Geometry, wallMaterial);
    wall14.position.set(95, 0, -60);
    scene.add(wall14);
    walls.push(wall14);
    wallBoxes.push(new THREE.Box3().setFromObject(wall14));

    const wall15Geometry = new THREE.PlaneGeometry(80, 20);
    const wall15 = new THREE.Mesh(wall15Geometry, wallMaterial);
    wall15.position.set(115, 0, -20);
    wall15.rotation.y = -Math.PI / 2;
    scene.add(wall15);
    walls.push(wall15);
    wallBoxes.push(new THREE.Box3().setFromObject(wall15));

    const wall16Geometry = new THREE.PlaneGeometry(40, 20);
    const wall16 = new THREE.Mesh(wall16Geometry, wallMaterial);
    wall16.position.set(95, 0, 20);
    scene.add(wall16);
    walls.push(wall16);
    wallBoxes.push(new THREE.Box3().setFromObject(wall16));

    return walls;
}

export function camIntersection(cameraPos) { // Check if camera intersects with any walls 
    const camBox = new THREE.Box3().setFromCenterAndSize(cameraPos, new THREE.Vector3(1, 2, 1));
    for (let wallBox of wallBoxes) {
        if (wallBox.intersectsBox(camBox)) {
            return true; // Collision detected
        }
    }
    return false; // No collision
} 

export function removeAllBoxes(scene) { // removes all boxes in scene
    for (let wallBox of wallBoxes) {
        scene.remove(wallBox);
    }
}