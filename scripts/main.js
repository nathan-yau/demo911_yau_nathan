// Function to read the quote of the day from Firestore "quotes" collection
// Input param is the String representing the day of the week, aka, the document name
function readQuote(day) {
    db.collection("quotes").doc(day)                                                    //name of the collection and documents should matach excatly with what you have in Firestore
        .onSnapshot(tuesdayDoc => {                                                               //arrow notation
            console.log("current document data: " + tuesdayDoc.data());                          //.data() returns data object
            document.getElementById("quote-goes-here").innerHTML = tuesdayDoc.data().quote;      //using javascript to display the data on the right place

            //Here are other ways to access key-value data fields
            //$('#quote-goes-here').text(tuesdayDoc.data().quote);         //using jquery object dot notation
            //$("#quote-goes-here").text(tuesdayDoc.data()["quote"]);      //using json object indexing
            //document.querySelector("#quote-goes-here").innerHTML = tuesdayDoc.data().quote;
        })
    db.collection("users").doc(name)                                                    //name of the collection and documents should matach excatly with what you have in Firestore
        .onSnapshot(nameDoc => {                                                               //arrow notation
            console.log("current document data: " + nameDoc.data());                          //.data() returns data object
            document.getElementById("name-goes-here").innerHTML = nameDoc.data().name;      //using javascript to display the data on the right place

            //Here are other ways to access key-value data fields
            //$('#quote-goes-here').text(tuesdayDoc.data().quote);         //using jquery object dot notation
            //$("#quote-goes-here").text(tuesdayDoc.data()["quote"]);      //using json object indexing
            //document.querySelector("#quote-goes-here").innerHTML = tuesdayDoc.data().quote;
        })
}

function insertNameFromFirestore() {
    // to check if the user is logged in:
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            console.log(user.uid); // let me to know who is the user that logged in to get the UID
            currentUser = db.collection("users").doc(user.uid); // will to to the firestore and go to the document of the user
            currentUser.get().then(userDoc => {
                //get the user name
                var userName = userDoc.data().name;
                console.log(userName);
                //$("#name-goes-here").text(userName); //jquery
                document.getElementById("name-goes-here").innerText = userName;
            })
        }
    })
}

//------------------------------------------------------------------------------
// Input parameter is a string representing the collection we are reading from
//------------------------------------------------------------------------------
function displayCardsDynamically(collection) {
    let cardTemplate = document.getElementById("hikeCardTemplate");

    db.collection(collection).get()   //the collection called "hikes"
        .then(allHikes => {
            var i = 1;  //Optional: if you want to have a unique ID for each hike
            allHikes.forEach(doc => { //iterate thru each doc
                var title = doc.data().name;       // get value of the "name" key
                var details = doc.data().details;  // get value of the "details" key
                var hikeCode = doc.data().code;    //get unique ID to each hike to be used for fetching right image
                var hikeLength = doc.data().length; //gets the length field
                var docID = doc.id;
                let newcard = cardTemplate.content.cloneNode(true);

                //update title and text and image
                newcard.querySelector('.card-title').innerHTML = title;
                newcard.querySelector('.card-length').innerHTML = hikeLength + "km";
                newcard.querySelector('.card-text').innerHTML = details;
                newcard.querySelector('.card-image').src = `./images/${hikeCode}.jpg`; //Example: NV01.jpg
                newcard.querySelector('a').href = "eachHike.html?docID=" + docID;

                //Optional: give unique ids to all elements for future use
                newcard.querySelector('.card-title').setAttribute("id", "ctitle" + i);
                newcard.querySelector('.card-text').setAttribute("id", "ctext" + i);
                newcard.querySelector('.card-image').setAttribute("id", "cimage" + i);

                //attach to gallery, Example: "hikes-go-here"
                document.getElementById(collection + "-go-here").appendChild(newcard);


                //i++;   //Optional: iterate variable to serve as unique ID
            })
        })
}

displayCardsDynamically("hikes");  //input param is the name of the collection

insertNameFromFirestore()

readQuote("tuesday");        //calling the function
