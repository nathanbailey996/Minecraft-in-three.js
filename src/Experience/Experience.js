import * as THREE from 'three'
import Time from './Utils/Time'
import Sizes from './Utils/Sizes'
import Camera from './Utils/Camera'
import Renderer from './Utils/Renderer'
import assets from '../assets'
import Loaders from './Utils/Loaders'
import World from './World/World'
import Debug from './Utils/Debug'
import Firebase from '../Firebase'


let instance = null
export default class Experience{
    constructor(_canvas){
        if(instance){
            return instance
        }
        instance = this

        //utils
        this.scene = new THREE.Scene()
        this.canvas = _canvas
        this.time = new Time()
        this.sizes = new Sizes()
        this.debug = new Debug()
        this.camera = new Camera()
        this.renderer = new Renderer()
        this.assets = assets
        this.loaders = new Loaders(assets)
        // this.firebase = new Firebase()


        this.world = new World()


     


        this.time.on('tick', ()=>{
            this.update()
        })

        this.sizes.on('resize', ()=>{
            this.resize()
        })

    }



    update(){
        this.renderer.update()
        this.debug.update()
        if(this.world){
        this.world.update()
        }
        
        
    }

    resize(){
this.camera.resize()
this.renderer.resize()
    }
}