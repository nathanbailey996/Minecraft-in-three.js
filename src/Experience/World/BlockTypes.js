import * as THREE from 'three'
import Experience from '../Experience'

export default class BlockTypes{
    constructor(){
        this.experience = new Experience()

       this.setBlockTypes()  
       this.setBlockbar()  
       if(this.experience.debug.active){
        this.debugFolder = this.experience.debug.gui.addFolder('hotbar')
       } 
       this.setDebug()
    }

    setBlockTypes(){
      this.geometry = new THREE.BoxBufferGeometry(5,5,5)
      this.blocks = {}
      //grass
      this.blocks.grass = {}
      this.blocks.grass.geometry = this.geometry, 
          this.blocks.grass.material = [
              new THREE.MeshBasicMaterial({map:this.experience.loaders.items.grassBlockSide}), 
              new THREE.MeshBasicMaterial({map:this.experience.loaders.items.grassBlockSide}), 
              new THREE.MeshBasicMaterial({map:this.experience.loaders.items.grassBlockTop}), 
              new THREE.MeshBasicMaterial({map:this.experience.loaders.items.grassBlockBottom}), 
              new THREE.MeshBasicMaterial({map:this.experience.loaders.items.grassBlockSide}), 
              new THREE.MeshBasicMaterial({map:this.experience.loaders.items.grassBlockSide}), 
          ], 
          this.blocks.grass.count = 0
          this.blocks.grass.instancedMesh = new THREE.InstancedMesh(this.blocks.grass.geometry, this.blocks.grass.material, this.blocks.grass.count)

          //dirt
          this.blocks.dirtBlock = {}
          this.blocks.dirtBlock.geometry = this.geometry
          this.blocks.dirtBlock.material = [
            new THREE.MeshBasicMaterial({ map:this.experience.loaders.items.grassBlockBottom}),
            new THREE.MeshBasicMaterial({ map:this.experience.loaders.items.grassBlockBottom}),
            new THREE.MeshBasicMaterial({ map:this.experience.loaders.items.grassBlockBottom}),
            new THREE.MeshBasicMaterial({ map:this.experience.loaders.items.grassBlockBottom}),
            new THREE.MeshBasicMaterial({ map:this.experience.loaders.items.grassBlockBottom}),
            new THREE.MeshBasicMaterial({ map:this.experience.loaders.items.grassBlockBottom}),
          ]
          this.blocks.dirtBlock.count = 0
          this.blocks.dirtBlock.instancedMesh = new THREE.InstancedMesh(this.blocks.dirtBlock.geometry, this.blocks.dirtBlock.material, this.blocks.dirtBlock.count)

          //stone
          this.blocks.stoneBlock = {}
          this.blocks.stoneBlock.geometry = this.geometry
          this.blocks.stoneBlock.material = [
            new THREE.MeshBasicMaterial({ map:this.experience.loaders.items.stoneBlock}),
            new THREE.MeshBasicMaterial({ map:this.experience.loaders.items.stoneBlock}),
            new THREE.MeshBasicMaterial({ map:this.experience.loaders.items.stoneBlock}),
            new THREE.MeshBasicMaterial({ map:this.experience.loaders.items.stoneBlock}),
            new THREE.MeshBasicMaterial({ map:this.experience.loaders.items.stoneBlock}),
            new THREE.MeshBasicMaterial({ map:this.experience.loaders.items.stoneBlock}),
          ]
          this.blocks.stoneBlock.count = 0
          this.blocks.stoneBlock.instancedMesh = new THREE.InstancedMesh(this.blocks.stoneBlock.geometry, this.blocks.stoneBlock.material, this.blocks.stoneBlock.count)
          
         //bedrock
         this.blocks.bedrockBlock = {}
         this.blocks.bedrockBlock.geometry = this.geometry
         this.blocks.bedrockBlock.material = [
           new THREE.MeshBasicMaterial({ map:this.experience.loaders.items.bedrockBlock}),
           new THREE.MeshBasicMaterial({ map:this.experience.loaders.items.bedrockBlock}),
           new THREE.MeshBasicMaterial({ map:this.experience.loaders.items.bedrockBlock}),
           new THREE.MeshBasicMaterial({ map:this.experience.loaders.items.bedrockBlock}),
           new THREE.MeshBasicMaterial({ map:this.experience.loaders.items.bedrockBlock}),
           new THREE.MeshBasicMaterial({ map:this.experience.loaders.items.bedrockBlock}),
         ]
         this.blocks.bedrockBlock.count = 0
         this.blocks.bedrockBlock.instancedMesh = new THREE.InstancedMesh(this.blocks.bedrockBlock.geometry, this.blocks.bedrockBlock.material, this.blocks.bedrockBlock.count)  

          //wood
          this.blocks.woodBlock = {}
          this.blocks.woodBlock.geometry = this.geometry
          this.blocks.woodBlock.material = [
            new THREE.MeshBasicMaterial({ map:this.experience.loaders.items.woodBlock}),
            new THREE.MeshBasicMaterial({ map:this.experience.loaders.items.woodBlock}),
            new THREE.MeshBasicMaterial({ map:this.experience.loaders.items.woodBlock}),
            new THREE.MeshBasicMaterial({ map:this.experience.loaders.items.woodBlock}),
            new THREE.MeshBasicMaterial({ map:this.experience.loaders.items.woodBlock}),
            new THREE.MeshBasicMaterial({ map:this.experience.loaders.items.woodBlock}),
          ]
          this.blocks.woodBlock.count = 0
          this.blocks.woodBlock.instancedMesh = new THREE.InstancedMesh(this.blocks.woodBlock.geometry, this.blocks.woodBlock.material, this.blocks.woodBlock.count)  
          
          //brick
          this.blocks.brickBlock = {}
          this.blocks.brickBlock.geometry = this.geometry
          this.blocks.brickBlock.material = [
            new THREE.MeshBasicMaterial({ map:this.experience.loaders.items.brickBlock}),
            new THREE.MeshBasicMaterial({ map:this.experience.loaders.items.brickBlock}),
            new THREE.MeshBasicMaterial({ map:this.experience.loaders.items.brickBlock}),
            new THREE.MeshBasicMaterial({ map:this.experience.loaders.items.brickBlock}),
            new THREE.MeshBasicMaterial({ map:this.experience.loaders.items.brickBlock}),
            new THREE.MeshBasicMaterial({ map:this.experience.loaders.items.brickBlock}),
          ]
          this.blocks.brickBlock.count = 0
          this.blocks.brickBlock.instancedMesh = new THREE.InstancedMesh(this.blocks.brickBlock.geometry, this.blocks.brickBlock.material, this.blocks.brickBlock.count) 
          
          //tree block
          this.blocks.treeBlock = {}
          this.blocks.treeBlock.geometry = this.geometry
          this.blocks.treeBlock.material = [
            new THREE.MeshBasicMaterial({ map:this.experience.loaders.items.treeBlock}),
            new THREE.MeshBasicMaterial({ map:this.experience.loaders.items.treeBlock}),
            new THREE.MeshBasicMaterial({ map:this.experience.loaders.items.treeBlock}),
            new THREE.MeshBasicMaterial({ map:this.experience.loaders.items.treeBlock}),
            new THREE.MeshBasicMaterial({ map:this.experience.loaders.items.treeBlock}),
            new THREE.MeshBasicMaterial({ map:this.experience.loaders.items.treeBlock}),
          ]
          this.blocks.treeBlock.count = 0
          this.blocks.treeBlock.instancedMesh = new THREE.InstancedMesh(this.blocks.treeBlock.geometry, this.blocks.treeBlock.material, this.blocks.treeBlock.count) 
 
           //sand block
           this.blocks.sandBlock = {}
           this.blocks.sandBlock.geometry = this.geometry
           this.blocks.sandBlock.material = [
             new THREE.MeshBasicMaterial({ map:this.experience.loaders.items.sandBlock}),
             new THREE.MeshBasicMaterial({ map:this.experience.loaders.items.sandBlock}),
             new THREE.MeshBasicMaterial({ map:this.experience.loaders.items.sandBlock}),
             new THREE.MeshBasicMaterial({ map:this.experience.loaders.items.sandBlock}),
             new THREE.MeshBasicMaterial({ map:this.experience.loaders.items.sandBlock}),
             new THREE.MeshBasicMaterial({ map:this.experience.loaders.items.sandBlock}),
           ]
           this.blocks.sandBlock.count = 0
           this.blocks.sandBlock.instancedMesh = new THREE.InstancedMesh(this.blocks.sandBlock.geometry, this.blocks.sandBlock.material, this.blocks.sandBlock.count) 

            //water block
            this.blocks.waterBlock = {}
            this.blocks.waterBlock.geometry = this.geometry
            this.blocks.waterBlock.material = [
              new THREE.MeshBasicMaterial({ map:this.experience.loaders.items.waterBlock, transparent:true, opacity:0.2}),
              new THREE.MeshBasicMaterial({ map:this.experience.loaders.items.waterBlock, transparent:true, opacity:0.2}),
              new THREE.MeshBasicMaterial({ map:this.experience.loaders.items.waterBlock, transparent:true, opacity:0.7}),
              new THREE.MeshBasicMaterial({ map:this.experience.loaders.items.waterBlock, transparent:true, opacity:0.7}),
              new THREE.MeshBasicMaterial({ map:this.experience.loaders.items.waterBlock, transparent:true, opacity:0.2}),
              new THREE.MeshBasicMaterial({ map:this.experience.loaders.items.waterBlock, transparent:true, opacity:0.2}),
            ]
            this.blocks.waterBlock.count = 0
            this.blocks.waterBlock.instancedMesh = new THREE.InstancedMesh(this.blocks.waterBlock.geometry, this.blocks.waterBlock.material, this.blocks.waterBlock.count) 

    }

    //Menu for changing the block
    setBlockbar(){
      this.blockbar = {}
      this.blockbar.currentBlockIndex = 1
       this.debugObject = {
        background:'#2a4911', 
        lightBorder:'#c4b5b5', 
        darkBorder:'#6d6868'
      }

      this.upateBlockBorder()

      this.blockbar.onKeyDown = (_event)=>{
        switch(_event.key){
          case '1':
          this.blockbar.currentBlockIndex = 1
          break;
          case '2':
          this.blockbar.currentBlockIndex = 2
          break;
          case '3':
          this.blockbar.currentBlockIndex = 3
          break;
          case '4':
          this.blockbar.currentBlockIndex = 4
          break;
          case '5':
          this.blockbar.currentBlockIndex = 5
          break;
          case '6':
          this.blockbar.currentBlockIndex = 6
          break;
          case '7':
          this.blockbar.currentBlockIndex = 7
          break;
          case '8':
          this.blockbar.currentBlockIndex = 8
          break;
          case '9':
          this.blockbar.currentBlockIndex = 9
          break;
        }
        this.upateBlockBorder()
      }
      
      window.addEventListener('keydown', this.blockbar.onKeyDown)

      this.animationBlock = new THREE.Mesh(
        new THREE.BoxBufferGeometry(20,20,20), 
        new THREE.MeshBasicMaterial({color:0xff0000})
      )
      // this.animationBlock.position.copy(this.experience.camera.instance.position)
      // this.experience.scene.add(this.animationBlock)
      

    }

     upateBlockBorder(){
      for(let i = 1; i<= 9; i++){
        if(i === this.blockbar.currentBlockIndex){
          const currentBlock = document.querySelector(`#block${i}`)
          currentBlock.style.border  = `solid ${this.debugObject.lightBorder} 5px`
          currentBlock.style.transform = 'scale(1.2)'
          currentBlock.style.zIndex = '2'
          
        }
        else{
          const currentBlock = document.querySelector(`#block${i}`)
          currentBlock.style.border = `solid ${this.debugObject.darkBorder} 5px`
          currentBlock.style.transform = 'scale(1)'
          currentBlock.style.zIndex = '1'
        }
      }
    }

    setDebug(){
      if(this.debugFolder){
        this.debugFolder.addColor(this.debugObject, 'darkBorder').onChange(()=>{
          this.upateBlockBorder()
        })

        this.debugFolder.addColor(this.debugObject, 'lightBorder').onChange(()=>{
          this.upateBlockBorder()
        })
        
      }
    }
}

