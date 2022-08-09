class NeuralNetwork {
    constructor() {
        this.database = {}
        this.initDatabase()
    }


    initDatabase() {
        const firebaseConfig = {
            apiKey: "AIzaSyDnBBXOTo9K37udM1AqTN0VAuvhB7-3REc",
            authDomain: "color-classification-41fca.firebaseapp.com",
            projectId: "color-classification-41fca",
            storageBucket: "color-classification-41fca.appspot.com",
            messagingSenderId: "904191684155",
            databaseURL:
                "https://color-classification-41fca-default-rtdb.firebaseio.com",
            appId: "1:904191684155:web:37677da2f2b54ee0a6b61e",
            measurementId: "G-BQWZXJGSBH",
        };

        // Initialize Firebase
        firebase.initializeApp(firebaseConfig);
        this.database = firebase.database();
    }
    sendData(data, callback) {
        let detectorsDatabase = this.database.ref("carDataSet");
        
        let decision = detectorsDatabase.push(data, finished);
        console.log("FireBase : " + decision.key);
        function finished(err) {
          if (err) {
            console.error(err);
          } else {
            console.log("Data saved");
            callback();
          }
        }
    }
    processing(data) {
        return "left"
    }
}