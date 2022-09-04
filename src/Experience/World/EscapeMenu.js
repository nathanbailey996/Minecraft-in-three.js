import * as THREE from 'three'
import Experience from '../Experience'
import BlockTypes from './BlockTypes'

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

        // RETURNING BACK TO THE GAME
        this.exitMenu = ()=>{
            if(this.experience.world.timeLockedOn === null || this.experience.time.elapsed - this.experience.world.controlsLockTime > 1.22){
            this.experience.world.pointerLock.lock()
            this.experience.world.controlsLockTime = this.experience.time.elapsed    
            this.experience.world.previousWorld.isPlayerInGameMenu = false
            this.exitEscapemenu()
            this.exitButton.removeEventListener('click', this.exitMenu)
            }
    }
        this.exitButton.addEventListener('click', this.exitMenu)

        // RETURNING TO THE GAME TITLE
        this.saveAndExitGame = ()=>{
            //send the block date to the database
            this.experience.firebase.storeBlockData(this.experience.world.previousWorld.currentWorld, this.experience.world.previousWorld.currentWorld.name )

            this.experience.world.previousWorld.openSavedWorldSection()
            this.exitEscapemenu()
            this.saveButton.removeEventListener('click', this.saveAndExitGame)

        }
        this.saveButton.addEventListener('click', this.saveAndExitGame)




    }
}