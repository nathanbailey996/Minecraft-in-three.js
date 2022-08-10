import * as THREE from 'three'
import Experience from "../Experience";
import Environment from './Environment'
import Terrain from './Terrain'
import Controls from './Controls';
import Water from './Water';
import AddingRemovingBlocks from './AddingRemovingBlocks';

export default class World{
    constructor(){
this.experience = new Experience()

this.environment = new Environment()

 this.experience.loaders.on('ready', ()=>{
    this.setWorld()

 })

}
setWorld(){
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
}

}