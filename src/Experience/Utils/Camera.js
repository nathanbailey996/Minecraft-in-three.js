import * as THREE from 'three'
import Experience from '../Experience'

export default class Camera{
    constructor(){
        this.experience = new Experience()

        this.setCamera()
    }

    setCamera(){
        this.instance = new THREE.PerspectiveCamera(75, this.experience.sizes.width / this.experience.sizes.height, 0.1, 200)
        this.instance.lookAt(new THREE.Vector3())
    
        
        this.experience.scene.add(this.instance)

    }

    resize(){
        this.instance.aspect = this.experience.sizes.width / this.experience.sizes.height
        this.instance.updateProjectionMatrix()
    }



   
}