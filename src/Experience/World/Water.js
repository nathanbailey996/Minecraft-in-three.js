import * as THREE from 'three'
import Experience from '../Experience'

export default class Water{
    constructor(){
        this.experience = new Experience()

        this.setWater()
    }

    setWater(){
        this.water = {}

        this.water.blocksBelowSeaLevel = []


        this.water.smallestYPosition = [0]
        this.water.waterPositionsBelowSeaLevel = []
        this.water.health = 10
    

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
       while( smallestYPosition < 0){
         this.water.waterPositionsBelowSeaLevel.push(smallestYPosition)
        smallestYPosition = smallestYPosition +5
       }
       //if the block position is below the water level, push a water block 
       this.water.waterPositions = []
       for(const _chunk of this.experience.world.terrain.terrain.arrayOfChunks){
           for(const _blockPosition of _chunk){
               for(const _positionBelowSeaLevel of this.water.waterPositionsBelowSeaLevel){
                   if(_blockPosition.y < _positionBelowSeaLevel){
                    this.water.waterPositions.push({x:_blockPosition.x, y:_positionBelowSeaLevel, z:_blockPosition.z})
                   }
               }
           }
       }
       //dispose of the old instancedMesh
       this.experience.scene.remove(this.experience.world.terrain.blockTypes.blocks.waterBlock.instancedMesh)
       this.experience.world.terrain.blockTypes.blocks.waterBlock.instancedMesh.dispose()
       //new instancedMesh
       this.experience.world.terrain.blockTypes.blocks.waterBlock.count = this.water.waterPositions.length
       this.experience.world.terrain.blockTypes.blocks.waterBlock.instancedMesh = new THREE.InstancedMesh( this.experience.world.terrain.blockTypes.blocks.waterBlock.geometry, this.experience.world.terrain.blockTypes.blocks.waterBlock.material, this.experience.world.terrain.blockTypes.blocks.waterBlock.count)

       for(let i = 0; i< this.water.waterPositions.length; i++){
           let matrix = new THREE.Matrix4()
           matrix.makeTranslation(this.water.waterPositions[i].x, this.water.waterPositions[i].y, this.water.waterPositions[i].z)
        this.experience.world.terrain.blockTypes.blocks.waterBlock.instancedMesh.setMatrixAt(i, matrix)
       }
       this.experience.scene.add( this.experience.world.terrain.blockTypes.blocks.waterBlock.instancedMesh)
    
     

const newChunkArray = []
for(const _chunk of this.experience.world.terrain.terrain.arrayOfChunks){
    const newChunk = []
    for(const _blockPosition of _chunk){
        let placeSand = false
        for(const _waterPosition of this.water.waterPositionsBelowSeaLevel){
            if(_waterPosition === _blockPosition.y){
                placeSand = true
            }
        }
        //place a sand block
        if(placeSand){
            newChunk.push({x:_blockPosition.x ,y:_blockPosition.y, z:_blockPosition.z, depth:-1, type:9})
            this.experience.world.terrain.blockTypes.blocks.sandBlock.count ++ 
        }
        else{
            //if it isn't blow a water block push the original block
            newChunk.push(_blockPosition)
        }
    }
    newChunkArray.push(newChunk)
}
//add the new blocks to the scene
this.experience.world.terrain.terrain.arrayOfChunks = newChunkArray
this.experience.world.terrain.displayBlocks(newChunkArray, true)

// hearts
this.elapsedTime = 0
this.heartsDisplayed = 10
this.timePerLife = 2
    } 

    //remove a heart from the scene
    removeLife(_livesToRemove){
        this.heartsDisplayed = 0
        for(let i = 1; i<= 10; i++){
            if(i<= _livesToRemove ){
                document.querySelector(`#life${i}`).style.display = 'none'
            }
            else{
                document.querySelector(`#life${i}`).style.display = 'block'
                this.heartsDisplayed ++
            }
        }
      

    }

    update(){
        let isIntersecting = false
        for(const _waterPosition of this.water.waterPositions){
            if(this.experience.camera.instance.position.x <= _waterPosition.x +2.5 &&
                this.experience.camera.instance.position.x >= _waterPosition.x - 2.5  && 
                this.experience.camera.instance.position.z <= _waterPosition.z +2.5 &&
                this.experience.camera.instance.position.z >= _waterPosition.z - 2.5 ){
                    if(this.experience.camera.instance.position.y <= _waterPosition.y ){
                        isIntersecting = true
                        if(this.heartsDisplayed > 0 ){
                      this.elapsedTime += ((this.experience.time.delta / 1000) )
                     const livesToRemove = Math.round(this.elapsedTime) / this.timePerLife
                      if(Number.isInteger(livesToRemove) && livesToRemove !== 0){
                          this.removeLife(livesToRemove)
                      }
                      }
                    }
                }
            }
            //add a heart back  
            if(!isIntersecting && this.elapsedTime > 0){
                this.elapsedTime -= (this.experience.time.delta / 1000 )
                const livesToRemove = Math.round(this.elapsedTime) / this.timePerLife
                if(Number.isInteger(livesToRemove)){
                    this.removeLife(livesToRemove)
                }
            }
       
}
}
