import Experience from './Experience/Experience'
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set } from "firebase/database";


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
      }

const app = initializeApp(firebaseConfig)

//  this.sendBlockData = ()

}


}














// setFirebase(){
//     const firebaseConfig = {
//         apiKey: "AIzaSyCazs6XrgLtkG93oCebF9JyOKQokOdrUcI",
//         authDomain: "test-7bfaf.firebaseapp.com",
//         databaseURL: "https://test-7bfaf-default-rtdb.europe-west1.firebasedatabase.app",
//         projectId: "test-7bfaf",
//         storageBucket: "test-7bfaf.appspot.com",
//         messagingSenderId: "713753212329",
//         appId: "1:713753212329:web:6da84dc3100ec9eb0ec0b8"
//       }

//       const app = initializeApp(firebaseConfig)

//       const sendNameData = (_name, _id) =>{
//       const db = getDatabase()
//       const reference = ref(db, 'name/' + _id)

//       set(reference,_name )
//       console.log('set');
//       }

//       sendNameData('jimmy', 'ldkjljfoad9')
//       sendNameData('eoim', '8888o9jhbjhb')


// }
