import * as THREE from 'three'
import Experience from '../Experience'

export default class EscapeMenu{
    constructor(){
        this.experience = new Experience()

        this.setEscapeMenu()
    }

    setEscapeMenu(){
        // this.experience.world.loadingScreen.style.display = 'none'

        const gameMenuSection = document.querySelector('.game-menu-section')
        gameMenuSection.style.display = 'flex'
        gameMenuSection.style.zIndex = '5'

        this.exitEscapemenu = ()=>{
        gameMenuSection.style.display = 'none'
        gameMenuSection.style.zIndex = '1'
        }

        this.exitButton = document.querySelector('#back-btn')
        this.saveButton = document.querySelector('#save-btn')

        this.exitMenu = ()=>{
            
            if(this.experience.world.timeLockedOn === null || this.experience.time.elapsed - this.experience.world.controlsLockTime > 1.22){
            this.experience.world.pointerLock.lock()
            this.experience.world.controlsLockTime = this.experience.time.elapsed     
            this.exitEscapemenu()
            this.exitButton.removeEventListener('click', this.exitMenu)
            }
    }
        this.exitButton.addEventListener('click', this.exitMenu)

    }
}