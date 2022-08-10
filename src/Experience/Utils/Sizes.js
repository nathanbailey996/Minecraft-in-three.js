import * as THREE from 'three'
import EventEmitter from './EventEmitter'

export default class Sizes extends EventEmitter{
    constructor(){
        super()

        this.setSizes()
    }

    setSizes(){
        this.width = window.innerWidth
        this.height = window.innerHeight

        this.resize = ()=>{
        this.width = window.innerWidth
        this.height = window.innerHeight 

        this.trigger('resize')
        }
        
        window.addEventListener('resize', this.resize)
    }
}