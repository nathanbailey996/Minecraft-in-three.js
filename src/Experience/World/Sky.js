import * as THREE from 'three'
import Experience from '../Experience'

export default class Sky{
    constructor(){
        this.experience = new Experience()
 
        this.setSky()
    }

    setSky(){
        this.sky = {}
        this.sky.geometry = new THREE.BoxBufferGeometry(50, 5,30)
        this.sky.material = new THREE.MeshBasicMaterial({color:0xffffff})
        this.sky.count = 9
        this.sky.instancedMesh = new THREE.InstancedMesh(this.sky.geometry, this.sky.material,this.sky.count)

        this.sky.cloudPositions = []
        
        //setup
        this.clouds = {}
        this.clouds.randomness = 100
        this.clouds.regenDistance = 60


        this.generateSky()
    }

    generateSky(){
         this.sizeOfTerrainZ = ((this.experience.world.terrain.terrain.boundrys.biggestZ - this.experience.world.terrain.terrain.boundrys.smallestZ) * 1.4) / 3
         this.sizeOfTerrainX = ((this.experience.world.terrain.terrain.boundrys.biggestX - this.experience.world.terrain.terrain.boundrys.smallestX) * 1.4) / 3
        let xOffset = -1
        for(let i = 1; i< this.sky.count + 1; i++){           
            if((i % 3) === 1){
                xOffset ++
            }
           const zPosition = (this.experience.world.terrain.terrain.boundrys.smallestZ ) + (this.sizeOfTerrainZ * (i % 3) )  + ((Math.random() - 0.5) * this.clouds.randomness)
           const xPosition = this.experience.world.terrain.terrain.boundrys.smallestX + (this.sizeOfTerrainX * xOffset ) + ((Math.random() - 0.5) * this.clouds.randomness)
    
            this.sky.cloudPositions.push({x:xPosition, y:75, z:zPosition})
        }   
       this.updateCloudPositions(this.sky.cloudPositions)
      
    }

    updateCloudPositions(_cloudPositions){
        this.experience.scene.remove(this.sky.instancedMesh)
        this.sky.instancedMesh.dispose()
        this.sky.instancedMesh = new THREE.InstancedMesh(this.sky.geometry, this.sky.material, this.sky.count)
        
        for(let i = 0; i< _cloudPositions.length; i++){
            let matrix = new THREE.Matrix4()
            matrix.makeTranslation(_cloudPositions[i].x, _cloudPositions[i].y, _cloudPositions[i].z)
            this.sky.instancedMesh.setMatrixAt(i, matrix)
        }

        this.experience.scene.add(this.sky.instancedMesh)
    }

    update(){
        //INFINITE CLOUDS GENERATION
        for(const _cloud of this.sky.cloudPositions){
            //biggest x
            if(_cloud.x >= this.experience.world.terrain.terrain.boundrys.biggestX + this.clouds.regenDistance){
                _cloud.x -= (this.experience.world.terrain.terrain.boundrys.biggestX - this.experience.world.terrain.terrain.boundrys.smallestX) * 1.4
                this.updateCloudPositions(this.sky.cloudPositions)
                }
                //smallest x
            if(_cloud.x <= this.experience.world.terrain.terrain.boundrys.smallestX - this.clouds.regenDistance){
                _cloud.x += (this.experience.world.terrain.terrain.boundrys.biggestX - this.experience.world.terrain.terrain.boundrys.smallestX) * 1.4
                this.updateCloudPositions(this.sky.cloudPositions)
                }
                //biggest z
            if(_cloud.z >= this.experience.world.terrain.terrain.boundrys.biggestZ + this.clouds.regenDistance){
                _cloud.z -= (this.experience.world.terrain.terrain.boundrys.biggestZ - this.experience.world.terrain.terrain.boundrys.smallestZ) * 1.4
                this.updateCloudPositions(this.sky.cloudPositions)
                }
                //smallesrt z
            if(_cloud.z <= this.experience.world.terrain.terrain.boundrys.smallestZ - this.clouds.regenDistance){
                _cloud.z += (this.experience.world.terrain.terrain.boundrys.biggestZ - this.experience.world.terrain.terrain.boundrys.smallestZ) * 1.4
                this.updateCloudPositions(this.sky.cloudPositions)
                }
        }
    }

}