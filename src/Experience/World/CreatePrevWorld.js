import * as THREE from 'three'
import Experience from '../Experience'

export default class CreatePrevWorld{
    constructor(){
        this.experience = new Experience()
 
        this.setSavedworldScreen()
    }

    setSavedworldScreen(){
        //SAVED WORLD ELEMENTS
        this.savedWorldsScreen = document.querySelector('#saved-worlds')
        this.savedWorldsContainer = document.querySelector('.saved-worlds-container')
        this.savedworldScrolller = document.querySelector('.saved-worlds-scroller')
        this.playSelectedBtn = document.querySelector('#play-selected-btn')
        this.createNewBtn = document.querySelector('#create-new-btn')
        //FORM ELEMENTS
        this.formSection = document.querySelector('#form-section')
        this.formInput = document.querySelector('.form-input')
        this.formElement = document.querySelector('.new-game-form')
        this.formCancelButton = document.querySelector('#form-cancel-btn')

        this.isPlayerInGameMenu = true

    }

    openSavedWorldSection(){
       this.experience.firebase.fetchListOfWorldNames()
       this.isPlayerInGameMenu = true
    }
    // CLOSE THE SAVED SECTION
    closeSavedWorldSection(){
        this.savedWorldsScreen.style.display = 'none'
        this.savedWorldsScreen.style.zIndex = '1'
        
        //reset the scroller to have no children
        const newScroller = document.createElement('div')
        newScroller.classList.add('saved-worlds-scroller')
        this.savedWorldsContainer.removeChild(this.savedworldScrolller)
        this.savedWorldsContainer.appendChild(newScroller)
        this.savedworldScrolller = newScroller
    }
    //OPEN THE FORM
    openForm(){
        this.formSection.style.display = 'flex'
        this.formSection.style.zIndex = '5'
        this.isWorldDisplayed = false
        this.isPlayerInGameMenu = true
        this.closeSavedWorldSection()
        this.formElement.addEventListener('submit', (_event)=>{
            _event.preventDefault()
            this.submitFormData()
        })
        this.closeSavedWorldSection()
        this.createNewBtn.removeEventListener('click', this.openform)

        this.formCancelButton.addEventListener('click', (_event)=>{
            _event.preventDefault() 
            this.isPlayerInGameMenu = false
            this.openSavedWorldSection()
            this.closeForm()
        })
    }
    //CLOSE THE FORM
    closeForm(){
        this.formSection.style.display = 'none'
        this.formSection.style.zIndex = '1'
        this.canFormSubmit = true
        this.isPlayerInGameMenu = false
    }

    //SUBMIT THE FORM
    submitFormData(){
        if(this.formInput.value === ''){
            alert('Please Enter a Name')
        }
        else if(!this.isWorldDisplayed){
           
            this.experience.world.terrain.setTerrain()
            this.experience.world.setWorld()
            this.experience.world.addingRemovingBlocks.setOriginalBlocks()
            const savedWorld = {name:this.formInput.value, blockPositions:this.experience.world.terrain.terrain.arrayOfChunks, addedBlocks:[], removedBlocks:[], infiniteDepthBlocks:[], originalBlocks:this.experience.world.addingRemovingBlocks.originalBlocks, cameraPosition:this.experience.camera.instance.position ,date:this.experience.world.terrain.getCurrentDate()}
            this.currentWorld = savedWorld
            this.experience.firebase.storeBlockData(savedWorld, savedWorld.name)
            this.experience.world.pointerLock.lock()
            this.experience.world.loadingScreen.style.display = 'none'
            this.experience.world.loadingScreen.style.display = '1'
            this.closeForm()
            this.isWorldDisplayed = true
    
        }
    }

    createSavedWorldLists(_listOfWorlds){
        this.listOfWorlds = _listOfWorlds
        let worldIdentifier = 1
        for(const _world in _listOfWorlds){
            const currentWorld = _listOfWorlds[_world]
            //container
            const worldElementContainer = document.createElement('div')
            worldElementContainer.classList.add('saved-world')
            worldElementContainer.id = `saved-world${worldIdentifier}`

            //heading
            const worldElementHeading = document.createElement('p')
            worldElementHeading.classList.add('saved-world-heading')
            worldElementHeading.innerText = currentWorld.name
             //heading
             const worldElementDate = document.createElement('p')
             worldElementDate.classList.add('saved-world-content')
             worldElementDate.innerText = `${currentWorld.name} ${currentWorld.date}`

            //append to the scroller
            worldElementContainer.appendChild(worldElementHeading)
            worldElementContainer.appendChild(worldElementDate)
            this.savedworldScrolller.appendChild(worldElementContainer)
            worldIdentifier ++

        }

        this.setActiveWorld(worldIdentifier)

        this.savedWorldsScreen.style.display = 'flex'
        this.savedWorldsScreen.style.zIndex = '5'
        this.createNewBtn.addEventListener('click', ()=>{
            this.openForm()
        })

        this.playSelectedBtn.addEventListener('click', ()=>{
            this.startSelectedWorld()
        })

    }

    setActiveWorld(_numberOfSavedWorlds){
        this.activeWorldIndex = 1

        this.onKeyPress = (_event)=>{
            if(_event.key === 'ArrowUp' && this.activeWorldIndex > 1){
                this.activeWorldIndex --
                this.setBorder()
            }
            if(_event.key === 'ArrowDown' && _numberOfSavedWorlds -1 > this.activeWorldIndex) {
                this.activeWorldIndex ++
                this.setBorder()
            }
        }
        window.addEventListener('keydown', this.onKeyPress)

        this.setBorder = ()=>{
        for(let i = 1; i< _numberOfSavedWorlds; i++){
            if(i === this.activeWorldIndex){
                document.querySelector(`#saved-world${i}`).style.border = 'solid grey 2px'
            }
            else{
                document.querySelector(`#saved-world${i}`).style.border = 'none'

            }
        }
    }
    this.setBorder()
    
    }

    startSelectedWorld(){
        let worldIndex = 1
        for(const _world in this.listOfWorlds){
            if(worldIndex === this.activeWorldIndex){
                const currentWorld = this.listOfWorlds[_world]
                this.experience.world.terrain.terrain.arrayOfChunks = currentWorld.blockPositions
                //put the camera in the same position as where it was left
                this.experience.camera.instance.position.copy(currentWorld.cameraPosition)
                //if the arrays are empty firebase will not save the values and will become undefined
                if(currentWorld.removedBlocks){
                this.experience.world.addingRemovingBlocks.removedBlocks = currentWorld.removedBlocks
                }else{
                this.experience.world.addingRemovingBlocks.removedBlocks = []
                currentWorld.removedBlocks =[]
                }
                if(currentWorld.addedBlocks){
                this.experience.world.addingRemovingBlocks.addedBlocks = currentWorld.addedBlocks
                }else{
                    this.experience.world.addingRemovingBlocks.addedBlocks = []
                    currentWorld.addedBlocks = []
                }
                if(currentWorld.infiniteDepthBlocks){
                    this.experience.world.addingRemovingBlocks.infiniteDepthBlocks = currentWorld.infiniteDepthBlocks
                    }else{
                        this.experience.world.addingRemovingBlocks.infiniteDepthBlocks = []
                        currentWorld.infiniteDepthBlocks = []
                    }
                    this.experience.world.addingRemovingBlocks.originalBlocks = currentWorld.originalBlocks

                this.currentWorld = this.listOfWorlds[_world]
                this.experience.world.setWorld()
                this.experience.world.terrain.displayBlocks(currentWorld.blockPositions, true)
                this.experience.world.terrain.getBoundrys(currentWorld.blockPositions)
                this.experience.world.controls.controls.pointerLock.lock()
                this.isPlayerInGameMenu = false
                this.closeSavedWorldSection()
                document.querySelector('.loading-screen').style.display = 'none'

            }
            worldIndex ++
        }
    }




}
