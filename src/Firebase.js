import Experience from './Experience/Experience'
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue } from "firebase/database";


export default class Firebase{
    constructor(){
        this.experience = new Experience()

        this.setFirebase()
    }

setFirebase(){
    const firebaseConfig = {
        apiKey: "AIzaSyCazs6XrgLtkG93oCebF9JyOKQokOdrUcI",
        authDomain: "test-7bfaf.firebaseapp.com",
        databaseURL: "https://test-7bfaf-default-rtdb.europe-west1.firebasedatabase.app",
        projectId: "test-7bfaf",
        storageBucket: "test-7bfaf.appspot.com",
        messagingSenderId: "713753212329",
        appId: "1:713753212329:web:6da84dc3100ec9eb0ec0b8"
      };

const app = initializeApp(firebaseConfig)
}
    storeBlockData(_blockPositions,_id){
        const db = getDatabase()
        const reference = ref(db, 'blockData/' + _id)
        set(reference, _blockPositions)
    }

    fetchListOfWorldNames(){
        let isDataSent = false
        const db = getDatabase()
        const  worldReference = ref(db, 'blockData/') 
        onValue(worldReference, (_snapshot)=>{
             const data = _snapshot.val()
             if(!isDataSent){
                this.experience.world.previousWorld.createSavedWorldLists(data)
                isDataSent = true

             }
        })
        
    }
}
