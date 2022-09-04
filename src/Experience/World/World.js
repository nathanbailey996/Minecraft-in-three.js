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
import Sky from './Sky';

export default class World{
    constructor(){
this.experience = new Experience()


 this.experience.loaders.on('ready', ()=>{
    this.previousWorld = new CreatePrevWorld()
    this.terrain = new Terrain()
    this.addingRemovingBlocks = new AddingRemovingBlocks()
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
        this.loadingScreen.style.display = '1'
        this.previousWorld.openForm()
        newGameButton.removeEventListener('click', createWorld)
    }
    newGameButton.addEventListener('click', createWorld)

    //CREATING A WORLD SAVED BY THE USER
    const loadGameButton = document.querySelector('#load-game')

    const loadSavedWorld = ()=>{
        this.previousWorld.openSavedWorldSection()

        loadGameButton.removeEventListener('click', loadSavedWorld)
    }
    loadGameButton.addEventListener('click', loadSavedWorld)

    this.controlsLockTime = null
    //SETTING THE GAME MENU
    this.setMenu = ()=>{
        if(!this.previousWorld.isPlayerInGameMenu){
        this.escapeMenu = new EscapeMenu()
        this.controlsLockTime = this.experience.time.elapsed
        this.previousWorld.isPlayerInGameMenu = true
        console.log('controls unlocked')
        }
    }
    this.pointerLock.addEventListener('unlock', this.setMenu)

    this.pointerLock.addEventListener('lock', ()=>{
        console.log('controls locked')
    })

}


setWorld(){
this.environment = new Environment()
this.controls = new Controls()
this.water = new Water()
this.sky = new Sky()
}

//UPDATE FUNCTION
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
    if(this.sky){
        this.sky.update()
    }
}

}