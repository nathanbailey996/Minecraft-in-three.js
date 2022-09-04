import * as THREE from 'three'
import Experience from '../Experience'
import BlockTypes from './BlockTypes'

export default class Terrain {
    constructor(_blockTypes){
        this.experience = new Experience()
        this.blockTypes = new BlockTypes()

        this.setTerrainInfo()
                  
        if(this.experience.debug.active){
          this.setDebug()
        }
    }
//arangement of the chunks in the world
//0 5 10 15 20
//1 6 11 16 21
//2 7 12 17 22
//3 8 13 18 23
//4 9 14 19 24

    setTerrainInfo(){
            //relief of the terrain
            this.terrain = {}
            this.terrain.blocks = {}
            this.terrain.blocks.grass = {}

            this.terrain.blocks.grass.increment = 0.05
            this.terrain.blocks.grass.height = 20
            this.terrain.smoothedZ = 0
            this.terrain.smoothedX = 0
            this.terrain.amplitude = 30
            this.terrain.blocksPosition = []
            this.terrain.numberOfChunks = 5
            this.terrain.chunkSize = 10
            this.terrain.sizeOfBiome = 0.7
            this.terrain.distanceFromEdge =( this.terrain.numberOfChunks * this.terrain.numberOfChunks * this.terrain.chunkSize) * 0.3
            this.terrain.arrayOfChunks = []
    }
    
    setTerrain(){
      this.terrain.worldSeed = Math.random()
      this.terrain.biomeSeed = Math.random()

      this.terrain.arrayOfChunks = []

            //generate random terrain
          //starter terrain
          for(let i = 0; i< this.terrain.numberOfChunks; i++){
            for(let j = 0; j< this.terrain.numberOfChunks; j++){
             const chunks = []
             for(let x = i * this.terrain.chunkSize; x< (i * this.terrain.chunkSize) + this.terrain.chunkSize; x++ ){
               for(let z = j * this.terrain.chunkSize; z< (j * this.terrain.chunkSize) + this.terrain.chunkSize; z++ ){
               this.terrain.smoothedX = this.terrain.blocks.grass.increment * x
               this.terrain.smoothedZ = this.terrain.blocks.grass.increment * z
               noise.seed(this.terrain.worldSeed)
                 const elevation = Math.round(noise.simplex2(this.terrain.smoothedX, this.terrain.smoothedZ) * this.terrain.blocks.grass.height / 5) * 5
                //insert sand biome
                noise.seed(this.terrain.biomeSeed)
               const  currentBiome = noise.simplex2(this.terrain.smoothedX / this.terrain.sizeOfBiome, this.terrain.smoothedZ / this.terrain.sizeOfBiome)
                if(currentBiome > -0.7){
                chunks.push( {x:x * 5, y:elevation  , z:z * 5, depth:0,})
              }
              else {
                chunks.push( {x:x * 5, y:elevation, z:z * 5, depth:-1, type:9})
                // this.blockTypes.blocks.sandBlock.count ++
                }

               }
             }
             this.terrain.arrayOfChunks.push(chunks)
           }


        }
        
        //add the blocks to the scene
        this.displayBlocks(this.terrain.arrayOfChunks, true)
  
             this.getBoundrys(undefined, true)
    }

    //get the lowest and hightest values for the x and z coordinates
    getBoundrys (_positions, _center){
      let testPositions = null
      _positions === undefined? testPositions = this.terrain.arrayOfChunks: testPositions = _positions
      // const testPositions = this.terrain.arrayOfChunks
      const xPositions = []
      const zPositions = []

      for(const _chunkArray of testPositions){
        for(const _blockPosition of _chunkArray){
          xPositions.push(_blockPosition.x)
          zPositions.push(_blockPosition.z)

        }
      }
      this.terrain.boundrys = {}
      this.terrain.boundrys.biggestX = Math.max.apply(null, xPositions)
      this.terrain.boundrys.smallestX = Math.min.apply(null, xPositions)
       this.terrain.boundrys.biggestZ = Math.max.apply(null, zPositions)
      this.terrain.boundrys.smallestZ = Math.min.apply(null, zPositions)
      //center the camera on the first render
      if(_center){
      this.experience.camera.instance.position.x = (this.terrain.boundrys.biggestX -this.terrain.boundrys.smallestX )/ 2
      this.experience.camera.instance.position.z = (this.terrain.boundrys.biggestZ -this.terrain.boundrys.smallestZ )/ 2
      this.experience.camera.instance.position.y = 50
    }
  }
    //add the blocks to the scene
    addBlocksToScene(_arrayOfChunks, _instancedMesh){
      let count = 0
      for(const _chunkArray of _arrayOfChunks){
        for(const _block of _chunkArray){
          let matrix = new THREE.Matrix4()
          matrix.makeTranslation(_block.x, _block.y, _block.z)
          _instancedMesh.setMatrixAt(count, matrix)
          count ++

        }
      this.experience.scene.add(_instancedMesh)
    }

  }

  getCurrentDate(){
  const newDate = new Date()
let currentMinutes = newDate.getMinutes()
if(currentMinutes < 10){
  currentMinutes = `0${currentMinutes}`
}
  //returns a date such as (28/7/2022 12:50)
 return `(${newDate.getDate()}/${newDate.getMonth()}/${newDate.getFullYear()} ${newDate.getHours()}:${currentMinutes})`
  }

  //sorts the blocks in terms of their depth and creates the instanced mesh for each block type needed to regenerate
    displayBlocks(_arrayOfChunks, _removePreviousMesh){
//save the block data 
  if(this.experience.world.previousWorld.currentWorld && this.experience.world.addingRemovingBlocks){
this.experience.world.previousWorld.currentWorld.blockPositions = _arrayOfChunks
this.experience.world.previousWorld.currentWorld.addedBlocks = this.experience.world.addingRemovingBlocks.addedBlocks
this.experience.world.previousWorld.currentWorld.removedBlocks = this.experience.world.addingRemovingBlocks.removedBlocks
this.experience.world.previousWorld.currentWorld.infiniteDepthBlocks = this.experience.world.addingRemovingBlocks.infiniteDepthBlocks
this.experience.world.previousWorld.currentWorld.originalBlocks = this.experience.world.addingRemovingBlocks.originalBlocks
this.experience.world.previousWorld.currentWorld.cameraPosition = this.experience.camera.instance.position
this.experience.world.previousWorld.currentWorld.date = this.getCurrentDate()
}
      const grassLayerBlocks = []
      const dirtLayerBlocks = []
      const stoneLayerBlocks = []
      const bedrockLayerBlocks = []
      const woodBlocks = []
      const brickBlocks = []
      const treeBlocks = []
      const sandBlocks = []
      // const glassBlocks = []

      let grassCount = 0
      let sandCount = 0
      let dirtCount = 0
      let stoneCount = 0
      let bedrockCount = 0
      let woodCount = 0
      let treeCount = 0
      let brickCount = 0
      // let glassCount = 0

      for(const _chunk of _arrayOfChunks){
        const newGrassChunk = []
        const newDirtChunk = []
        const newStoneChunk = []
        const newBedrockChunk = []
        const newWoodChunk = []
        const newBrickChunk = []
        const newTreeChunk = []
        const newSandChunk = []
        // const newGlasschunk = []
        for(const _blockPosition of _chunk){
          switch(_blockPosition.depth){
            case 0:
              newGrassChunk.push(_blockPosition)
              grassCount ++
              break;
            case 1:
              newDirtChunk.push(_blockPosition)
              dirtCount ++ 
              break;
              case 2:
              newDirtChunk.push(_blockPosition)
              dirtCount ++ 
              break;
              case 3:
              newStoneChunk.push(_blockPosition)
              stoneCount ++ 
              break;
              case 4:
              newStoneChunk.push(_blockPosition)
              stoneCount ++ 
              break;
              case 5:
                newBedrockChunk.push(_blockPosition)
                bedrockCount ++ 
              case -1:
                //if the block is added by the user
                switch(_blockPosition.type){
                  case 1:
                    newGrassChunk.push(_blockPosition)
                    grassCount ++
                    break;
                  // case 2:
                  //   // newGlasschunk.push(_blockPosition)
                  //   // glassCount ++ 
                  //   break
                  case 3:
                    newStoneChunk.push(_blockPosition)
                    stoneCount ++ 
                  case 4:
                    newDirtChunk.push(_blockPosition)
                    dirtCount ++ 
                    break
                  case 5:
                    newBedrockChunk.push(_blockPosition)
                    bedrockCount ++ 
                    break;
                  case 6:
                    newWoodChunk.push(_blockPosition)
                    woodCount ++ 
                    break;
                  case 7:
                    newTreeChunk.push(_blockPosition)
                    treeCount ++ 
                    break;
                    case 8:
                      newBrickChunk.push(_blockPosition)
                      brickCount ++ 
                      break;
                  case 9:
                    newSandChunk.push(_blockPosition)
                    sandCount ++ 
                    break;

                }
              break;
          }


        }
        grassLayerBlocks.push(newGrassChunk)
        dirtLayerBlocks.push(newDirtChunk)
        stoneLayerBlocks.push(newStoneChunk)
        bedrockLayerBlocks.push(newBedrockChunk)
        woodBlocks.push(newWoodChunk)
        brickBlocks.push(newBrickChunk)
        treeBlocks.push(newTreeChunk)
        sandBlocks.push(newSandChunk)
        // glassBlocks.push(newGlasschunk)
      }

      //set the counts of the blocks
      this.blockTypes.blocks.grass.count = grassCount
      this.blockTypes.blocks.sandBlock.count = sandCount
      this.blockTypes.blocks.stoneBlock.count = stoneCount
      this.blockTypes.blocks.dirtBlock.count = dirtCount
      this.blockTypes.blocks.bedrockBlock.count = bedrockCount
      this.blockTypes.blocks.woodBlock.count = woodCount
      this.blockTypes.blocks.treeBlock.count = treeCount
      this.blockTypes.blocks.brickBlock.count = brickCount
      // this.blockTypes.blocks.glassBlock.count = glassCount

      //on the first render do not remove the previous mesh
      if(_removePreviousMesh){
    this.experience.scene.remove(this.blockTypes.blocks.grass.instancedMesh)
    this.blockTypes.blocks.grass.instancedMesh.dispose()
     //create new instanced mesh
    this.blockTypes.blocks.grass.instancedMesh = new THREE.InstancedMesh(
     this.blockTypes.blocks.grass.geometry,
     this.blockTypes.blocks.grass.material,
   this.blockTypes.blocks.grass.count)
     //dirt
     this.experience.scene.remove(this.blockTypes.blocks.dirtBlock.instancedMesh)
     this.blockTypes.blocks.dirtBlock.instancedMesh.dispose()
      //create new instanced mesh
     this.blockTypes.blocks.dirtBlock.instancedMesh = new THREE.InstancedMesh(
      this.blockTypes.blocks.dirtBlock.geometry,
      this.blockTypes.blocks.dirtBlock.material,
      this.blockTypes.blocks.dirtBlock.count)

    //stone
    this.experience.scene.remove(this.blockTypes.blocks.stoneBlock.instancedMesh)
    this.blockTypes.blocks.stoneBlock.instancedMesh.dispose()
     //create new instanced mesh
    this.blockTypes.blocks.stoneBlock.instancedMesh = new THREE.InstancedMesh(
     this.blockTypes.blocks.stoneBlock.geometry,
     this.blockTypes.blocks.stoneBlock.material,
     this.blockTypes.blocks.stoneBlock.count)

     //bedrock
     this.experience.scene.remove(this.blockTypes.blocks.bedrockBlock.instancedMesh)
     this.blockTypes.blocks.bedrockBlock.instancedMesh.dispose()
      //create new instanced mesh
     this.blockTypes.blocks.bedrockBlock.instancedMesh = new THREE.InstancedMesh(
      this.blockTypes.blocks.bedrockBlock.geometry,
      this.blockTypes.blocks.bedrockBlock.material,
      this.blockTypes.blocks.bedrockBlock.count)
      //wood
     this.experience.scene.remove(this.blockTypes.blocks.woodBlock.instancedMesh)
     this.blockTypes.blocks.woodBlock.instancedMesh.dispose()
      //create new instanced mesh
     this.blockTypes.blocks.woodBlock.instancedMesh = new THREE.InstancedMesh(
      this.blockTypes.blocks.woodBlock.geometry,
      this.blockTypes.blocks.woodBlock.material,
      this.blockTypes.blocks.woodBlock.count)
       //brick
     this.experience.scene.remove(this.blockTypes.blocks.brickBlock.instancedMesh)
     this.blockTypes.blocks.brickBlock.instancedMesh.dispose()
      //create new instanced mesh
     this.blockTypes.blocks.brickBlock.instancedMesh = new THREE.InstancedMesh(
      this.blockTypes.blocks.brickBlock.geometry,
      this.blockTypes.blocks.brickBlock.material,
      this.blockTypes.blocks.brickBlock.count)
        //tree block
     this.experience.scene.remove(this.blockTypes.blocks.treeBlock.instancedMesh)
     this.blockTypes.blocks.treeBlock.instancedMesh.dispose()
      //create new instanced mesh
     this.blockTypes.blocks.treeBlock.instancedMesh = new THREE.InstancedMesh(
      this.blockTypes.blocks.treeBlock.geometry,
      this.blockTypes.blocks.treeBlock.material,
      this.blockTypes.blocks.treeBlock.count)
        //sand block
     this.experience.scene.remove(this.blockTypes.blocks.sandBlock.instancedMesh)
     this.blockTypes.blocks.sandBlock.instancedMesh.dispose()
      //create new instanced mesh
     this.blockTypes.blocks.sandBlock.instancedMesh = new THREE.InstancedMesh(
      this.blockTypes.blocks.sandBlock.geometry,
      this.blockTypes.blocks.sandBlock.material,
      this.blockTypes.blocks.sandBlock.count)
        //glass block
     this.experience.scene.remove(this.blockTypes.blocks.glassBlock.instancedMesh)
     this.blockTypes.blocks.glassBlock.instancedMesh.dispose()
      //create new instanced mesh
     this.blockTypes.blocks.glassBlock.instancedMesh = new THREE.InstancedMesh(
      this.blockTypes.blocks.glassBlock.geometry,
      this.blockTypes.blocks.glassBlock.material,
      this.blockTypes.blocks.glassBlock.count)

       }
       console.log(this.blockTypes.blocks.grass.instancedMesh.count);
       console.log(this.blockTypes.blocks.stoneBlock.instancedMesh.count);
       console.log(this.blockTypes.blocks.bedrockBlock.instancedMesh.count);
       console.log(this.blockTypes.blocks.woodBlock.instancedMesh.count);
       console.log(this.blockTypes.blocks.brickBlock.instancedMesh.count);
       console.log(this.blockTypes.blocks.treeBlock.instancedMesh.count);
       console.log(this.blockTypes.blocks.sandBlock.instancedMesh.count);
       console.log(this.blockTypes.blocks.dirtBlock.instancedMesh.count);

        //add the blocks to the scene
      this.addBlocksToScene(grassLayerBlocks, this.blockTypes.blocks.grass.instancedMesh)
      this.addBlocksToScene(dirtLayerBlocks, this.blockTypes.blocks.dirtBlock.instancedMesh)
      this.addBlocksToScene(stoneLayerBlocks, this.blockTypes.blocks.stoneBlock.instancedMesh)
      this.addBlocksToScene(bedrockLayerBlocks, this.blockTypes.blocks.bedrockBlock.instancedMesh)
      this.addBlocksToScene(woodBlocks, this.blockTypes.blocks.woodBlock.instancedMesh)
      this.addBlocksToScene(brickBlocks, this.blockTypes.blocks.brickBlock.instancedMesh)
      this.addBlocksToScene(treeBlocks, this.blockTypes.blocks.treeBlock.instancedMesh)
      this.addBlocksToScene(sandBlocks, this.blockTypes.blocks.sandBlock.instancedMesh)
      // this.addBlocksToScene(glassBlocks, this.blockTypes.blocks.glassBlock.instancedMesh)

    }

    update(){
      if(this.terrain.arrayOfChunks[0]){
      if(this.experience.camera.instance.position.z <= this.terrain.boundrys.smallestZ +  this.terrain.distanceFromEdge){
        const newPositionsArray = []
        //remove the blocks dissapearing from the back and put the others in a new array
        for(let i = 0; i< this.terrain.arrayOfChunks.length; i++){
          if((i +1) % this.terrain.numberOfChunks !== 0){
            newPositionsArray.push(this.terrain.arrayOfChunks[i])
          }
         }

         for(let i = 0; i< this.terrain.numberOfChunks; i++){
           const newChunk = []

           //start at the smallest x position and go to the last chunk
           for(let x = this.terrain.boundrys.smallestX + (i * this.terrain.chunkSize * 5); x < this.terrain.boundrys.smallestX + (i * this.terrain.chunkSize * 5) + (this.terrain.chunkSize * 5); x = x +5){
             //replace the chunks minus one chunk in the z axis
             for(let z = this.terrain.boundrys.smallestZ - (this.terrain.chunkSize * 5); z < this.terrain.boundrys.smallestZ; z = z+5){
               //replace the moved chunks with new values
               this.terrain.smoothedX = this.terrain.blocks.grass.increment * x / 5
               this.terrain.smoothedZ = this.terrain.blocks.grass.increment * z / 5
               noise.seed(this.terrain.worldSeed)
               const elevation = Math.round(noise.simplex2(this.terrain.smoothedX, this.terrain.smoothedZ) * this.terrain.blocks.grass.height / 5) * 5

               const newBlockPosition = {x, y:elevation, z,depth:0}


              //test if the block being added is in the placed of a block placed by the user
              if(this.experience.world.addingRemovingBlocks){
               for(const _addedBlock of this.experience.world.addingRemovingBlocks.addedBlocks){
                if(_addedBlock.x === newBlockPosition.x && _addedBlock.z === newBlockPosition.z){
              newChunk.push(_addedBlock)
                }
              }
              }

               //check if the block being placed is in the chunk as one added by the infinite depth
               for(const _depthBlock of this.experience.world.addingRemovingBlocks.infiniteDepthBlocks){
                if(_depthBlock.x === newBlockPosition.x && _depthBlock.z === newBlockPosition.z){
              newChunk.push(_depthBlock)
                }
              }

              //check if the block being added is in the removed blocks array
              let isBlockRemoved = false
              for(const _removedBlock of this.experience.world.addingRemovingBlocks.removedBlocks){
                if(_removedBlock.x === newBlockPosition.x && _removedBlock.y === newBlockPosition.y && _removedBlock.z === newBlockPosition.z){
                  isBlockRemoved = true
                }
              }

              //push the block if the block is not in the originalBlocks
              let isOriginalBlockPresent = false
              for(const _originalBlock of this.experience.world.addingRemovingBlocks.originalBlocks){
                if(_originalBlock.x === newBlockPosition.x && _originalBlock.y === newBlockPosition.y && _originalBlock.z === newBlockPosition.z ){
                  isOriginalBlockPresent = true
                }
              }
              if(!isOriginalBlockPresent){
                this.experience.world.addingRemovingBlocks.originalBlocks.push(newBlockPosition)
              }

              if(!isBlockRemoved){
                newChunk.push(newBlockPosition)

              }







             }
           }
           //put the new positions in the newChunk array
          newPositionsArray.splice(i * this.terrain.numberOfChunks , 0, newChunk)
         }

         this.terrain.arrayOfChunks = newPositionsArray
      this.displayBlocks(newPositionsArray, true)
      this.experience.world.water.setWater()
      this.getBoundrys(newPositionsArray)
      }

       if(this.experience.camera.instance.position.z >= this.terrain.boundrys.biggestZ -  this.terrain.distanceFromEdge){
        const newPositionsArray = [] 
        //remove the blocks dissapearing from the back and put the others in a new array
        for(let i = 0; i< this.terrain.arrayOfChunks.length; i++){
          if((i % this.terrain.numberOfChunks) !== 0){
            newPositionsArray.push(this.terrain.arrayOfChunks[i])
          }
         }
         for(let i = 0; i< this.terrain.numberOfChunks; i++){
           const newChunk = []

           //start at the smallest x position and go to the last chunk
           for(let x = this.terrain.boundrys.smallestX + (i * this.terrain.chunkSize * 5); x < this.terrain.boundrys.smallestX + (i * this.terrain.chunkSize * 5) + (this.terrain.chunkSize * 5); x = x +5){
             //replace the chunks minus one chunk in the z axis
             for(let z = this.terrain.boundrys.biggestZ + 5; z < (this.terrain.boundrys.biggestZ + 5) + (this.terrain.chunkSize * 5); z = z+5){
               //replace the moved chunks with new values
               this.terrain.smoothedX = this.terrain.blocks.grass.increment * x / 5
               this.terrain.smoothedZ = this.terrain.blocks.grass.increment * z / 5
               noise.seed(this.terrain.worldSeed)
               const elevation = Math.round(noise.simplex2(this.terrain.smoothedX, this.terrain.smoothedZ) * this.terrain.blocks.grass.height / 5) * 5

               const newBlockPosition = {x, y:elevation, z, depth:0}
              //check if the block being placed is in the place of a block placed by the user
               for(const _addedBlock of this.experience.world.addingRemovingBlocks.addedBlocks){
                 if(_addedBlock.x === newBlockPosition.x && _addedBlock.z === newBlockPosition.z){
               newChunk.push(_addedBlock)
                 }
               }
               //check if the block being placed is in the chunk as one added by the infinite depth
               for(const _depthBlock of this.experience.world.addingRemovingBlocks.infiniteDepthBlocks){
                if(_depthBlock.x === newBlockPosition.x && _depthBlock.z === newBlockPosition.z){
              newChunk.push(_depthBlock)

                }
              }
              //push the block if the block is not in the originalBlocks
              let isOriginalBlockPresent = false
              for(const _originalBlock of this.experience.world.addingRemovingBlocks.originalBlocks){
                if(_originalBlock.x === newBlockPosition.x && _originalBlock.y === newBlockPosition.y && _originalBlock.z === newBlockPosition.z ){
                  isOriginalBlockPresent = true
                }
              }
              if(!isOriginalBlockPresent){
                this.experience.world.addingRemovingBlocks.originalBlocks.push(newBlockPosition)
              }

               //check if the block being added is in the removed blocks array
              let isBlockRemoved = false
              for(const _removedBlock of this.experience.world.addingRemovingBlocks.removedBlocks){
                if(_removedBlock.x === newBlockPosition.x && _removedBlock.y === newBlockPosition.y && _removedBlock.z === newBlockPosition.z){
                  isBlockRemoved = true
                }
              }
              if(!isBlockRemoved){
                // noise.seed(this.terrain.biomeSeed)
                // const  currentBiome = noise.simplex2(this.terrain.smoothedX / this.terrain.sizeOfBiome, this.terrain.smoothedZ / this.terrain.sizeOfBiome)
                //  if(currentBiome >= -0.5){
                 newChunk.push(newBlockPosition)
              //  }
              //  else{
              //    //insert sande biome
              //    newChunk.push( {x, y:elevation, z, depth:-1, type:9})
              //    this.blockTypes.blocks.sandBlock.count ++
              //    }


              }

             }
           }
           //put the new positions in the newChunk array
          newPositionsArray.splice((i * this.terrain.numberOfChunks) + 4 , 0, newChunk)

         }

      this.terrain.arrayOfChunks = newPositionsArray
      this.displayBlocks(newPositionsArray,true)
      this.experience.world.water.setWater()
      this.getBoundrys(newPositionsArray)
      }


      if(this.experience.camera.instance.position.x <= this.terrain.boundrys.smallestX +  this.terrain.distanceFromEdge){

        const newPositionsArray = []
        //remove the blocks dissapearing from the back and put the others in a new array
        for(let i = 0; i< this.terrain.arrayOfChunks.length; i++){
          if(i < (this.terrain.numberOfChunks * this.terrain.numberOfChunks) - this.terrain.numberOfChunks ){
            newPositionsArray.push(this.terrain.arrayOfChunks[i])
          }
         }



         for(let i = 0; i< this.terrain.numberOfChunks; i++){
           const newChunk = []

           //start at the smallest x position and go to the last chunk
           for(let z = this.terrain.boundrys.smallestZ + (i * this.terrain.chunkSize * 5); z < this.terrain.boundrys.smallestZ + (i * this.terrain.chunkSize * 5) + (this.terrain.chunkSize * 5); z = z +5){
             //replace the chunks minus one chunk in the z axis
             for(let x = this.terrain.boundrys.smallestX - (this.terrain.chunkSize * 5); x < this.terrain.boundrys.smallestX; x = x+5){
               //replace the moved chunks with new values
               this.terrain.smoothedX = this.terrain.blocks.grass.increment * x / 5
               this.terrain.smoothedZ = this.terrain.blocks.grass.increment * z / 5
               noise.seed(this.terrain.worldSeed)
               const elevation = Math.round(noise.simplex2(this.terrain.smoothedX, this.terrain.smoothedZ) * this.terrain.blocks.grass.height / 5) * 5

               const newBlockPosition = {x, y:elevation, z, depth:0}
               //check if the block being placed is in the place of a block placed by the user
                for(const _addedBlock of this.experience.world.addingRemovingBlocks.addedBlocks){
                  if(_addedBlock.x === newBlockPosition.x && _addedBlock.z === newBlockPosition.z){
                newChunk.push(_addedBlock)
                  }
                }

                 //check if the block being placed is in the chunk as one added by the infinite depth
               for(const _depthBlock of this.experience.world.addingRemovingBlocks.infiniteDepthBlocks){
                if(_depthBlock.x === newBlockPosition.x && _depthBlock.z === newBlockPosition.z){
              newChunk.push(_depthBlock)
                }
              }

                //check if the block being added is in the removed blocks array
               let isBlockRemoved = false
               for(const _removedBlock of this.experience.world.addingRemovingBlocks.removedBlocks){
                 if(_removedBlock.x === newBlockPosition.x && _removedBlock.y === newBlockPosition.y && _removedBlock.z === newBlockPosition.z){
                   isBlockRemoved = true
                 }
               }

                     //push the block if the block is not in the originalBlocks
              let isOriginalBlockPresent = false
              for(const _originalBlock of this.experience.world.addingRemovingBlocks.originalBlocks){
                if(_originalBlock.x === newBlockPosition.x && _originalBlock.y === newBlockPosition.y && _originalBlock.z === newBlockPosition.z ){
                  isOriginalBlockPresent = true
                }
              }
              if(!isOriginalBlockPresent){
                this.experience.world.addingRemovingBlocks.originalBlocks.push(newBlockPosition)
              }

               if(!isBlockRemoved){
                 newChunk.push(newBlockPosition)

               }

             }
           }
           //put the new positions in the newChunk array
          newPositionsArray.splice(i , 0, newChunk)
         }


         this.terrain.arrayOfChunks = newPositionsArray
         this.displayBlocks(newPositionsArray,true)
         this.experience.world.water.setWater()
         this.getBoundrys(newPositionsArray)

      }

      if(this.experience.camera.instance.position.x >= this.terrain.boundrys.biggestX - this.terrain.distanceFromEdge){

        const newPositionsArray = []
        //remove the blocks dissapearing from the back and put the others in a new array
        for(let i = 0; i< this.terrain.arrayOfChunks.length; i++){
          if(i >=(this.terrain.numberOfChunks)){
            newPositionsArray.push(this.terrain.arrayOfChunks[i])
          }
         }

         for(let i = 0; i< this.terrain.numberOfChunks; i++){
           const newChunk = []

           //start at the smallest x position and go to the last chunk
           for(let z = this.terrain.boundrys.smallestZ + (i * this.terrain.chunkSize * 5); z < this.terrain.boundrys.smallestZ + (i * this.terrain.chunkSize * 5) + (this.terrain.chunkSize * 5); z = z +5){
             //replace the chunks minus one chunk in the z axis
             for(let x = this.terrain.boundrys.biggestX + 5; x < (this.terrain.boundrys.biggestX + 5) + (this.terrain.chunkSize * 5); x = x+5){
               //replace the moved chunks with new values
               this.terrain.smoothedX = this.terrain.blocks.grass.increment * x / 5
               this.terrain.smoothedZ = this.terrain.blocks.grass.increment * z / 5
               noise.seed(this.terrain.worldSeed)
               const elevation = Math.round(noise.simplex2(this.terrain.smoothedX, this.terrain.smoothedZ) * this.terrain.blocks.grass.height / 5) * 5

               const newBlockPosition = {x, y:elevation, z, depth:0}
               //check if the block being placed is in the place of a block placed by the user
                for(const _addedBlock of this.experience.world.addingRemovingBlocks.addedBlocks){
                  if(_addedBlock.x === newBlockPosition.x && _addedBlock.z === newBlockPosition.z){
                newChunk.push(_addedBlock)
                  }
                }

                 //check if the block being placed is in the chunk as one added by the infinite depth
               for(const _depthBlock of this.experience.world.addingRemovingBlocks.infiniteDepthBlocks){
                if(_depthBlock.x === newBlockPosition.x && _depthBlock.z === newBlockPosition.z){
              newChunk.push(_depthBlock)
                }
              }

                //check if the block being added is in the removed blocks array
               let isBlockRemoved = false
               for(const _removedBlock of this.experience.world.addingRemovingBlocks.removedBlocks){
                 if(_removedBlock.x === newBlockPosition.x && _removedBlock.y === newBlockPosition.y && _removedBlock.z === newBlockPosition.z){
                   isBlockRemoved = true
                 }
               }

                     //push the block if the block is not in the originalBlocks
              let isOriginalBlockPresent = false
              for(const _originalBlock of this.experience.world.addingRemovingBlocks.originalBlocks){
                if(_originalBlock.x === newBlockPosition.x && _originalBlock.y === newBlockPosition.y && _originalBlock.z === newBlockPosition.z ){
                  isOriginalBlockPresent = true
                }
              }
              if(!isOriginalBlockPresent){
                this.experience.world.addingRemovingBlocks.originalBlocks.push(newBlockPosition)
              }

               if(!isBlockRemoved){
                 newChunk.push(newBlockPosition)

               }

             }
           }
           //put the new positions in the newChunk array
          newPositionsArray.splice(i + 20 , 0, newChunk)

         }

         this.terrain.arrayOfChunks = newPositionsArray
         this.displayBlocks(newPositionsArray,true)
         this.experience.world.water.setWater()
         this.getBoundrys(newPositionsArray)

      }

    }
    }

    setDebug(){
      this.debugFolder = this.experience.debug.gui.addFolder('terrain')
      this.debugFolder.add(this.terrain.blocks.grass, 'height', 50, 150, 1)
      this.debugFolder.add(this.terrain.blocks.grass, 'increment', 0.0002, 0.005, 0.0001)

    }

}



