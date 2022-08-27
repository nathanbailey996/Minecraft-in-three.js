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
       this.controls.pointerLock = this.experience.world.pointerLock
       this.controls.keysPressed = []
    
       //player
       this.player = {
        canPlayerMove:true, 
        speed:0.4, 
        sprintSpeed:0.6, 
        jumpHeight:0.75, 
        isSprinting:false, 
        height:10, 
        decceleration:1.08, 
        forwardSmoothedSpeed:0, 
        rightSmoothedSpeed:0, 
        intersectionSmoothing:false,
        isBlockIntersecting:false,
        rotation:{},
       moveForward: ()=>{
        this.controls.pointerLock.moveForward(this.player.isSprinting? this.player.sprintSpeed: this.player.speed)
        this.player.isSprinting? this.player.sprintSpeed: this.player.speed
       }, 
       moveBackward: ()=>{
        this.controls.pointerLock.moveForward(this.player.isSprinting? -this.player.sprintSpeed: -this.player.speed)
       }, 
       moveRight: ()=>{
        this.controls.pointerLock.moveRight(this.player.isSprinting? this.player.sprintSpeed: this.player.speed)
       }, 
       moveLeft: ()=>{
        this.controls.pointerLock.moveRight(this.player.isSprinting? -this.player.sprintSpeed: -this.player.speed)
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
    //    this.controls.onBodyClick = ()=>{
    //     this.controls.pointerLock.lock()
    //  }

    //    document.body.addEventListener('click',this.controls.onBodyClick, false)

      //events for moving
      this.controls.onKeyDown = (_event) =>{
          if(_event.key === this.controls.jump && this.controls.gravity.canJump){
                this.controls.gravity.speed -=  this.player.jumpHeight
                this.controls.gravity.canJump = false
                this.player.canPlayerMove = true
            
          }
          this.controls.keysPressed.push(_event.key)

          if(this.controls.keystart === 0){
              this.controls.keystart = this.experience.time.elapsed
          }
          //test if the W key was pressed quickly twice
        if(_event.key === this.controls.forward){
            if(!this.controls.isWPressed){
                if(this.experience.time.elapsed - this.controls.startTime < 0.15 ){
                    this.player.isSprinting = true

                }else{
                    this.player.isSprinting = false
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

        // if(this.player.canPlayerMove){
        //     if(_event.key === this.controls.forward){
        //         //forward
        //     this.controls.elapsed > 0.3? this.player.forwardSmoothedSpeed = 1 : this.player.forwardSmoothedSpeed = 0.05
        //     }
        //     //back
        //     if(_event.key ===  this.controls.back){
        //     this.controls.elapsed > 0.3? this.player.forwardSmoothedSpeed = -1 : this.player.forwardSmoothedSpeed = -0.05
        //     }
        //     //right
        //     if(_event.key ===  this.controls.right){
        //     this.controls.elapsed > 0.3? this.player.rightSmoothedSpeed = 1 : this.player.rightSmoothedSpeed = 0.05
        //     }
        //     //left
        //     if(_event.key ===  this.controls.left){
        //         this.controls.elapsed > 0.3? this.player.rightSmoothedSpeed = -1 : this.player.rightSmoothedSpeed = -0.05
        //     }
        //     this.player.intersectionSmoothing = false

        //     }

        //get the time that a key was pressed for
        this.controls.elapsed = this.experience.time.elapsed - this.controls.keystart
        this.controls.keystart = 0

        if(_event.key === this.controls.forward || _event.key === this.controls.back || _event.key === this.controls.right || _event.key === this.controls.left){
            this.player.canPlayerMove = true
        }

    }

    window.addEventListener('keydown', this.controls.onKeyDown)       

    }

    setDebug(){
        this.debugFolder = this.experience.debug.gui.addFolder('controls')

        this.debugFolder.add(this.player, 'speed', 0.1, 1, 0.001)
        this.debugFolder.add(this.player, 'jumpHeight', 0.1, 1, 0.001)
    }

    //EASING
    easing(){
            this.player.forwardSmoothedSpeed /= this.player.decceleration
            this.controls.pointerLock.moveForward(this.player.forwardSmoothedSpeed * this.player.speed)
        
            this.player.rightSmoothedSpeed /= this.player.decceleration
            this.controls.pointerLock.moveRight(this.player.rightSmoothedSpeed * this.player.speed)
       
    }

    //INTERSECTION
    intersect(_forwardSmoothingSpeed, _rightSmoothingSpeed){
        for(const _chunkArray of this.experience.world.terrain.terrain.arrayOfChunks){
            let breakLoop = false
            for(const _blockPosition of _chunkArray){
                //check if the player is beneath a block
              if(this.experience.camera.instance.position.x <= _blockPosition.x +2.5 &&
                this.experience.camera.instance.position.x >= _blockPosition.x - 2.5  && 
                this.experience.camera.instance.position.z <= _blockPosition.z +2.5 &&
                this.experience.camera.instance.position.z >= _blockPosition.z - 2.5 && (this.experience.camera.instance.position.y === _blockPosition.y + this.player.height) ) {
                this.intersectingBlock = _blockPosition
                // this.test.position.copy(_blockPosition)
                // console.log((this.experience.camera.instance.position.y - (_blockPosition.y + this.player.height)) )

             }
             //positive x
             if(this.intersectingBlock && this.intersectingBlock.x +5 === _blockPosition.x && this.intersectingBlock.z === _blockPosition.z && this.intersectingBlock.y < _blockPosition.y && this.experience.camera.instance.position.y - _blockPosition.y <=5 && (this.experience.camera.instance.position.y - _blockPosition.y) >=0 ){
                if(this.experience.camera.instance.position.x - this.intersectingBlock.x > 2){
                    // this.player.isBlockIntersecting = true
                    // this.player.forwardSmoothedSpeed = _forwardSmoothingSpeed
                    // this.player.rightSmoothedSpeed = _rightSmoothingSpeed
                    // this.player.intersectionSmoothing = true
                    // // this.player.canPlayerMove = false
                    // isIntersection= true
                    // this.player.isSprinting = false
                    breakLoop = true
                    return true;
                    
                    
                } 
             }
             //negative x
             if(this.intersectingBlock && this.intersectingBlock.x -5 === _blockPosition.x && this.intersectingBlock.z === _blockPosition.z && this.intersectingBlock.y < _blockPosition.y && this.experience.camera.instance.position.y - _blockPosition.y <=5 && (this.experience.camera.instance.position.y - _blockPosition.y) >=0 ){
                if(this.experience.camera.instance.position.x - this.intersectingBlock.x < -1.75){
                    // this.player.isBlockIntersecting = true
                    // this.player.forwardSmoothedSpeed = _forwardSmoothingSpeed
                    // this.player.rightSmoothedSpeed = _rightSmoothingSpeed
                    // this.player.intersectionSmoothing = true
                    // // this.player.canPlayerMove = false
                    // isIntersection = true
                    // this.player.isSprinting = false
                    breakLoop = true
                    return true
                 } 
             }
             //positive z
             if(this.intersectingBlock && this.intersectingBlock.x === _blockPosition.x && this.intersectingBlock.z + 5 === _blockPosition.z && this.intersectingBlock.y < _blockPosition.y && this.experience.camera.instance.position.y - _blockPosition.y <=5 && (this.experience.camera.instance.position.y - _blockPosition.y) >=0 ){
                if(this.experience.camera.instance.position.z - this.intersectingBlock.z > 2){
                    // this.player.isBlockIntersecting = true
                    // this.player.forwardSmoothedSpeed = _forwardSmoothingSpeed
                    // this.player.rightSmoothedSpeed = _rightSmoothingSpeed
                    // this.player.intersectionSmoothing = true
                    // // this.player.canPlayerMove = false
                    // isIntersection = true
                    // this.player.isSprinting = false
                    breakLoop = true
                    return true
                 }
             }
             //negative z
             if(this.intersectingBlock && this.intersectingBlock.x === _blockPosition.x && this.intersectingBlock.z - 5 === _blockPosition.z && this.intersectingBlock.y < _blockPosition.y && this.experience.camera.instance.position.y - _blockPosition.y <=5 && (this.experience.camera.instance.position.y - _blockPosition.y) >=0){
                //  console.log(this.experience.camera. instance.position.z - this.intersectingBlock.z);
                if(this.experience.camera.instance.position.z - this.intersectingBlock.z < -1.75){
                // this.player.isBlockIntersecting = true
                // this.player.forwardSmoothedSpeed = _forwardSmoothingSpeed
                // this.player.rightSmoothedSpeed = _rightSmoothingSpeed
                // this.player.intersectionSmoothing = true
                // this.player.isSprinting = false
                // // if(this.experience.camera.instance.rotation.y < 1.3 || this.experience.camera.instance.rotation.y > -1.3){
                // // this.player.canPlayerMove = false
                // isIntersection = true
                
                
                // console.log('camera' ,this.experience.camera.instance.position.y)
                breakLoop = true
                return true
        // }\
                 } 
             }
           }
        //    if(breakLoop){
        //        break
        //    }       
        } 
        
    }

    update(){
        // console.log(this.break)
        //check if keys are being pressed and move if they are
       if(this.controls.keysPressed.includes(this.controls.forward)){
        this.player.moveForward()
        this.player.forwardSmoothedSpeed = this.controls.elapsed > 1?  1 * this.player.speed: 0.3 * this.player.speed
        this.player.rightSmoothedSpeed = 0

        //check for intersections - returns true
        const isPlayerIntersecting = this.intersect()
        if(isPlayerIntersecting){
            this.player.moveBackward()
            this.player.forwardSmoothedSpeed *= -1
            this.player.rightSmoothedSpeed = 0
            this.player.isSprinting = false
        }
        
    
}
        if(this.controls.keysPressed.includes(this.controls.back)){
            this.player.moveBackward()
            this.player.forwardSmoothedSpeed = this.controls.elapsed > 1?  -1 * this.player.speed: this.player.speed * -0.3
            this.player.rightSmoothedSpeed = 0

        //check for intersections - returns true
        const isPlayerIntersecting = this.intersect()
        if(isPlayerIntersecting){
            this.player.moveForward()
            this.player.forwardSmoothedSpeed *= -1
            this.player.rightSmoothedSpeed = 0
            this.player.isSprinting = false
        }

       }
        if(this.controls.keysPressed.includes(this.controls.left)){
            this.player.moveLeft()
            this.player.rightSmoothedSpeed = this.controls.elapsed > 1?  -1 * this.player.speed: this.player.speed * -0.3
            this.player.forwardSmoothedSpeed = 0


            //check for intersections - returns true
            const isPlayerIntersecting = this.intersect()
            if(isPlayerIntersecting){
                this.player.moveRight()
                this.player.forwardSmoothedSpeed = 0
                this.player.rightSmoothedSpeed *= -1
                this.player.isSprinting = false
            }
       }
        if(this.controls.keysPressed.includes(this.controls.right) ){
            this.player.moveRight()
            this.player.rightSmoothedSpeed = this.controls.elapsed > 1?  1 * this.player.speed: this.player.speed * 0.3
            this.player.forwardSmoothedSpeed = 0

            //check for intersections - returns true
            const isPlayerIntersecting = this.intersect()
            if(isPlayerIntersecting){
                this.player.moveLeft()
                this.player.forwardSmoothedSpeed = 0
                this.player.rightSmoothedSpeed *= -1
                this.player.isSprinting = false
            }
       }


        // // COLLISIONS WHEN EASING
        // if(this.player.forwardSmoothedSpeed > 0.1 && !this.player.intersectionSmoothing){
        //     this.intersect(-2,0)
        //     this.player.canPlayerMove = true
        // }
        // //back
        // if(this.player.forwardSmoothedSpeed < -0.1 && !this.player.intersectionSmoothing){
        //      this.intersect(2,0)
        // }
        // //right
        // if(this.player.rightSmoothedSpeed > 0.1 && !this.player.intersectionSmoothing){
        //     this.intersect(0, -2)
        //     this.player.canMove = true
        // }
        //     //left
        // if(this.player.rightSmoothedSpeed < -0.1 && !this.player.intersectionSmoothing){
        //     this.intersect(0, 2)
        // }
    //  console.log(this.break)

       //DECCELERATION
       if(!this.controls.keysPressed.includes(this.controls.forward) &&
        !this.controls.keysPressed.includes(this.controls.back) &&
        !this.controls.keysPressed.includes(this.controls.left) && 
        !this.controls.keysPressed.includes(this.controls.right)){
        this.player.forwardSmoothedSpeed /= this.player.decceleration
        this.player.rightSmoothedSpeed /= this.player.decceleration
        const isPlayerIntersecting = this.intersect()
        if(isPlayerIntersecting){
        this.player.forwardSmoothedSpeed /= this.player.decceleration
        this.player.rightSmoothedSpeed /= this.player.decceleration
        this.player.isSprinting = false
            } 
            
        this.controls.pointerLock.moveForward(this.player.forwardSmoothedSpeed * this.player.speed)
        this.controls.pointerLock.moveRight(this.player.rightSmoothedSpeed * this.player.speed)
       }
    

       //bounce back after an intersection
    //    if(this.player.intersection){
    //         this.easing()             
    //    }
      

    // gravity
       this.experience.camera.instance.position.y -= this.controls.gravity.speed
       this.controls.gravity.speed += this.controls.gravity.acceleration
   
for(const _chunkArray of this.experience.world.terrain.terrain.arrayOfChunks){
    for(const _blockPosition of _chunkArray){
        if(this.experience.camera.instance.position.x <= _blockPosition.x +2.5 &&
          this.experience.camera.instance.position.x >= _blockPosition.x - 2.5  && 
          this.experience.camera.instance.position.z <= _blockPosition.z +2.5 &&
          this.experience.camera.instance.position.z >= _blockPosition.z - 2.5 ){
           if(this.experience.camera.instance.position.y <= _blockPosition.y + this.player.height &&
           this.experience.camera.instance.position.y >= _blockPosition.y 
            ){
            this.controls.gravity.speed = 0
          this.experience.camera.instance.position.y = _blockPosition.y + this.player.height
          this.controls.gravity.canJump = true
        }
        //collisions above the player
        if(_blockPosition.y +this.player.height  > this.experience.camera.instance.position.y && _blockPosition.y - 2.5 - this.experience.camera.instance.position.y < 0.1){
                this.controls.gravity.speed += 1
        }
     
          }

          
    }
}

    }
}           



    //0
//-1    1
    //0