import * as THREE from 'three'
import EventEmitter from './EventEmitter'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'
import {DRACOLoader} from 'three/examples/jsm/loaders/DRACOLoader'


export default class Loaders extends EventEmitter{
    constructor(_sources){
        super()
        //setup
        this.sources = _sources
        this.items = {}
        this.loaded = 0
        this.toLoad = this.sources.length

        this.setLoaders()
        this.startLoading()
    }

    setLoaders(){
        this.loaders = {}
        this.loaders.textureLoader = new THREE.TextureLoader()
        this.loaders.cubeTextureLoader = new THREE.CubeTextureLoader()
        this.loaders.gltfLoader = new GLTFLoader()
    }

    startLoading(){
        for(const _source of this.sources){
            if(_source.type === 'textureLoader'){
                this.loaders.textureLoader.load(_source.path, 
                    (file)=>{
                        file.encoding = THREE.sRGBEncoding
                        this.setLoaded(_source, file)
                    }
                    )
            }else  if(_source.type === 'cubeTextureLoader'){
                this.loaders.cubeTextureLoader.load(_source.path, 
                    (file)=>{
                        this.setLoaded(_source, file)
                    }
                    )
            }else if(_source.type === 'gltfLoader'){
                this.loaders.gltfLoader.load(_source.path, 
                    (file)=>{
                        this.setLoaded(_source, file)
                    }
                    )
            }
        }
    }

    setLoaded(_source, file){
        this.items[_source.name] = file
        this.loaded ++
        if(this.loaded === this.toLoad){
            this.trigger('ready')
        }
    }

}