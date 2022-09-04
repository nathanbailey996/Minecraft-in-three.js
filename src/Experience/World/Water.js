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
    //    if(this.experience.world.addingRemovingBlocks.removedBlocks[0]){
       const newWaterPositions = []
       for(const _waterPosition of this.water.waterPositions){
           let isBlockRemoved = false
           for(const _removedBlock of this.experience.world.addingRemovingBlocks.removedBlocks){
               if(_waterPosition.x === _removedBlock.x && _waterPosition.y === _removedBlock.y && _waterPosition.z === _removedBlock.z){
                isBlockRemoved = true
                } 
           }
        
       
       this.water.waterPositions = newWaterPositions

       let isBlockPlaced = false
       for(const _infiniteDepthBlock of  this.experience.world.addingRemovingBlocks.infiniteDepthBlocks){
           if(_waterPosition.x === _infiniteDepthBlock.x && _waterPosition.y === _infiniteDepthBlock.y && _waterPosition.z === _infiniteDepthBlock.z){
            isBlockPlaced = true
           }
       }
       if(!isBlockRemoved && !isBlockPlaced){
        newWaterPositions.push(_waterPosition)
       }

    }
    this.water.waterPositions = newWaterPositions
    //    console.log(this.water.waterPositions)
    // }
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
                if(!_blockPosition.depth >= 1){
                placeSand = true
                }
            }
        }
        
        //place a sand block
        if(placeSand){
            newChunk.push({x:_blockPosition.x ,y:_blockPosition.y, z:_blockPosition.z, depth:-1, type:9})
            // this.experience.world.terrain.blockTypes.blocks.sandBlock.count ++ 
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
        if(this.heartsDisplayed === 0){
            this.displayDiedScreen()
        }
      

    }

    displayDiedScreen(){
        this.diedScreen = document.querySelector('.died-section')
        this.diedScreen.style.display = 'flex'
        this.diedScreen.style.zIndex = '5'
        this.experience.world.previousWorld.isPlayerInGameMenu = true
        this.experience.world.controls.controls.pointerLock.unlock()
        
        //respawn
        this.respawnBtn = document.querySelector('#respawn-btn')
        this.respawnBtn.addEventListener('click', ()=>{
            this.respawn()
        })

        //return to title
        this.returnBtn = document.querySelector('#title-screen-btn')
        this.returnBtn.addEventListener('click', ()=>{
            this.returnToTitle()
        })
    }

    closeDiedScreen(){
        this.diedScreen.style.display = 'none'
        this.diedScreen.style.zIndex = '1'
     
        //remvoe the event listeners
        this.respawnBtn.removeEventListener('click', ()=>{
            this.respawn()
        })  
        this.returnBtn.removeEventListener('click', ()=>{
            this.returnToTitle()
        })
     }

    returnToTitle(){
        this.experience.world.previousWorld.openSavedWorldSection()
        this.closeDiedScreen()
    }

    respawn(){
        this.closeDiedScreen()
        this.experience.world.controls.controls.pointerLock.lock()
    }

    update(){
        let isIntersecting = false
        for(const _waterPosition of this.water.waterPositions){
            if(this.experience.camera.instance.position.x <= _waterPosition.x +2.5 &&
                this.experience.camera.instance.position.x >= _waterPosition.x - 2.5  && 
                this.experience.camera.instance.position.z <= _waterPosition.z +2.5 &&
                this.experience.camera.instance.position.z >= _waterPosition.z - 2.5 ){
                    if(this.experience.camera.instance.position.y == _waterPosition.y ){
                        console.log(this.experience.camera.instance.position.y, _waterPosition.y )
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

/* save and refresh and go into a saved world */