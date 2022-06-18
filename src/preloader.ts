import * as THREE from "three";
/**
 * Preloader from: https://codepen.io/Vico-Adomeit/pen/mOwgNW
 * Another interesting option: https://jsfiddle.net/sojzu8a5/1/
 */
const preloader = document.querySelector("#preloader") as HTMLElement;
const downloadInfo = document.querySelector(".download-info") as HTMLElement;
const itemsCount = document.querySelector(".items-count") as HTMLElement;

const loadingManager = THREE.DefaultLoadingManager;

loadingManager.onLoad = () => {
    downloadInfo.innerText = "Loading complete";
    setTimeout(() => {
        preloader.classList.add('fade-out');
        preloader.addEventListener('transitionend', () => {
            preloader.remove();
        })
    }, 500)
}

loadingManager.onProgress = (url: string, itemsLoaded: number, itemsTotal: number) => {
    // Some files might be base64 encoded, so the URL will fill the entire screen
    // if it's not trimmed.
    const fileURL = url.length >= 300 ? url.slice(0, 80) + "..." : url;
    const filesText = itemsLoaded > 1 ? "files" : "file";
    
    downloadInfo.innerText = `Downloading ${fileURL}...`;
    itemsCount.innerText = `${itemsLoaded} ${filesText} out of ${itemsTotal}`;
}

loadingManager.onError = (url) => console.error(`Error loading ${url}`);