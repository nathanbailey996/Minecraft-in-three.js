import * as THREE from 'three'
import Experience from '../Experience'

export default class Renderer{
    constructor(){
        this.experience = new Experience()

        this.setRenderer()

    
    }

    setRenderer(){
        this.debugObject = {color:0x6EB1FF}

       this.renderer = new THREE.WebGLRenderer({
           canvas:this.experience.canvas
       })
       this.renderer.outputEncoding = THREE.sRGBEncoding
       this.renderer.physicallyCorrectLights = true
       this.renderer.shadowMap.enabled = true
       this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
       this.renderer.toneMapping = THREE.CineonToneMapping
       this.renderer.toneMappingExposure = 1.25
       this.renderer.setClearColor(this.debugObject.color)
       this.renderer.setSize(this.experience.sizes.width, this.experience.sizes.height)
       this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

       //dat.gui
       if(this.experience.debug.active){
        this.debugFolder = this.experience.debug.gui.addFolder('sky')
        
        this.debugFolder.addColor(this.debugObject, 'color').onChange(()=>{
            this.renderer.setClearColor(new THREE.Color(this.debugObject.color))
        })
    }
          
     

    }

    resize(){
        this.renderer.setSize(this.experience.sizes.width, this.experience.sizes.height)
       this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    }

    update(){
        this.renderer.render(this.experience.scene, this.experience.camera.instance)
    }
    

}