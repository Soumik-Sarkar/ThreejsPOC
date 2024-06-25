import * as THREE from "three";
import { MindARThree } from "mindar-image-three";

const mindarThree = new MindARThree({
  container: document.querySelector("#container"),
  imageTargetSrc: "targets.mind",
});
const { renderer, scene, camera } = mindarThree;
const anchor = mindarThree.addAnchor(0);
const geometry = new THREE.BoxGeometry(1, 1, 1);
//const geometry = new THREE.PlaneGeometry(1, 0.55);
const material = new THREE.MeshBasicMaterial({
  color: 0x00ffff,
  transparent: true,
  opacity: 0.5,
});
const plane = new THREE.Mesh(geometry, material);
anchor.group.add(plane);

const isMobileDevice = () => /Mobi|Android/i.test(navigator.userAgent);
const isIOS = () => /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

const getVideoConstraints = () => {
  if (isIOS()) {
    return {
      video: {
        facingMode: { exact: "environment" },
      },
    };
  } else if (isMobileDevice()) {
    return {
      video: {
        facingMode: { exact: "environment" },
      },
    };
  } else {
    return {
      video: {
        facingMode: "user",
      },
    };
  }
};


const start = async () => {
  // await mindarThree.start();
  // renderer.setAnimationLoop(() => {
  //   renderer.render(scene, camera);
  // });
  try {
    const stream = await navigator.mediaDevices.getUserMedia(getVideoConstraints());
    const video = document.createElement("video");
    video.srcObject = stream;
    await video.play();

    // Use the video stream in MindAR
    mindarThree.video = video;
    await mindarThree.start();

    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
    });
  } catch (err) {
    console.error("Error accessing the camera: ", err);
  }
};
// const startButton = document.querySelector("#startButton");
// startButton.addEventListener("click", () => {
  start();
// });
// stopButton.addEventListener("click", () => {
//   mindarThree.stop();
//   mindarThree.renderer.setAnimationLoop(null);
// });
