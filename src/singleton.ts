import * as THREE from 'three';

import SimulatedSpace from 'components/simulated-space';
import Planet from 'components/planet';
import {AxesHelper} from 'three';
import * as fs from "fs";

export default class Singleton {

    public texturePacks:any;

    constructor() {
        // let m ;
        this.texturePacks = {
            earth : {
                colorMap : new THREE.TextureLoader().load('./earth_color.jpg') ,
                bumpMap : new THREE.TextureLoader().load('./earth_bump.jpg') ,
                aoMap : new THREE.TextureLoader().load('./earth_ao.jpg'),
                emissiveMap : new THREE.TextureLoader().load('./earth_emissive.jpg'),
                metalnessMap : new THREE.TextureLoader().load('./earth_metalness.jpg')

            },
            mars : {
                colorMap : new THREE.TextureLoader().load('./mars_color.jpg'),
                bumpMap : new THREE.TextureLoader().load('./mars_bumpMap.jpg'),
                aoMap : new THREE.TextureLoader().load('./mars_aoMap.jpg'),
                emissiveMap : new THREE.TextureLoader().load('./mars_emissiveMap.jpg'),
                metalnessMap : new THREE.TextureLoader().load('./mars_metalnessMap.jpg')
            },
            jupiter : {
                colorMap : new THREE.TextureLoader().load('./jupiter_color.jpg'),
                bumpMap : new THREE.TextureLoader().load('./jupiter_bumpMap.jpg'),
                aoMap : new THREE.TextureLoader().load('./jupiter_aoMap.jpg'),
                emissiveMap : new THREE.TextureLoader().load('./jupiter_emissiveMap.jpg'),
                metalnessMap : new THREE.TextureLoader().load('./jupiter_metalnessMap.jpg')
            },
        }
    }


}