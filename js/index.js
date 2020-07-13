var auth = firebase.auth();
var firestore = firebase.firestore();


// console.log(auth);
// console.log(firestore);

var SignInForm = document.querySelector(".SignInForm");
var SignUpForm = document.querySelector(".SignUpForm");
var GoogleBtn = document.querySelector(".SignInGoogle");

// console.log(SignInForm);
// console.log(SignUpForm);


var SignInGoogle = async () => {

    try {
        var GoogleProvider = new firebase.auth.GoogleAuthProvider();
        var {additionalUserInfo:{isNewUser}, user:{displayName,uid,email}} =  await firebase.auth().signInWithPopup(GoogleProvider);
        
      if (isNewUser) {
        var userInfo = {
            fullName: displayName,
            email,
            createdAt: new Date()
        }
        console.log(userInfo);
          await firestore.collection("users").doc(uid).set(userInfo);

          console.log("okay");
      } else {
          console.log("welcomeBack");
      }
      
      location.assign(`./dashboard.html#${uid}`);
        
    } catch (error) {
        console.log(error);
    }

}


var SignIn = async (e)  => {
           
    e.preventDefault();
    //    console.log("signin")

   try {
    var SignInEmail = document.querySelector(".SignInEmail").value;
    var SignInPass = document.querySelector(".SignInPass").value;
          
    if (SignInEmail && SignInPass) {
         
        var {user:{uid}} = await auth.signInWithEmailAndPassword(SignInEmail,SignInPass);
        //  console.log(uid);
        var userInfo = await firestore.collection("users").doc(uid).get();

        console.log(userInfo.data());
    }
    location.assign(`./dashboard.html#${uid}`);

   } catch (error) {
       console.log(error);
   }
 
 }

var SignUp = async (e) => {
    
    e.preventDefault();
       
   try {

    var SignUpName = document.querySelector(".SignUpName").value;
    var SignUpEmail = document.querySelector(".SignUpEmail").value;
    var SignUpPass = document.querySelector(".SignUpPass").value;
  
    if(SignUpName && SignUpEmail && SignUpPass){
               
                 var {user: {uid}} =  await auth.createUserWithEmailAndPassword(SignUpEmail,SignUpPass);
                //  console.log(uid);
                 var userInfo = {
                     SignUpName,
                     SignUpEmail,
                     createdAt: new Date()
                 }
                   await firestore.collection("users").doc(uid).set(userInfo);

                //    console.log("okay")
   }
   location.assign(`./dashboard.html#${uid}`);
       
   } catch (error) {
       console.log(error)
   }
 }

SignInForm.addEventListener("submit", (e) => SignIn(e) );
SignUpForm.addEventListener("submit", (e) => SignUp(e) );
GoogleBtn.addEventListener("click",SignInGoogle);

