import * as THREE from 'three'
import Experience from '../Experience'

export default class Water{
    constructor(){
        this.experience = new Experience()

        this.setWater()
    }

    setWater(){
        this.water = {}

        this.water.geometry = new THREE.BoxBufferGeometry(5,5,5)
        this.water.texture = this.experience.loaders.items.waterBlockTexture
        this.water.texture.encoding = THREE.sRGBEncoding
        this.water.material =  new THREE.MeshBasicMaterial({map:this.water.texture, transparent:true, opacity:0.8})

        this.water.blocksBelowSeaLevel = []


        this.water.smallestYPosition = [0]
        this.water.waterPositionsBelowSeaLevel = []
        this.water.arrayOfUsedWaterPositions = []
    

        //get the lowest block in the terrain
        for(const _chunkArray of this.experience.world.terrain.terrain.arrayOfChunks){
            for(const _blockPosition of _chunkArray){
             if(_blockPosition.y < this.water.smallestYPosition[0]){
                 this.water.smallestYPosition.splice(0, 1, _blockPosition.y)
             }
            }
        }

            //get an array of y positions from the smallest position to -5 in multiples of 5
        let smallestYPosition = this.water.smallestYPosition[0]
       while( smallestYPosition < -5){
         this.water.waterPositionsBelowSeaLevel.push(smallestYPosition)
        smallestYPosition = smallestYPosition +5
       }
     
       //check if those posible water positions are above a block
for(const _waterPositionBelowSeaLevel of this.water.waterPositionsBelowSeaLevel){
    for(const _chunkArray of this.experience.world.terrain.terrain.arrayOfChunks){
        for(const _blockPosition of _chunkArray){
            if(_blockPosition.y < 10){
const allWaterPositionsBelowSeaLevel = {x:_blockPosition.x, y:_waterPositionBelowSeaLevel, z:_blockPosition.z}
    if(allWaterPositionsBelowSeaLevel.y > _blockPosition.y){
 this.water.arrayOfUsedWaterPositions.push(allWaterPositionsBelowSeaLevel)
    }



}
    }
    }
}

this.water.instancedMesh = new THREE.InstancedMesh(this.water.geometry, this.water.material, this.water.arrayOfUsedWaterPositions.length)

let count = 0
for(const _usedWaterposition of this.water.arrayOfUsedWaterPositions){
let matrix = new THREE.Matrix4()
matrix.makeTranslation(_usedWaterposition.x, _usedWaterposition.y, _usedWaterposition.z)
this.water.instancedMesh.setMatrixAt(count, matrix)
count ++ 
}

this.experience.scene.add(this.water.instancedMesh)

    }


    resetWater(){
        // this.experience.scene.remove(this.water.instancedMesh)
        // this.water.instancedMesh.dispose()


        // this.setWater()

    }
}