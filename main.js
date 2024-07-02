import * as THREE from "three";
import { MindARThree } from "mindar-image-three";

const mindarThree = new MindARThree({
  container: document.querySelector("#container"),
  imageTargetSrc: "targets.mind",
});
const { renderer, scene, camera } = mindarThree;
const anchor = mindarThree.addAnchor(0);
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial();
const plane = new THREE.Mesh(geometry, material);
plane.isRotating = false; // Define the isRotating property
anchor.group.add(plane);

const start = async () => {
  try {
    const constraints = {
      video: {
        facingMode: isMobileDevice() ? { exact: "environment" } : "user",
      },
    };

    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    const video = document.createElement("video");
    video.srcObject = stream;
    await video.play();

    // Use the video stream in MindAR
    mindarThree.video = video;
    await mindarThree.start();

    renderer.setAnimationLoop(() => {
      scene.traverse((obj) => {
        if (obj.isRotating) {
          obj.rotation.x += 0.01;
          obj.rotation.y += 0.01;
        }
      });

      renderer.render(scene, camera);
    });
  } catch (err) {
    console.error("Error accessing the camera: ", err);
  }
};

const isMobileDevice = () => {
  return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
};

const changeRandomColor = () => {
  const randomColor = Math.floor(Math.random() * 16777215).toString(16);
  plane.material.color.setHex(`0x${randomColor}`);
};

const changeWhiteColor = () => {
  plane.material.color.setHex(`0xffffff`);
};

document.getElementById("whiteColorButton").addEventListener("click", changeWhiteColor);
document.getElementById("randomColorButton").addEventListener("click", changeRandomColor);

// Raycaster for detecting clicks
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onMouseClick(event) {
  // Convert mouse coordinates to normalized device coordinates (-1 to +1) for both components
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

  // Update the picking ray with the camera and mouse position
  raycaster.setFromCamera(mouse, camera);

  // Calculate objects intersecting the picking ray
  const intersects = raycaster.intersectObjects(scene.children, true);

  if (intersects.length > 0) {
    const object = intersects[0].object;

    if (object.geometry.type === 'BoxGeometry') {
      // Toggle rotation
      object.isRotating = !object.isRotating;
    } else if (object.geometry.type === 'SphereGeometry') {
      // Change color
      object.material.color.set(Math.random() * 0xffffff);
    }
  }
}

// Function to handle touch events
function onTouch(event) {
  event.preventDefault(); // Prevent default touch events like scrolling

  // Simulate a mouse click event
  const touch = event.changedTouches[0];
  const mouseEvent = new MouseEvent("click", {
    clientX: touch.clientX,
    clientY: touch.clientY
  });
  onMouseClick(mouseEvent);
}

document.addEventListener('click', onMouseClick);
document.addEventListener('touchstart', onTouch, { passive: false });

start();
