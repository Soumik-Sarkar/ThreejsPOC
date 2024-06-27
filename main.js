import * as THREE from "three";
import { MindARThree } from "mindar-image-three";

const mindarThree = new MindARThree({
  container: document.querySelector("#container"),
  imageTargetSrc: "targets (1).mind",
});
const { renderer, scene, camera } = mindarThree;
const anchor = mindarThree.addAnchor(0);
const geometry = new THREE.BoxGeometry(1, 1, 1);
//const geometry = new THREE.PlaneGeometry(1, 0.55);
const material = new THREE.MeshBasicMaterial();
const plane = new THREE.Mesh(geometry, material);
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
      renderer.render(scene, camera);
    });
  } catch (err) {
    console.error("Error accessing the camera: ", err);
  }
};

const isMobileDevice = () => {
  return (
    typeof window.orientation !== "undefined" ||
    navigator.userAgent.indexOf("IEMobile") !== -1
  );
};

start();