import Dat from 'dat.gui'
import Stats from 'stats.js'

export default class Debug{
    constructor(){

        this.active = window.location.hash === '#debug'
        if(this.active){
            this.gui = new Dat.GUI()
        }
        this.setStats()
    }

    setStats(){
        this.stats = new Stats()
        this.stats.showPanel(0)
        document.body.append(this.stats.dom)
    }

    update(){
        this.stats.begin()

        this.stats.end()
    }
}