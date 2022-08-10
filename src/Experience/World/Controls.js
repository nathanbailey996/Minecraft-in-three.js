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

        }

        //get the time that a key was pressed for
        this.controls.elapsed = this.experience.time.elapsed - this.controls.keystart
        this.controls.keystart = 0

        //if the time pressing a key is more than 0.3 seconds the decceleration takes longer
        if(this.controls.elapsed > 0.3){
            this.controls.forwardSmoothedSpeed = 1
            
        }
        else{
          this.controls.forwardSmoothedSpeed = 0.4
            
        }
        switch(_event.key){
            case this.controls.back:
            this.controls.forwardSmoothedSpeed *=-1
            this.controls.rightSmoothedSpeed = 0
            break;
            case this.controls.forward:
            this.controls.rightSmoothedSpeed = 0
            break;
            case this.controls.right:
            this.controls.rightSmoothedSpeed = this.controls.forwardSmoothedSpeed
            this.controls.forwardSmoothedSpeed = 0
            break;
            case this.controls.left:
            this.controls.rightSmoothedSpeed = this.controls.forwardSmoothedSpeed * -1
            this.controls.forwardSmoothedSpeed = 0

            
            
        }
        
    }

    window.addEventListener('keydown', this.controls.onKeyDown)       
this.testGeometry = new THREE.BoxBufferGeometry(5,5,5)
this.testMaterial = new THREE.MeshBasicMaterial({color:0xff0000})




    }

    setDebug(){
        this.debugFolder = this.experience.debug.gui.addFolder('controls')

        this.debugFolder.add(this.controls, 'speed', 0.1, 1, 0.001)
        this.debugFolder.add(this.controls, 'jumpHeight', 0.1, 1, 0.001)


    }



    update(){
        //check if keys are being pressed and move if they are
       if(this.controls.keysPressed.includes(this.controls.forward)){
        this.controls.pointerLock.moveForward(this.controls.isSprinting? this.controls.sprintSpeed: this.controls.speed)
 }
        if(this.controls.keysPressed.includes(this.controls.back)){
        this.controls.pointerLock.moveForward(-this.controls.speed)
       }
        if(this.controls.keysPressed.includes(this.controls.left)){
        this.controls.pointerLock.moveRight(-this.controls.speed)
       }
        if(this.controls.keysPressed.includes(this.controls.right)){
        this.controls.pointerLock.moveRight(this.controls.speed)
       }

       //decceseration
       if(!this.controls.keysPressed.includes(this.controls.forward) &&
        !this.controls.keysPressed.includes(this.controls.back) &&
        !this.controls.keysPressed.includes(this.controls.left) && 
        !this.controls.keysPressed.includes(this.controls.right)
       ){
           if(this.controls.forwardSmoothedSpeed !== 0){
            this.controls.forwardSmoothedSpeed /= this.controls.decceleration
            this.controls.pointerLock.moveForward(this.controls.forwardSmoothedSpeed * this.controls.speed)
           }
           else{
            this.controls.rightSmoothedSpeed /= this.controls.decceleration
            this.controls.pointerLock.moveRight(this.controls.rightSmoothedSpeed * this.controls.speed)
           }
       
    

       }

   
    // gravity
       this.experience.camera.instance.position.y -= this.controls.gravity.speed
       this.controls.gravity.speed += this.controls.gravity.acceleration
   
    let testingPositions = null
    this.controls.updatedBlockPositions === undefined? testingPositions = this.experience.world.terrain.terrain.arrayOfChunks: testingPositions = this.controls.updatedBlockPositions
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
