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
             opacity:0.5
        })
        this.hoverPlane.plane.mesh = new THREE.Mesh(this.hoverPlane.plane.geometry, this.hoverPlane.plane.material)
        
        this.hoverPlane.plane.isPlaneInScene = false
        this.hoverPlane.plane.distanceFromBlock = 0.1
        

        this.experience.scene.add(this.hoverPlane.plane.mesh)

        this.addedBlocks = []
        this.infiniteDepthBlocks = []
        this.removedBlocks = []


       
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
        this.blocks.isBlockRemoved = false
        this.blocks.click.remove.startTime = Date.now()

        //adding duration
        if(_event.button === 2){
        this.blocks.click.add.startTime = Date.now()
        }
        window.addEventListener('mouseup', this.blocks.onMouseUp)

         }

        this.blocks.onMouseUp = (_event)=>{
        //removing duration
        this.blocks.click.remove.startTime = 0

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


        removeBlock(){
            this.hoverPlane.raycaster.setFromCamera(this.hoverPlane.viewPoint, this.experience.camera.instance)
            const intersects = this.hoverPlane.raycaster.intersectObject(this.experience.world.terrain.terrain.blocks.grass.instancedMesh)

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
                    this.removedBlocks.push(currentBlockPosition)

                    let blockBehind = false  //is there a block down and behind it
                    let blockInFront = false //is there a block down and in front it
                    let blockRight = false   //is there a block down and to the right of it
                    let blockLeft = false    //is there a block down and to the left of it
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
                    this.addedBlocks = newAddedBlocksArray
                    
                    //check if there are blocks surrounding the block below the deleted block
                    for(const _chunkArray of this.experience.world.terrain.terrain.arrayOfChunks){
                        for(const _blockPosition of _chunkArray){
                            if(_blockPosition.x === currentBlockPosition.x && _blockPosition.y === currentBlockPosition.y -5 && _blockPosition.z === currentBlockPosition.z -5){
                                blockBehind = true
                            }
                            if(_blockPosition.x === currentBlockPosition.x && _blockPosition.y === currentBlockPosition.y -5 && _blockPosition.z === currentBlockPosition.z +5){
                                blockInFront = true
                            }

                            if(_blockPosition.x === currentBlockPosition.x +5 && _blockPosition.y === currentBlockPosition.y -5 && _blockPosition.z === currentBlockPosition.z +5){
                                blockRight = true
                            }

                            if(_blockPosition.x === currentBlockPosition.x -5 && _blockPosition.y === currentBlockPosition.y -5 && _blockPosition.z === currentBlockPosition.z +5){
                              blockLeft = true
                            }
                        }
                    }

                    //move the added block down and put blocks around the block if there is not a block there already
                    let blockNumberOffset = -1
                    const newChunkArray = []
                for(const _chunkArray of this.experience.world.terrain.terrain.arrayOfChunks){
                    const newChunk = []
                    for(const _blockPosition of _chunkArray){
                        
                        if(_blockPosition.x === currentBlockPosition.x && _blockPosition.z === currentBlockPosition.z &&  _blockPosition.y === currentBlockPosition.y  ){    
                            if(!addedBlock){                       
                            newChunk.push({x:_blockPosition.x, y:_blockPosition.y -5, z:_blockPosition.z})
                            this.infiniteDepthBlocks.push({x:_blockPosition.x, y:_blockPosition.y -5, z:_blockPosition.z})
                            if(!blockBehind){
                            newChunk.push({x:_blockPosition.x, y:_blockPosition.y -5, z:_blockPosition.z -5})
                            this.infiniteDepthBlocks.push({x:_blockPosition.x, y:_blockPosition.y -5, z:_blockPosition.z -5})
                            blockNumberOffset ++

                            }
                            if(!blockInFront){
                                newChunk.push({x:_blockPosition.x, y:_blockPosition.y -5, z:_blockPosition.z +5})
                                this.infiniteDepthBlocks.push({x:_blockPosition.x, y:_blockPosition.y -5, z:_blockPosition.z +5})
                                blockNumberOffset ++
                                }
                            if(!blockRight){
                                newChunk.push({x:_blockPosition.x + 5, y:_blockPosition.y -5, z:_blockPosition.z })
                                this.infiniteDepthBlocks.push({x:_blockPosition.x + 5, y:_blockPosition.y -5, z:_blockPosition.z })
                                blockNumberOffset ++
                                }
                            if(!blockLeft){
                                newChunk.push({x:_blockPosition.x -5, y:_blockPosition.y -5, z:_blockPosition.z })
                                this.infiniteDepthBlocks.push({x:_blockPosition.x -5, y:_blockPosition.y -5, z:_blockPosition.z })
                                blockNumberOffset ++
                                }
                            }
                            
                            }else{
                                    newChunk.push(_blockPosition)

                        }
                    }
                    newChunkArray.push(newChunk)
                }

                //rebuild the terrain
                this.experience.world.terrain.getBoundrys(newChunkArray)
                this.experience.world.terrain.terrain.blockNumber -= 1
                this.experience.world.terrain.displayBlocks(newChunkArray, true)
                this.experience.world.terrain.terrain.arrayOfChunks = newChunkArray

                console.log(this.infiniteDepthBlocks);
            }
        }

        addBlock(){

            this.hoverPlane.raycaster.setFromCamera(this.hoverPlane.viewPoint, this.experience.camera.instance)
            const intersects = this.hoverPlane.raycaster.intersectObject(this.experience.world.terrain.terrain.blocks.grass.instancedMesh)

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
                        newBlockPosition = {
                            x:intersectingObject.x - 2.5, 
                            y:Math.round(intersectingObject.y / 5) * 5, 
                            z:Math.round(intersectingObject.z / 5) * 5, 
    
                        }
                    break;
                    case 2:
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
                //     case 3:
                //         newBlockPosition = {
                //             x:Math.round(intersectingObject.x / 5) * 5 , 
                //             y:intersectingObject.y - 2.5, 
                //             z:Math.round(intersectingObject.z / 5) * 5 , 
    
                //         }
                // //     break;
                    case 4:
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
                        newBlockPosition = {
                            x:Math.round(intersectingObject.x / 5) * 5, 
                            y:Math.round(intersectingObject.y / 5) * 5, 
                            z:intersectingObject.z -2.5, 
    
                        }
                    break;

                }
    //add the new block to the scene
                this.addedBlocks.push(newBlockPosition)
                
                const newChunkArray = []
           for(const _arrayOfChunks of this.experience.world.terrain.terrain.arrayOfChunks){
               const newChunk = []
            for(const _blockPosition of _arrayOfChunks){
                if(_blockPosition.x === currentBlockPosition.x  && _blockPosition.z === currentBlockPosition.z && _blockPosition.y === currentBlockPosition.y){
                    newChunk.push(_blockPosition)
                    newChunk.push(newBlockPosition)

                }
                else{
                    newChunk.push(_blockPosition)

                }
            }
            newChunkArray.push(newChunk)
           }
           
        this.experience.world.terrain.terrain.blockNumber += 1
        this.experience.world.terrain.displayBlocks(newChunkArray, true)
        this.experience.world.terrain.terrain.arrayOfChunks = newChunkArray
        this.experience.world.terrain.getBoundrys(newChunkArray)
            
            }

        }


    update(){
        //updating the hovering plane
        this.hoverPlane.raycaster.setFromCamera(this.hoverPlane.viewPoint, this.experience.camera.instance)

        const intersects = this.hoverPlane.raycaster.intersectObject(this.experience.world.terrain.terrain.blocks.grass.instancedMesh)

       

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
                    this.hoverPlane.plane.mesh.rotation.y = Math.PI * 0.5
                    this.hoverPlane.plane.mesh.rotation.x = 0
                    this.hoverPlane.plane.mesh.rotation.z = 0

                    this.hoverPlane.plane.mesh.position.x = intersectingFace.x + this.hoverPlane.plane.distanceFromBlock
                    this.hoverPlane.plane.mesh.position.z = (Math.round(intersectingFace.z / 5) * 5)
                    this.hoverPlane.plane.mesh.position.y =  (Math.round(intersectingFace.y / 5) * 5)
                    
                    !this.hoverPlane.plane.isPlaneInScene?  this.experience.scene.add(this.hoverPlane.plane.mesh): ''
                    break;
                    case 1:
                        this.hoverPlane.plane.mesh.rotation.y = - Math.PI * 0.5
                        this.hoverPlane.plane.mesh.rotation.x = 0
                    this.hoverPlane.plane.mesh.rotation.z = 0

                    this.hoverPlane.plane.mesh.position.x = intersectingFace.x - this.hoverPlane.plane.distanceFromBlock
                    this.hoverPlane.plane.mesh.position.y =  (Math.round(intersectingFace.y / 5) * 5)
                    this.hoverPlane.plane.mesh.position.z =  (Math.round(intersectingFace.z / 5) * 5)
                    
                    !this.hoverPlane.plane.isPlaneInScene?  this.experience.scene.add(this.hoverPlane.plane.mesh): ''

                    break; 
                    case 2:
                    this.hoverPlane.plane.mesh.rotation.x = - (Math.PI * 0.5)
                    this.hoverPlane.plane.mesh.rotation.y = 0
                    this.hoverPlane.plane.mesh.rotation.z = 0

                    this.hoverPlane.plane.mesh.position.x =  (Math.round(intersectingFace.x / 5) * 5)
                    this.hoverPlane.plane.mesh.position.z =  (Math.round(intersectingFace.z / 5) * 5)
                    this.hoverPlane.plane.mesh.position.y = intersectingFace.y +  this.hoverPlane.plane.distanceFromBlock
                    
                    !this.hoverPlane.plane.isPlaneInScene?  this.experience.scene.add(this.hoverPlane.plane.mesh): ''

                    break;
                    case 4:
                        
                    this.hoverPlane.plane.mesh.rotation.x = 0
                    this.hoverPlane.plane.mesh.rotation.y = 0
                    this.hoverPlane.plane.mesh.rotation.z = 0

                    this.hoverPlane.plane.mesh.position.x =  (Math.round(intersectingFace.x / 5) * 5)
                    this.hoverPlane.plane.mesh.position.y =  (Math.round(intersectingFace.y / 5) * 5)
                     this.hoverPlane.plane.mesh.position.z =  intersectingFace.z +  this.hoverPlane.plane.distanceFromBlock
                    
                    !this.hoverPlane.plane.isPlaneInScene?  this.experience.scene.add(this.hoverPlane.plane.mesh): ''
                    break;
                    case 5:
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
            if(this.blocks.click.remove.elapsed >= 0.6 && !this.blocks.isBlockRemoved){
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