import * as THREE from 'three'
import Experience from '../Experience'
import {PointerLockControls} from 'three/examples/jsm/controls/PointerLockControls'

export default class Controls{
    constructor(){
        this.experience = new Experience()

        this.setControls()
        if(this.experience.debug.active){
            this.setDebug()
        }

        this.testMesh = new THREE.Mesh(
            new THREE.BoxBufferGeometry(5,5,5), 
            new THREE.MeshBasicMaterial()
        )
    }

    setControls(){
       this.controls = {}
       this.controls.pointerLock = new PointerLockControls(this.experience.camera.instance, document.body)
       this.controls.keysPressed = []
       this.controls.speed = 0.4
       this.controls.sprintSpeed = 0.6
       this.controls.jumpHeight = 0.75
       this.controls.isSprinting = false
       this.controls.heightOfPlayer = 12
       this.controls.decceleration = 1.08
       this.controls.forwardSmoothedSpeed = 0
       this.controls.rightSmoothedSpeed = 0
       this.controls.isBlockIntersecting = false
       this.controls.canPlayerMove = true

       this.player = {
        width : 0.6, // width
        height : 8, // height
        depth : 0.5, // depth
        x : this.experience.camera.instance.position.x,
        y : this.experience.camera.instance.position.y,
        z : this.experience.camera.instance.position.z,
       moveForward: ()=>{
        this.controls.pointerLock.moveForward(this.controls.isSprinting? this.controls.sprintSpeed: this.controls.speed)
       }, 
       moveBackward: ()=>{
        this.controls.pointerLock.moveForward(this.controls.isSprinting? -this.controls.sprintSpeed: -this.controls.speed)
       }, 
       moveRight: ()=>{
        this.controls.pointerLock.moveRight(this.controls.isSprinting? this.controls.sprintSpeed: this.controls.speed)
       }, 
       moveLeft: ()=>{
        this.controls.pointerLock.moveRight(this.controls.isSprinting? -this.controls.sprintSpeed: -this.controls.speed)
       }, 

    }


       //controls
       this.controls.forward = 'w'
       this.controls.back = 's'
       this.controls.right = 'd'
       this.controls.left = 'a'
       this.controls.jump = ' '

       //gravity 
       this.controls.gravity = {}
       this.controls.gravity.raycaster = new THREE.Raycaster()
       this.controls.gravity.speed = 0
       this.controls.gravity.acceleration = 0.03
       this.controls.gravity.isBlockIntersecting = false
       this.controls.gravity.canJump = true

       //time between W presses
       this.controls.updatedBlockPositions = undefined
       this.controls.startTime = this.experience.time.elapsed
       this.controls.isWPressed = false
  
       //check how long a movment key was pressed 
        this.controls.keystart = 0
        this.controls.elapsedTime = 0


       //events
       //initialising the controls
       this.controls.onBodyClick = ()=>{
        this.controls.pointerLock.lock()
        
        
     }

       document.body.addEventListener('click',this.controls.onBodyClick, false)

      //events for moving
      this.controls.onKeyDown = (_event) =>{
          if(_event.key === this.controls.jump && this.controls.gravity.canJump){
                this.controls.gravity.speed -=  this.controls.jumpHeight
                this.controls.gravity.canJump = false
                this.controls.canPlayerMove = true
            
          }
          this.controls.keysPressed.push(_event.key)

          if(this.controls.keystart === 0){
              this.controls.keystart = this.experience.time.elapsed
          }
          //test if the W key was pressed quickly twice
        if(_event.key === this.controls.forward){
            if(!this.controls.isWPressed){
                if(this.experience.time.elapsed - this.controls.startTime < 0.15 ){
                    this.controls.isSprinting = true

                }else{
                    this.controls.isSprinting = false
                }
            }
                this.controls.isWPressed = true
        }

          window.addEventListener('keyup', this.controls.onKeyUp)
        }

      this.controls.onKeyUp = (_event) =>{
          const newKeysArray = []
        this.controls.keysPressed.map((key)=>{
            key !== _event.key? newKeysArray.push(key): ''
        })
        this.controls.keysPressed = newKeysArray

        //reset the start time of the W press
        if(_event.key ===this.controls.forward){
            this.controls.isWPressed = false
            this.controls.startTime = this.experience.time.elapsed
            this.controls.canPlayerMove = true
        }

        //get the time that a key was pressed for
        this.controls.elapsed = this.experience.time.elapsed - this.controls.keystart
        this.controls.keystart = 0

    }

    window.addEventListener('keydown', this.controls.onKeyDown)       

    }

    setDebug(){
        this.debugFolder = this.experience.debug.gui.addFolder('controls')

        this.debugFolder.add(this.controls, 'speed', 0.1, 1, 0.001)
        this.debugFolder.add(this.controls, 'jumpHeight', 0.1, 1, 0.001)


    }

    
    easing(){
        // if(this.controls.forwardSmoothedSpeed !== 0){
            this.controls.forwardSmoothedSpeed /= this.controls.decceleration
            this.controls.pointerLock.moveForward(this.controls.forwardSmoothedSpeed * this.controls.speed)
        //    }
       
            this.controls.rightSmoothedSpeed /= this.controls.decceleration
            this.controls.pointerLock.moveRight(this.controls.rightSmoothedSpeed * this.controls.speed)
       
    }



    update(){
        //check if keys are being pressed and move if they are
       if(this.controls.keysPressed.includes(this.controls.forward)){
        // let isBlockIntersecting = false
        // this.controls.isBlockIntersecting = false
        for(const _chunkArray of this.experience.world.terrain.terrain.arrayOfChunks){
            for(const _blockPosition of _chunkArray){
              if(this.experience.camera.instance.position.x <= _blockPosition.x +2.5 &&
                this.experience.camera.instance.position.x >= _blockPosition.x - 2.5  && 
                this.experience.camera.instance.position.z <= _blockPosition.z +2.5 &&
                this.experience.camera.instance.position.z >= _blockPosition.z - 2.5 ){
                this.intersectingBlock = _blockPosition
             }
             //positive x
             if(this.intersectingBlock && this.intersectingBlock.x +5 === _blockPosition.x && this.intersectingBlock.z === _blockPosition.z && this.intersectingBlock.y < _blockPosition.y && this.experience.camera.instance.position.y- 12 === this.intersectingBlock.y){
                if(this.experience.camera.instance.position.x - this.intersectingBlock.x > 2){
                    this.controls.isBlockIntersecting = true
                    this.controls.forwardSmoothedSpeed = -0.5
                    this.controls.canPlayerMove = false


                 }
             }
             //negative x
             if(this.intersectingBlock && this.intersectingBlock.x -5 === _blockPosition.x && this.intersectingBlock.z === _blockPosition.z && this.intersectingBlock.y < _blockPosition.y && this.experience.camera.instance.position.y- 12 === this.intersectingBlock.y){
                if(this.experience.camera.instance.position.x - this.intersectingBlock.x < -1.75){
                    this.controls.isBlockIntersecting = true
                    this.controls.forwardSmoothedSpeed = -0.5
                    this.controls.canPlayerMove = false


                 }
             }
             //positive z
             if(this.intersectingBlock && this.intersectingBlock.x === _blockPosition.x && this.intersectingBlock.z + 5 === _blockPosition.z && this.intersectingBlock.y < _blockPosition.y && this.experience.camera.instance.position.y- 12 === this.intersectingBlock.y){
                if(this.experience.camera.instance.position.z - this.intersectingBlock.z > 2){
                    this.controls.isBlockIntersecting = true
                    this.controls.forwardSmoothedSpeed = - 0.5
                    this.controls.canPlayerMove = false

                 }
             }
             //negative z
             if(this.intersectingBlock && this.intersectingBlock.x === _blockPosition.x && this.intersectingBlock.z - 5 === _blockPosition.z && this.intersectingBlock.y < _blockPosition.y && this.experience.camera.instance.position.y- 12 === this.intersectingBlock.y){
                if(this.experience.camera.instance.position.z - this.intersectingBlock.z < -1.75){
                this.controls.isBlockIntersecting = true
                this.controls.forwardSmoothedSpeed = - 0.5
                this.controls.canPlayerMove = false
         
                 }
             }
          
            }
        }
        if(!this.isBlockIntersecting && this.controls.canPlayerMove){
        this.player.moveForward()
        this.controls.elapsed > 0.3? this.controls.forwardSmoothedSpeed = 1 : this.controls.forwardSmoothedSpeed = 0.4
    }

 }
        if(this.controls.keysPressed.includes(this.controls.back)){



            
this.player.moveBackward()
this.controls.elapsed > 0.3? this.controls.forwardSmoothedSpeed = -1 : this.controls.forwardSmoothedSpeed = -0.4


       }
        if(this.controls.keysPressed.includes(this.controls.left)){
            this.player.moveLeft()
            this.controls.elapsed > 0.3? this.controls.rightSmoothedSpeed = -1 : this.controls.rightSmoothedSpeed = -0.4

       }
        if(this.controls.keysPressed.includes(this.controls.right)){
            this.player.moveRight()
            this.controls.elapsed > 0.3? this.controls.rightSmoothedSpeed = 1 : this.controls.rightSmoothedSpeed = 0.4
       }

       //decceseration
       if(!this.controls.keysPressed.includes(this.controls.forward) &&
        !this.controls.keysPressed.includes(this.controls.back) &&
        !this.controls.keysPressed.includes(this.controls.left) && 
        !this.controls.keysPressed.includes(this.controls.right) 
        && this.controls.canPlayerMove ){
            this.easing()
       }

       if(this.controls.isBlockIntersecting){
        this.easing()
       }
    // gravity
       this.experience.camera.instance.position.y -= this.controls.gravity.speed
       this.controls.gravity.speed += this.controls.gravity.acceleration
   
    // let testingPositions = null
    // this.controls.updatedBlockPositions === undefined? testingPositions = this.experience.world.terrain.terrain.arrayOfChunks: testingPositions = this.controls.updatedBlockPositions
for(const _chunkArray of this.experience.world.terrain.terrain.arrayOfChunks){
    for(const _blockPosition of _chunkArray){
        if(this.experience.camera.instance.position.x <= _blockPosition.x +2.5 &&
          this.experience.camera.instance.position.x >= _blockPosition.x - 2.5  && 
          this.experience.camera.instance.position.z <= _blockPosition.z +2.5 &&
          this.experience.camera.instance.position.z >= _blockPosition.z - 2.5 ){
           if(this.experience.camera.instance.position.y <= _blockPosition.y + this.controls.heightOfPlayer &&
           this.experience.camera.instance.position.y >= _blockPosition.y 
            ){
            this.controls.gravity.speed = 0
          this.experience.camera.instance.position.y = _blockPosition.y + this.controls.heightOfPlayer
          this.controls.gravity.canJump = true
        }
     
          }
    }
}







    }
}           
