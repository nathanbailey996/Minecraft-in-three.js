import * as THREE from 'three'
import Experience from '../Experience'

export default class AddingRemovingBlocks{
    constructor(){
        this.experience = new Experience()


        this.setHoverPlane()
        this.getClickDuration()
        
    }

    setHoverPlane(){
        this.hoverPlane = {}

        this.hoverPlane.viewPoint = new THREE.Vector2()
        this.hoverPlane.viewPoint.x = (0.5) * 2  -1
        this.hoverPlane.viewPoint.y = -1 * (0.5) * 2  +1

        this.hoverPlane.raycaster = new THREE.Raycaster()

        this.hoverPlane.plane = {}
        this.hoverPlane.plane.geometry = new THREE.PlaneBufferGeometry(5,5)
        this.hoverPlane.plane.material = new THREE.MeshBasicMaterial({
            color:0xffffff, 
            transparent:true, 
             opacity:0.5, 
        })
        this.hoverPlane.plane.mesh = new THREE.Mesh(this.hoverPlane.plane.geometry, this.hoverPlane.plane.material)
        
        this.hoverPlane.plane.isPlaneInScene = false
        this.hoverPlane.plane.distanceFromBlock = 0.1
        

        this.experience.scene.add(this.hoverPlane.plane.mesh)


        this.addedBlocks = []
        this.infiniteDepthBlocks = []
        this.removedBlocks = []
        this.originalBlocks = []
        if(!this.originalBlocks[0]){
            for(const _chunkArray of this.experience.world.terrain.terrain.arrayOfChunks){
                this.originalBlocks.push(..._chunkArray)
            }
        }    
    }

    getClickDuration(){
        this.blocks = {}
        //duration of the click for removing blocks
        this.blocks.click = {}
        this.blocks.click.remove = {}
        //the time passed since the click started
        this.blocks.click.remove.elapsed = 0
        this.blocks.click.remove.startTime = 0
        this.blocks.click.remove.duration = 0
        this.blocks.isBlockRemoved = false

        //duration of the click for adding blocks
        this.blocks.click.add ={}
        this.blocks.click.add.startTime = 0
        this.blocks.click.add.elapsed = 0

        //events
        this.blocks.onMouseDown = (_event)=>{
        //removing duration
        if(_event.button === 0){
        this.blocks.isBlockRemoved = false
        this.blocks.click.remove.startTime = Date.now()
        }
        //adding duration
        if(_event.button === 2){
        this.blocks.click.add.startTime = Date.now()
        }
        window.addEventListener('mouseup', this.blocks.onMouseUp)

         }

        this.blocks.onMouseUp = (_event)=>{
        //removing duration
        if(_event.button === 0){
        this.blocks.click.remove.startTime = 0
        }

        //adding duration
        if(_event.button === 2){
        this.blocks.click.add.elapsed = (Date.now() - this.blocks.click.add.startTime) / 1000
            if(this.blocks.click.add.elapsed <= 1){
                this.addBlock()
            }
        }

        window.removeEventListener('mouseup', this.blocks.onMouseUp)
        }

        this.blocks.onContextMenu = (_event)=>{
            _event.preventDefault()
        }
        window.addEventListener('contextmenu', this.blocks.onContextMenu)

    
        window.addEventListener('mousedown', this.blocks.onMouseDown)
        }

        //GET THE DEPTH OF A GIVEN ARRAY OF CHUNKS
        getDepthOfBlock(_arrayOfBlocks){
            for(const _blockToGetDepth of _arrayOfBlocks){
                const arrayOFDepths = []
                    for(const _blockPosition of this.originalBlocks){
                        if(_blockToGetDepth.x === _blockPosition.x && _blockToGetDepth.z === _blockPosition.z){
                            arrayOFDepths.push(_blockPosition.y)
                            
                        }
                    }
                _blockToGetDepth.depth = ( Math.max.apply(null, arrayOFDepths) - _blockToGetDepth.y) / 5

            }
        }

        //INCREASE OR DECREASE THE COUNT OF AN INSTANCED MESH
        offsetMeshCount(_blockPosition, _offset){
            switch(_blockPosition.depth){
                case 0:
                this.experience.world.terrain.blockTypes.blocks.grass.count += _offset
                break;
                case 1:
                this.experience.world.terrain.blockTypes.blocks.dirtBlock.count += _offset
                break;
                case 2:
                this.experience.world.terrain.blockTypes.blocks.dirtBlock.count += _offset
                break;
                case 3:
                this.experience.world.terrain.blockTypes.blocks.stoneBlock.count += _offset
                break;
                case 4:
                this.experience.world.terrain.blockTypes.blocks.stoneBlock.count += _offset
                break;
                case 5:
                this.experience.world.terrain.blockTypes.blocks.bedrockBlock.count += _offset
                case -1:
                    switch(_blockPosition.type){
                    case 1:
                    this.experience.world.terrain.blockTypes.blocks.grass.count += _offset
                    break;
                //    case 2:
                //    this.experience.world.terrain.blockTypes.blocks.grass.count += _offset
                //    break
                    case 3:
                    this.experience.world.terrain.blockTypes.blocks.stoneBlock.count += _offset
                    break
                    case 4:
                    this.experience.world.terrain.blockTypes.blocks.dirtBlock.count += _offset
                    break
                    case 5:
                    this.experience.world.terrain.blockTypes.blocks.bedrockBlock.count += _offset
                    break
                    case 6:
                    this.experience.world.terrain.blockTypes.blocks.woodBlock.count += _offset
                    break
                    case 7:
                    this.experience.world.terrain.blockTypes.blocks.treeBlock.count += _offset
                    break
                    case 8:
                    this.experience.world.terrain.blockTypes.blocks.brickBlock.count += _offset
                    break
                    case 9:
                    this.experience.world.terrain.blockTypes.blocks.sandBlock.count += _offset
                    break
                    }
        
                }
        }

//REMOVING BLOCKS
removeBlock(){
    
    this.minimumDepth = 5


    this.hoverPlane.raycaster.setFromCamera(this.hoverPlane.viewPoint, this.experience.camera.instance)
    const intersects = this.hoverPlane.raycaster.intersectObjects([this.experience.world.terrain.blockTypes.blocks.grass.instancedMesh, this.experience.world.terrain.blockTypes.blocks.dirtBlock.instancedMesh, this.experience.world.terrain.blockTypes.blocks.stoneBlock.instancedMesh, this.experience.world.terrain.blockTypes.blocks.woodBlock.instancedMesh, this.experience.world.terrain.blockTypes.blocks.brickBlock.instancedMesh, this.experience.world.terrain.blockTypes.blocks.treeBlock.instancedMesh, this.experience.world.terrain.blockTypes.blocks.sandBlock.instancedMesh])

    if(intersects[0] && intersects[0].distance <=40){
        let currentBlockPosition = {
            x:Math.round(intersects[0].point.x / 5) * 5,
            y:Math.round(intersects[0].point.y / 5) * 5,
            z:Math.round(intersects[0].point.z / 5) * 5,

        }

    switch(intersects[0].face.materialIndex){
        case 0:
        currentBlockPosition = {
            x:(Math.round(intersects[0].point.x / 5) * 5)-5,
            y:Math.round(intersects[0].point.y / 5) * 5,
            z:Math.round(intersects[0].point.z / 5) * 5,

        }
        break;
        case 2:
        currentBlockPosition = {
            x:Math.round(intersects[0].point.x / 5) * 5,
            y:(Math.round(intersects[0].point.y / 5) * 5) -5,
            z:Math.round(intersects[0].point.z / 5) * 5,

        }
        break;

    //     case 3:
    //         newBlockPosition = {
    //             x:Math.round(intersectingObject.x / 5) * 5 , 
    //             y:intersectingObject.y - 2.5, 
    //             z:Math.round(intersectingObject.z / 5) * 5 , 

    //         }
    // //     break;
        case 4:
        currentBlockPosition = {
            x:Math.round(intersects[0].point.x / 5) * 5,
            y:Math.round(intersects[0].point.y / 5) * 5,
            z:(Math.round(intersects[0].point.z / 5) * 5) -5,

        }
        break;
        }
        currentBlockPosition.y = Math.round(currentBlockPosition.y)
        this.removedBlocks.push(currentBlockPosition)

        let addedBlock = false   //is the block added by the user

        //remove the block from the blocks added by the user
        const newAddedBlocksArray = []
        for(const _addedBlock of this.addedBlocks){
            if(_addedBlock.x !== currentBlockPosition.x || _addedBlock.z !== currentBlockPosition.z || _addedBlock.y !== currentBlockPosition.y){
                newAddedBlocksArray.push(_addedBlock)
            }
            else{
                //the block has been added by the user
                addedBlock = true
            }
        }

        this.getDepthOfBlock([currentBlockPosition])
        if(currentBlockPosition.depth >= this.minimumDepth){
        return
        }
       

        this.addedBlocks = newAddedBlocksArray
        let blockBehind = false //is there a block behind the one removed
        let blockInFront = false //is there a block in front of the one removed
        let blockRight = false //is there a block right of the one removed
        let blockLeft = false //is there a block left of the one removed
        let blockAbove = false //is there a block left of the one removed
        
        let blocksToPlace = []
        for(const _chunkArray of this.experience.world.terrain.terrain.arrayOfChunks){
            for(const _blockPosition of _chunkArray){
                if((_blockPosition.x - currentBlockPosition.x) < 10 && (_blockPosition.x - currentBlockPosition.x) > -10 &&
                (_blockPosition.z - currentBlockPosition.z) < 10 && (_blockPosition.z - currentBlockPosition.z) > -10 &&
                (_blockPosition.y - currentBlockPosition.y) < 10 && (_blockPosition.y - currentBlockPosition.y) > -10  ){
                blocksToPlace.push({x:_blockPosition.x, y: _blockPosition.y - 5, z: _blockPosition.z, isPlaced:false, depth:null} )                                
                }
                //check if there are blocks surrounding the one removed
                if(_blockPosition.x === currentBlockPosition.x && _blockPosition.z === currentBlockPosition.z -5 && _blockPosition.y === currentBlockPosition.y){
                    blockBehind = true
                }

                if(_blockPosition.x === currentBlockPosition.x && _blockPosition.z === currentBlockPosition.z +5 && _blockPosition.y === currentBlockPosition.y){
                    blockInFront = true
                }

                if(_blockPosition.x === currentBlockPosition.x +5 && _blockPosition.z === currentBlockPosition.z  && _blockPosition.y === currentBlockPosition.y){
                    blockRight = true
                }

                if(_blockPosition.x === currentBlockPosition.x -5 && _blockPosition.z === currentBlockPosition.z  && _blockPosition.y === currentBlockPosition.y){
                    blockLeft = true
                }
                if(_blockPosition.x === currentBlockPosition.x  && _blockPosition.z === currentBlockPosition.z  && _blockPosition.y === currentBlockPosition.y + 5){
                    blockLeft = true
                }
                //if there isnt a block surrounding it check if the position of the block is below the surface
                if(!blockBehind){
                    if(_blockPosition.x === currentBlockPosition.x && _blockPosition.z === currentBlockPosition.z -5 && _blockPosition.y > currentBlockPosition.y ){
                        blocksToPlace.push({x:currentBlockPosition.x, z:currentBlockPosition.z -5, y: currentBlockPosition.y, isPlaced: false, depth:null})
                    }
                }
                //front
                if(!blockInFront){
                    if(_blockPosition.x === currentBlockPosition.x && _blockPosition.z === currentBlockPosition.z +5 && _blockPosition.y > currentBlockPosition.y ){
                        blocksToPlace.push({x:currentBlockPosition.x, z:currentBlockPosition.z +5, y: currentBlockPosition.y, isPlaced: false, depth:null})
                    }
                }
                //right
                if(!blockRight){
                    if(_blockPosition.x === currentBlockPosition.x +5 && _blockPosition.z === currentBlockPosition.z  && _blockPosition.y > currentBlockPosition.y ){
                        blocksToPlace.push({x:currentBlockPosition.x + 5, z:currentBlockPosition.z , y: currentBlockPosition.y, isPlaced: false, depth:null})
                    }
                }
                //left
                if(!blockLeft){
                    if(_blockPosition.x === currentBlockPosition.x - 5 && _blockPosition.z === currentBlockPosition.z  && _blockPosition.y > currentBlockPosition.y ){
                        blocksToPlace.push({x:currentBlockPosition.x - 5, z:currentBlockPosition.z , y: currentBlockPosition.y, isPlaced: false, depth:null})
                    }
                }
                 //above
                 if(!blockAbove){
                    if(_blockPosition.x === currentBlockPosition.x && _blockPosition.z === currentBlockPosition.z  && _blockPosition.y > currentBlockPosition.y + 5 ){
                        blocksToPlace.push({x:currentBlockPosition.x , z:currentBlockPosition.z , y: currentBlockPosition.y + 5, isPlaced: false, depth:null})
                    }
                }
                
            }
        }

        

        const newBlocksToPlace = []
        for(const _blockToPlace of blocksToPlace){
            let isBlockPlaced = false
            let wasBlockRemoved = false

            //check if the block being placed is already in the scene
            for(const _chunkArray of this.experience.world.terrain.terrain.arrayOfChunks){
                for(const _blockPosition of _chunkArray){
                    if(_blockPosition.x === _blockToPlace.x && _blockPosition.y === _blockToPlace.y && _blockPosition.z === _blockToPlace.z){
                        isBlockPlaced = true
                    }
                }
            }
            //check if the block being placed was previously removed
            for(const _removedBlock of this.removedBlocks){
                if(_removedBlock.x === _blockToPlace.x && _removedBlock.y === _blockToPlace.y && _removedBlock.z === _blockToPlace.z){
                    wasBlockRemoved = true
                }
            }
            //if both of these are false add them to the new array
            if(!isBlockPlaced && !wasBlockRemoved){
                newBlocksToPlace.push(_blockToPlace)
            }
        }

        //GET THE DEPTH OF THE BLOCKS
        
        this.getDepthOfBlock(newBlocksToPlace)
        this.infiniteDepthBlocks.push(...newBlocksToPlace)
        
        // this.experience.world.terrain.terrain.arrayOfChunks[0] = [...this.experience.world.terrain.terrain.arrayOfChunks[0], ...newBlocksToPlace]

        const newChunkArray = []
        for(const _chunkArray of this.experience.world.terrain.terrain.arrayOfChunks){
            const newChunk = []
            for(const _blockPosition of _chunkArray){
                if(!addedBlock){
            for(const _blockToPlace of newBlocksToPlace){
                //dont replace blocks if the block is placed by the user
                if(_blockPosition.x === _blockToPlace.x && _blockPosition.z === _blockToPlace.z){
                    if(!_blockToPlace.isPlaced){
                        newChunk.push(_blockToPlace)
                        // switch(_blockToPlace.depth){
                        //     case 1:
                        //     this.experience.world.terrain.blockTypes.blocks.dirtBlock.count ++
                        //     break;
                        //     case 2:
                        //     this.experience.world.terrain.blockTypes.blocks.dirtBlock.count ++
                        //     break;
                        //     case 3:
                        //     this.experience.world.terrain.blockTypes.blocks.stoneBlock.count ++
                        //     case 4:
                        //     this.experience.world.terrain.blockTypes.blocks.stoneBlock.count ++
                        //     break;
                        //     case 5:
                        //     this.experience.world.terrain.blockTypes.blocks.bedrockBlock.count ++
                        //     break;

                                
                        // }
                        this.offsetMeshCount(_blockToPlace, 1)
                        this.experience.world.terrain.blockTypes.blocks.dirtBlock.count ++
                        _blockToPlace.isPlaced = true
                    }
                }
            }
            }
                //remove the selected block from the scene
                    if(_blockPosition.x !== currentBlockPosition.x || _blockPosition.z !== currentBlockPosition.z ||  _blockPosition.y !== currentBlockPosition.y){    
                        newChunk.push(_blockPosition)
                    }
                }
                    newChunkArray.push(newChunk)

                }

        //rebuild the terrain
        this.experience.world.terrain.getBoundrys(newChunkArray)
        if(currentBlockPosition.depth === 0){
        this.experience.world.terrain.blockTypes.blocks.grass.count -= 1
        }
        // switch(currentBlockPosition.depth){
        // case 0:
        // this.experience.world.terrain.blockTypes.blocks.grass.count -= 1
        // break;
        // case 1:
        // this.experience.world.terrain.blockTypes.blocks.dirtBlock.count -= 1
        // break;
        // case 2:
        // this.experience.world.terrain.blockTypes.blocks.dirtBlock.count -= 1
        // break;
        // case 3:
        // this.experience.world.terrain.blockTypes.blocks.stoneBlock.count -= 1
        // break;
        // case 4:
        // this.experience.world.terrain.blockTypes.blocks.stoneBlock.count -= 1
        // break;
        // case 5:
        // this.experience.world.terrain.blockTypes.blocks.bedrockBlock.count -= 1

        // }
        this.offsetMeshCount(currentBlockPosition, -1)
        
        this.experience.world.terrain.terrain.arrayOfChunks = newChunkArray
        this.experience.world.terrain.displayBlocks(newChunkArray, true)
}
}

//ADDING BLOCKS
addBlock(){
    this.hoverPlane.raycaster.setFromCamera(this.hoverPlane.viewPoint, this.experience.camera.instance)
     const intersects = this.hoverPlane.raycaster.intersectObjects([this.experience.world.terrain.blockTypes.blocks.grass.instancedMesh, this.experience.world.terrain.blockTypes.blocks.dirtBlock.instancedMesh, this.experience.world.terrain.blockTypes.blocks.stoneBlock.instancedMesh, this.experience.world.terrain.blockTypes.blocks.bedrockBlock.instancedMesh, this.experience.world.terrain.blockTypes.blocks.woodBlock.instancedMesh, this.experience.world.terrain.blockTypes.blocks.brickBlock.instancedMesh, this.experience.world.terrain.blockTypes.blocks.treeBlock.instancedMesh, this.experience.world.terrain.blockTypes.blocks.sandBlock.instancedMesh])

     if(intersects[0] && intersects[0].distance < 40){
            const intersectingObject = intersects[0].point
            let newBlockPosition =  intersectingObject
            let currentBlockPosition = {
                x:Math.round(intersects[0].point.x / 5) * 5,
                y:Math.round(intersects[0].point.y / 5) * 5,
                z:Math.round(intersects[0].point.z / 5) * 5,
            }

            switch(intersects[0].face.materialIndex){
                case 0:
                    //right face
                newBlockPosition = {
                    x:intersectingObject.x + 2.5, 
                    y:Math.round(intersectingObject.y / 5) * 5, 
                    z:Math.round(intersectingObject.z / 5) * 5, 
                }
                currentBlockPosition = {
                    x:(Math.round(intersects[0].point.x / 5) * 5)-5,
                    y:Math.round(intersects[0].point.y / 5) * 5,
                    z:Math.round(intersects[0].point.z / 5) * 5,
                }
                break;
                case 1:
                    //left face
                    newBlockPosition = {
                        x:intersectingObject.x - 2.5, 
                        y:Math.round(intersectingObject.y / 5) * 5, 
                        z:Math.round(intersectingObject.z / 5) * 5, 

                    }
                break;
                case 2:
                    //top face
                newBlockPosition = {
                    x:Math.round(intersectingObject.x / 5) * 5 , 
                    y:intersectingObject.y + 2.5, 
                    z:Math.round(intersectingObject.z / 5) * 5 , 
                }
                currentBlockPosition = {
                    x:Math.round(intersects[0].point.x / 5) * 5,
                    y:(Math.round(intersects[0].point.y / 5) * 5) - 5,
                    z:Math.round(intersects[0].point.z / 5) * 5,
     
                }
                break;
                case 3:
                //bottom face
                newBlockPosition = {
                    x:Math.round(intersectingObject.x / 5) * 5 , 
                    y:intersectingObject.y - 2.5, 
                    z:Math.round(intersectingObject.z / 5) * 5 , 
                }
                currentBlockPosition = {
                    x:Math.round(intersects[0].point.x / 5) * 5,
                    y:(Math.round(intersects[0].point.y / 5) * 5) -5,
                    z:Math.round(intersects[0].point.z / 5) * 5,
     
                }
                case 4:
                    //front face
                newBlockPosition = {
                    x:Math.round(intersectingObject.x / 5) * 5, 
                    y:Math.round(intersectingObject.y / 5) * 5, 
                    z:intersectingObject.z + 2.5 , 
                }
                currentBlockPosition = {
                    x:Math.round(intersects[0].point.x / 5) * 5,
                    y:Math.round(intersects[0].point.y / 5) * 5,
                    z:(Math.round(intersects[0].point.z / 5) * 5) -5,
     
                }
                break;
                case 5:
                    //back face
                    newBlockPosition = {
                        x:Math.round(intersectingObject.x / 5) * 5, 
                        y:Math.round(intersectingObject.y / 5) * 5, 
                        z:intersectingObject.z -2.5, 
                    }
                break;
            }
            this.canPlaceBlock = true
            if(this.experience.camera.instance.position.x <= newBlockPosition.x +2.5 &&
                this.experience.camera.instance.position.x >= newBlockPosition.x - 2.5  && 
                this.experience.camera.instance.position.z <= newBlockPosition.z +2.5 &&
                this.experience.camera.instance.position.z >= newBlockPosition.z - 2.5 &&
                 this.experience.camera.instance.position.y - newBlockPosition.y <=5){
                    return
                }

            newBlockPosition.depth = -1
            newBlockPosition.type = this.experience.world.terrain.blockTypes.blockbar.currentBlockIndex
   
            //add the new block to the scene
            this.addedBlocks.push(newBlockPosition)
                
            const newChunkArray = []
           for(const _arrayOfChunks of this.experience.world.terrain.terrain.arrayOfChunks){
               const newChunk = []
            for(const _blockPosition of _arrayOfChunks){
                if(_blockPosition.x === currentBlockPosition.x  && _blockPosition.z === currentBlockPosition.z && _blockPosition.y === currentBlockPosition.y){
                    //put the new block in the same chunk as the one in the same coordinates
                    newChunk.push(_blockPosition)
                    newChunk.push(newBlockPosition)
                }
                else{
                    newChunk.push(_blockPosition)

                }
            }
            newChunkArray.push(newChunk)
           }
           
        //    switch(currentBlockPosition.depth){
        //     case 0:
        //     this.experience.world.terrain.blockTypes.blocks.grass.count ++
        //     break;
        //     case 1:
        //     this.experience.world.terrain.blockTypes.blocks.dirtBlock.count ++
        //     break;
        //     case 2:
        //     this.experience.world.terrain.blockTypes.blocks.dirtBlock.count ++
        //     break;
        //     case 3:
        //     this.experience.world.terrain.blockTypes.blocks.stoneBlock.count ++
        //     break;
        //     case 4:
        //     this.experience.world.terrain.blockTypes.blocks.stoneBlock.count ++
        //     break;
        //     case 5:
        //     this.experience.world.terrain.blockTypes.blocks.bedrockBlock.count ++
        //     break;
        //  }
        
         this.offsetMeshCount(currentBlockPosition, 1)
         this.offsetMeshCount(newBlockPosition, 1)



        //  if(newBlockPosition.depth === -1){
        //     switch(newBlockPosition.type){
        //         case 1:
        //        this.experience.world.terrain.blockTypes.blocks.grass.count ++
        //        break;
        //     //    case 2:
        //     //    this.experience.world.terrain.blockTypes.blocks.grass.count ++
        //     //    break
        //        case 3:
        //        this.experience.world.terrain.blockTypes.blocks.stoneBlock.count ++
        //        break
        //        case 4:
        //        this.experience.world.terrain.blockTypes.blocks.dirtBlock.count ++
        //        break
        //        case 5:
        //        this.experience.world.terrain.blockTypes.blocks.bedrockBlock.count ++
        //        break
        //     //    case 6:
        //     //    this.experience.world.terrain.blockTypes.blocks.grass.count ++
        //     //    break
        //     //    case 7:
        //     //    this.experience.world.terrain.blockTypes.blocks.grass.count ++
        //     //    break
        //     //    case 8:
        //     //    this.experience.world.terrain.blockTypes.blocks.grass.count ++
        //     //    break
        //     //    case 9:
        //     //     this.experience.world.terrain.blockTypes.blocks.grass.count ++
        //     //     break
               
        //     }
        //  }

       
        
        this.experience.world.terrain.displayBlocks(newChunkArray, true)
        this.experience.world.terrain.terrain.arrayOfChunks = newChunkArray
        this.experience.world.terrain.getBoundrys(newChunkArray)
            
            }

        }

    //UPDATE FUNCTION
    update(){
        //updating the hovering plane
        this.hoverPlane.raycaster.setFromCamera(this.hoverPlane.viewPoint, this.experience.camera.instance)

        const intersects = this.hoverPlane.raycaster.intersectObjects([this.experience.world.terrain.blockTypes.blocks.grass.instancedMesh, this.experience.world.terrain.blockTypes.blocks.dirtBlock.instancedMesh, this.experience.world.terrain.blockTypes.blocks.stoneBlock.instancedMesh,this.experience.world.terrain.blockTypes.blocks.woodBlock.instancedMesh, this.experience.world.terrain.blockTypes.blocks.brickBlock.instancedMesh, this.experience.world.terrain.blockTypes.blocks.treeBlock.instancedMesh, this.experience.world.terrain.blockTypes.blocks.sandBlock.instancedMesh])
        
        if(intersects.length !== 0 && intersects[0].distance < 40){
            const intersectingFace = intersects[0].point
          
          this.experience.scene.traverse((child)=>{
            if(child !== this.hoverPlane.plane.mesh){
                this.hoverPlane.isPlaneInScene = true
            }
            else{
                this.hoverPlane.plane.isPlaneInScene = false

            }
        })
            switch(intersects[0].face.materialIndex){
                case 0:
                    //right face
                    this.hoverPlane.plane.mesh.rotation.y = Math.PI * 0.5
                    this.hoverPlane.plane.mesh.rotation.x = 0
                    this.hoverPlane.plane.mesh.rotation.z = 0

                    this.hoverPlane.plane.mesh.position.x = intersectingFace.x + this.hoverPlane.plane.distanceFromBlock
                    this.hoverPlane.plane.mesh.position.z = (Math.round(intersectingFace.z / 5) * 5)
                    this.hoverPlane.plane.mesh.position.y =  (Math.round(intersectingFace.y / 5) * 5)
                    
                    !this.hoverPlane.plane.isPlaneInScene?  this.experience.scene.add(this.hoverPlane.plane.mesh): ''
                    break;
                    case 1:
                        //left face
                        this.hoverPlane.plane.mesh.rotation.y = - Math.PI * 0.5
                        this.hoverPlane.plane.mesh.rotation.x = 0
                    this.hoverPlane.plane.mesh.rotation.z = 0

                    this.hoverPlane.plane.mesh.position.x = intersectingFace.x - this.hoverPlane.plane.distanceFromBlock
                    this.hoverPlane.plane.mesh.position.y =  (Math.round(intersectingFace.y / 5) * 5)
                    this.hoverPlane.plane.mesh.position.z =  (Math.round(intersectingFace.z / 5) * 5)
                    
                    !this.hoverPlane.plane.isPlaneInScene?  this.experience.scene.add(this.hoverPlane.plane.mesh): ''

                    break; 
                    case 2:
                        //top face
                    this.hoverPlane.plane.mesh.rotation.x = - (Math.PI * 0.5)
                    this.hoverPlane.plane.mesh.rotation.y = 0
                    this.hoverPlane.plane.mesh.rotation.z = 0

                    this.hoverPlane.plane.mesh.position.x =  (Math.round(intersectingFace.x / 5) * 5)
                    this.hoverPlane.plane.mesh.position.z =  (Math.round(intersectingFace.z / 5) * 5)
                    this.hoverPlane.plane.mesh.position.y = intersectingFace.y + this.hoverPlane.plane.distanceFromBlock
                    
                    !this.hoverPlane.plane.isPlaneInScene?  this.experience.scene.add(this.hoverPlane.plane.mesh): ''

                    break;
                    case 3://bottom face
                    this.hoverPlane.plane.mesh.rotation.x =  (Math.PI * 0.5)
                    this.hoverPlane.plane.mesh.rotation.y = 0
                    this.hoverPlane.plane.mesh.rotation.z = 0

                    this.hoverPlane.plane.mesh.position.x =  (Math.round(intersectingFace.x / 5) * 5)
                    this.hoverPlane.plane.mesh.position.z =  (Math.round(intersectingFace.z / 5) * 5)
                    this.hoverPlane.plane.mesh.position.y = intersectingFace.y - this.hoverPlane.plane.distanceFromBlock
                    
                    !this.hoverPlane.plane.isPlaneInScene?  this.experience.scene.add(this.hoverPlane.plane.mesh): ''
       
                    case 4:
                        //front face
                    this.hoverPlane.plane.mesh.rotation.x = 0
                    this.hoverPlane.plane.mesh.rotation.y = 0
                    this.hoverPlane.plane.mesh.rotation.z = 0

                    this.hoverPlane.plane.mesh.position.x =  (Math.round(intersectingFace.x / 5) * 5)
                    this.hoverPlane.plane.mesh.position.y =  (Math.round(intersectingFace.y / 5) * 5)
                     this.hoverPlane.plane.mesh.position.z =  intersectingFace.z +  this.hoverPlane.plane.distanceFromBlock
                    
                    !this.hoverPlane.plane.isPlaneInScene?  this.experience.scene.add(this.hoverPlane.plane.mesh): ''
                    break;
                    case 5:
                        //back face
                    this.hoverPlane.plane.mesh.rotation.x = 0
                    this.hoverPlane.plane.mesh.rotation.y = Math.PI
                    this.hoverPlane.plane.mesh.rotation.z = 0

                    this.hoverPlane.plane.mesh.position.x =  (Math.round(intersectingFace.x / 5) * 5)
                    this.hoverPlane.plane.mesh.position.y =  (Math.round(intersectingFace.y / 5) * 5)
                     this.hoverPlane.plane.mesh.position.z =  intersectingFace.z -  this.hoverPlane.plane.distanceFromBlock
                    
                    !this.hoverPlane.plane.isPlaneInScene?  this.experience.scene.add(this.hoverPlane.plane.mesh): ''      
            }
          
        }
        else{
        //remove the plane if there are no intersecting objects
            this.experience.scene.remove(this.hoverPlane.plane.mesh)
            this.hoverPlane.plane.geometry.dispose()
            this.hoverPlane.plane.material.dispose()
        }

        //removing blocks
        if(this.blocks.click.remove.startTime !== 0){
            //get the elapsed time since the click started
            const currentTime = Date.now()
            this.blocks.click.remove.elapsed = (currentTime - this.blocks.click.remove.startTime) / 1000
            if(this.blocks.click.remove.elapsed >= 0.06 && !this.blocks.isBlockRemoved){
                this.removeBlock()
                this.blocks.isBlockRemoved = true
            }   
        }

        
    }
}

//0 is right  Math.PI * 0.5 -y
//1 is left - Math.PI * 0.5 - y
//2 is top - Math.PI * 0.5 -x
//3 is 
//4 is front - no rotation
//5 is back bottom Math.PI  -y