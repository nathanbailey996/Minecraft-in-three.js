import * as THREE from 'three'
import {PointerLockControls} from 'three/examples/jsm/controls/PointerLockControls'
import Experience from "../Experience";
import Environment from './Environment'
import Terrain from './Terrain'
import Controls from './Controls';
import Water from './Water';
import AddingRemovingBlocks from './AddingRemovingBlocks';
import CreatePrevWorld from './CreatePrevWorld';
import EscapeMenu from './EscapeMenu';

export default class World{
    constructor(){
this.experience = new Experience()


 this.experience.loaders.on('ready', ()=>{
    this.loadWorld()

 })

}

loadWorld(){
    //CREATING A NEW WORLD
    this.pointerLock = new PointerLockControls(this.experience.camera.instance, document.body)
    const newGameButton = document.querySelector('#new-game')
    this.loadingScreen = document.querySelector('.loading-screen')

    const createWorld = ()=>{
        this.loadingScreen.style.display = 'none'
        this.pointerLock.lock()
        this.setWorld()
        newGameButton.removeEventListener('click', createWorld)
    }
    newGameButton.addEventListener('click', createWorld)

    //CREATING A WORLD SAVED BY THE USER
    const loadGameButton = document.querySelector('#load-game')

    const loadSavedWorld = ()=>{
        this.loadingScreen.style.display = 'none'
        const savedWorldsScreen = document.querySelector('.saved-worlds-section')
        savedWorldsScreen.style.display = 'flex'
        savedWorldsScreen.style.zIndex = '5'
        this.previousWorld = new CreatePrevWorld()
        this.setWorld()

        loadGameButton.removeEventListener('click', loadSavedWorld)
    }
    loadGameButton.addEventListener('click', loadSavedWorld)

    this.controlsLockTime = null
    //SETTING THE GAME MENU
    this.setMenu = ()=>{
        this.escapeMenu = new EscapeMenu()
        this.controlsLockTime = this.experience.time.elapsed
    // this.pointerLock.removeEventListener('unlock', this.setMenu)

    }
    this.pointerLock.addEventListener('unlock', this.setMenu)

}

setWorld(){
this.environment = new Environment()
this.terrain = new Terrain()

this.controls = new Controls()
this.water = new Water()
this.addingRemovingBlocks = new AddingRemovingBlocks()
}

update(){
    if(this.controls){
        this.controls.update()
    }
    
    if(this.terrain){
        this.terrain.update()
    }
    
    if(this.addingRemovingBlocks){
        this.addingRemovingBlocks.update()
    }
    if(this.water){
        this.water.update()
    }
}

}