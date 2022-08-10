import * as THREE from 'three'
import Experience from '../Experience'

export default class Terrain {
    constructor(){
        this.experience = new Experience()

        this.setTerrain()

        if(this.experience.debug.active){
          this.setDebug()
        }
    }

    setTerrain(){

        this.terrain = {}
        this.terrain.blocks = {}
        this.terrain.blocks.grass = {}
        this.terrain.blocks.grass.geometry =  new THREE.BoxBufferGeometry(5,5,5)
        this.terrain.blocks.grass.textures = []
        this.terrain.blocks.grass.textures.push(this.experience.loaders.items.grassBlockSide)
        this.terrain.blocks.grass.textures.push(this.experience.loaders.items.grassBlockSide)
        this.terrain.blocks.grass.textures.push(this.experience.loaders.items.grassBlockTop)
        this.terrain.blocks.grass.textures.push(this.experience.loaders.items.grassBlockBottom)
        this.terrain.blocks.grass.textures.push(this.experience.loaders.items.grassBlockSide)
        this.terrain.blocks.grass.textures.push(this.experience.loaders.items.grassBlockSide)

        //array of materials for each side of the block
        this.terrain.blocks.grass.materials = []
     
        for(let i = 0; i < this.terrain.blocks.grass.textures.length; i++){
          if(i === 3){
            this.terrain.blocks.grass.materials.push(null)
          }else{
          this.terrain.blocks.grass.textures[i].encoding = THREE.sRGBEncoding
            const material = new THREE.MeshBasicMaterial({map:this.terrain.blocks.grass.textures[i]})
            this.terrain.blocks.grass.materials.push(material)
          }

        }


            //edges of the blocks
            this.terrain.blocks.grass.edges = {}
            this.terrain.blocks.grass.edges.geometry = new THREE.EdgesGeometry(this.terrain.blocks.grass.geometry)
            this.terrain.blocks.grass.edges.material = new THREE.LineBasicMaterial({color:0x000000})

            this.terrain.blocks.grass.increment = 0.05
            this.terrain.blocks.grass.height = 25



            this.terrain.smoothedZ = 0
            this.terrain.smoothedX = 0
            this.terrain.amplitude = 30
            this.terrain.blocksPosition = []
            this.terrain.numberOfChunks = 5
            this.terrain.chunkSize = 10
            this.terrain.arrayOfChunks = []
            this.terrain.blockNumber = this.terrain.chunkSize * this.terrain.chunkSize *this.terrain.numberOfChunks * this.terrain.numberOfChunks


            noise.seed(Math.random());


          this.terrain.blocks.grass.instancedMesh = new THREE.InstancedMesh(
            this.terrain.blocks.grass.geometry,
            this.terrain.blocks.grass.materials,
          this.terrain.blockNumber
        )



          for(let i = 0; i< this.terrain.numberOfChunks; i++){
            for(let j = 0; j< this.terrain.numberOfChunks; j++){
             const chunks = []
             for(let x = i * this.terrain.chunkSize; x< (i * this.terrain.chunkSize) + this.terrain.chunkSize; x++ ){
               for(let z = j * this.terrain.chunkSize; z< (j * this.terrain.chunkSize) + this.terrain.chunkSize; z++ ){
               this.terrain.smoothedX = this.terrain.blocks.grass.increment * x
               this.terrain.smoothedZ = this.terrain.blocks.grass.increment * z
                 const elevation = Math.round(noise.simplex2(this.terrain.smoothedX, this.terrain.smoothedZ) * this.terrain.blocks.grass.height / 5) * 5
                chunks.push( {x:x * 5, y:elevation, z:z * 5})


               }
             }
             this.terrain.arrayOfChunks.push(chunks)
           }


        }  this.displayBlocks(this.terrain.arrayOfChunks)

            //infinite world regeration
            this.terrain.boundrys = {}



            this.getBoundrys()

            this.experience.camera.instance.position.x = (this.terrain.boundrys.biggestX -this.terrain.boundrys.smallestX )/ 2
            this.experience.camera.instance.position.z = (this.terrain.boundrys.biggestZ -this.terrain.boundrys.smallestZ )/ 2
             this.experience.camera.instance.rotation.z = Math.PI  /4
            this.experience.camera.instance.rotation.y = Math.PI / 2

           




    }

    getBoundrys (_positions){
      let testPositions = null
      _positions === undefined? testPositions = this.terrain.arrayOfChunks: testPositions = _positions

      const xPositions = []
      const zPositions = []

      for(const _chunkArray of testPositions){
        for(const _blockPosition of _chunkArray){
          xPositions.push(_blockPosition.x)
          zPositions.push(_blockPosition.z)

        }
      }
      this.terrain.boundrys.biggestX = Math.max.apply(null, xPositions)
      this.terrain.boundrys.smallestX = Math.min.apply(null, xPositions)
       this.terrain.boundrys.biggestZ = Math.max.apply(null, zPositions)
      this.terrain.boundrys.smallestZ = Math.min.apply(null, zPositions)
    }




    displayBlocks(_arrayOfChunks){
      let count = 0
      for(const _chunkArray of _arrayOfChunks){

        for(const _block of _chunkArray){
          let matrix = new THREE.Matrix4()
          matrix.makeTranslation(_block.x, _block.y, _block.z)
          this.terrain.blocks.grass.instancedMesh.setMatrixAt(count, matrix)
          count ++

        }
      this.experience.scene.add(this.terrain.blocks.grass.instancedMesh)
      }


    }

    getVoxels(x,y,z){
      for(const _chunkArray of this.terrain.arrayOfChunks){
        for(const _blockPosition of _chunkArray){
          if(_blockPosition.x === x && _blockPosition.y === y && _blockPosition.z === z){
            return true
          } 
        }
      }
    }

    update(){
      if(this.experience.camera.instance.position.z <= this.terrain.boundrys.smallestZ + 20){
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
               const elevation = Math.round(noise.simplex2(this.terrain.smoothedX, this.terrain.smoothedZ) * this.terrain.blocks.grass.height / 5) * 5
               newChunk.push({x, y:elevation, z})
             
             }
           }
           //put the new positions in the newChunk array
          newPositionsArray.splice(i * this.terrain.numberOfChunks , 0, newChunk)
         }
         

         //remove old blocks and add new blocks to the scene
         this.experience.scene.remove(this.terrain.blocks.grass.instancedMesh)
         this.terrain.blocks.grass.instancedMesh.dispose()


         this.terrain.blocks.grass.instancedMesh = new THREE.InstancedMesh(
          this.terrain.blocks.grass.geometry,
          this.terrain.blocks.grass.materials,
        this.terrain.blockNumber
      )

      let count = 0
      for(const _newChunkArray of newPositionsArray){
        for(const _newBlockPositions of _newChunkArray){
          let matrix = new THREE.Matrix4()
          matrix.makeTranslation(_newBlockPositions.x, _newBlockPositions.y, _newBlockPositions.z)
          this.terrain.blocks.grass.instancedMesh.setMatrixAt(count, matrix)
           count ++
        }
      }

      this.getBoundrys(newPositionsArray)
      this.terrain.arrayOfChunks = newPositionsArray
      this.experience.scene.add(this.terrain.blocks.grass.instancedMesh)
      this.experience.world.water.resetWater()


         
      }


       if(this.experience.camera.instance.position.z >= this.terrain.boundrys.biggestZ - 20){
        const newPositionsArray = []
        //remove the blocks dissapearing from the back and put the others in a new array
        for(let i = 0; i< this.terrain.arrayOfChunks.length; i++){
          if((i % this.terrain.numberOfChunks) !== 0){
            newPositionsArray.push(this.terrain.arrayOfChunks[i])
          }
         }

         //0  3  6
         //1  4  7
         //2  5  8
        

   
         for(let i = 0; i< this.terrain.numberOfChunks; i++){
           const newChunk = []
          
           //start at the smallest x position and go to the last chunk
           for(let x = this.terrain.boundrys.smallestX + (i * this.terrain.chunkSize * 5); x < this.terrain.boundrys.smallestX + (i * this.terrain.chunkSize * 5) + (this.terrain.chunkSize * 5); x = x +5){
             //replace the chunks minus one chunk in the z axis
             for(let z = this.terrain.boundrys.biggestZ + 5; z < (this.terrain.boundrys.biggestZ + 5) + (this.terrain.chunkSize * 5); z = z+5){
               //replace the moved chunks with new values
               this.terrain.smoothedX = this.terrain.blocks.grass.increment * x / 5
               this.terrain.smoothedZ = this.terrain.blocks.grass.increment * z / 5
               const elevation = Math.round(noise.simplex2(this.terrain.smoothedX, this.terrain.smoothedZ) * this.terrain.blocks.grass.height / 5) * 5
               newChunk.push({x, y:elevation, z})
             
             }
           }
           //put the new positions in the newChunk array
          newPositionsArray.splice((i * this.terrain.numberOfChunks) + 4 , 0, newChunk)
          
         }

         //remove old blocks and add new blocks to the scene
         this.experience.scene.remove(this.terrain.blocks.grass.instancedMesh)
         this.terrain.blocks.grass.instancedMesh.dispose()


         this.terrain.blocks.grass.instancedMesh = new THREE.InstancedMesh(
          this.terrain.blocks.grass.geometry,
          this.terrain.blocks.grass.materials,
        this.terrain.blockNumber
      )

      let count = 0
      for(const _newChunkArray of newPositionsArray){
        for(const _newBlockPositions of _newChunkArray){
          let matrix = new THREE.Matrix4()
          matrix.makeTranslation(_newBlockPositions.x, _newBlockPositions.y, _newBlockPositions.z)
          this.terrain.blocks.grass.instancedMesh.setMatrixAt(count, matrix)
           count ++
        }
      }

      this.getBoundrys(newPositionsArray)
      this.terrain.arrayOfChunks = newPositionsArray
      this.experience.scene.add(this.terrain.blocks.grass.instancedMesh)
      this.experience.world.water.setWater()

      }

      
      if(this.experience.camera.instance.position.x <= this.terrain.boundrys.smallestX + 20){

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
               const elevation = Math.round(noise.simplex2(this.terrain.smoothedX, this.terrain.smoothedZ) * this.terrain.blocks.grass.height / 5) * 5
               newChunk.push({x, y:elevation, z})
             
             }
           }
           //put the new positions in the newChunk array
          newPositionsArray.splice(i , 0, newChunk)
         }

         //remove old blocks and add new blocks to the scene
         this.experience.scene.remove(this.terrain.blocks.grass.instancedMesh)
         this.terrain.blocks.grass.instancedMesh.dispose()


         this.terrain.blocks.grass.instancedMesh = new THREE.InstancedMesh(
          this.terrain.blocks.grass.geometry,
          this.terrain.blocks.grass.materials,
        this.terrain.blockNumber
      )

      let count = 0
      for(const _newChunkArray of newPositionsArray){
        for(const _newBlockPositions of _newChunkArray){
          let matrix = new THREE.Matrix4()
          matrix.makeTranslation(_newBlockPositions.x, _newBlockPositions.y, _newBlockPositions.z)
          this.terrain.blocks.grass.instancedMesh.setMatrixAt(count, matrix)
           count ++
        }
      }

      this.getBoundrys(newPositionsArray)
      this.terrain.arrayOfChunks = newPositionsArray
      this.experience.scene.add(this.terrain.blocks.grass.instancedMesh)
      this.experience.world.water.resetWater()

      }

      if(this.experience.camera.instance.position.x >= this.terrain.boundrys.biggestX - 20){

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
               const elevation = Math.round(noise.simplex2(this.terrain.smoothedX, this.terrain.smoothedZ) * this.terrain.blocks.grass.height / 5) * 5
               newChunk.push({x, y:elevation, z})
             
             }
           }
           //put the new positions in the newChunk array
          newPositionsArray.splice(i + 20 , 0, newChunk)
          
         }

         //remove old blocks and add new blocks to the scene
         this.experience.scene.remove(this.terrain.blocks.grass.instancedMesh)
         this.terrain.blocks.grass.instancedMesh.dispose()


         this.terrain.blocks.grass.instancedMesh = new THREE.InstancedMesh(
          this.terrain.blocks.grass.geometry,
          this.terrain.blocks.grass.materials,
        this.terrain.blockNumber
      )

      let count = 0
      for(const _newChunkArray of newPositionsArray){
        for(const _newBlockPositions of _newChunkArray){
          let matrix = new THREE.Matrix4()
          matrix.makeTranslation(_newBlockPositions.x, _newBlockPositions.y, _newBlockPositions.z)
          this.terrain.blocks.grass.instancedMesh.setMatrixAt(count, matrix)
           count ++
        }
      }

      this.getBoundrys(newPositionsArray)
      this.terrain.arrayOfChunks = newPositionsArray
      this.experience.scene.add(this.terrain.blocks.grass.instancedMesh)
      this.experience.world.water.resetWater()
      }
      
    }





    setDebug(){
      this.debugFolder = this.experience.debug.gui.addFolder('terrain')
      this.debugFolder.add(this.terrain.blocks.grass, 'height', 50, 150, 1)
      this.debugFolder.add(this.terrain.blocks.grass, 'increment', 0.0002, 0.005, 0.0001)

    }

}

//0 5 10 15 20
//1 6 11 16 21
//2 7 12 17 22
//3 8 13 18 23
//4 9 14 19 24

