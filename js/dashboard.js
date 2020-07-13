
var auth = firebase.auth();
var firestore = firebase.firestore();

var nameDiv = document.querySelector(".name h2");
// console.log(nameDiv);
var SignOutBtn = document.querySelector(".signOut-btn");
var transactionForm = document.querySelector('.transactionForm');
var transactionList = document.querySelector(".transactionList");

var uid = null; 
// var uid = location.hash.substring(1,location.hash.length);
// console.log(uid);

//fetching transactionlist//
 var fetchingTransactions = async () =>{
    var transactions = [];
    var query = await firestore.collection("transactions").where("transactionBy","==",uid).get();
    query.forEach((doc) => {
          transactions.push({...doc.data(), transactionId: doc.id})
    })
    return transactions
}


// rendering transactions//
var renderTransaction =  (transactionArr) => {
    transactionArr.forEach((transaction,index) =>{
        // transactionList.innerHTML = "";
        var {title,cost, createdAt, transactionId} = transaction;
        transactionList.insertAdjacentHTML(`beforeend`,`<div class="transactionListItem">
        <div class="renderIndex ListItem ">
          <h3> ${++index}</h3>
        </div>
        <div class="renderTitle ListItem">
         <h3>${title} </h3>
       </div>
       <div class="renderCost ListItem">
         <h3> ${cost}</h3>
       </div>
       <div class="renderTransactionAt ListItem">
         <h3> ${createdAt.toDate().toISOString().split("T")[0]}</h3>
       </div>
       <div class="renderTransactionAt ListItem">
       <a href="./transaction.html#${transactionId}" ><button>VIEW</button></a>
     </div>
      </div>`)
    });
}


// function for transactions//
var transactionFormSubmission = async (e) => {
try {
    e.preventDefault();
    // console.log(e);
    var title = document.querySelector(".title").value;
    var cost = document.querySelector(".cost").value;
    var transactionType = document.querySelector(".transactionType").value;
    var createdAt = document.querySelector(".createdAt").value;
   

    if(title && cost && transactionType && createdAt){
        var transactionObj = {
            title,
            cost,
            transactionType,
            createdAt: new Date(createdAt),
            transactionBy : uid 
        }
        // console.log(transactionObj);
           await firestore.collection("transactions").add(transactionObj);
           var transactions = await fetchingTransactions(uid);
        // render process ////
        
      renderTransaction(transactions)
    }
}
 catch (error) {
      console.log(error);
}

} 
 // signout functionality//
var signOut = async () => {
    await auth.signOut() 
}


// fetching user uid from userInfo //
var fetchingUid = async (uid) => {

   try {
       var userInfo  = await firestore.collection("users").doc(uid).get();
       return userInfo.data();
   } catch (error) {
       console.log(error);
   }
    
}

SignOutBtn.addEventListener("click",signOut); 
transactionForm.addEventListener("submit",(e) => transactionFormSubmission(e));



auth.onAuthStateChanged( async (user) =>{
    if (user) {
         uid = user.uid;
        var userInfo = await fetchingUid(uid);
        nameDiv.textContent = userInfo.fullName;
        //render transaction //
        //fetch users transactions//
        var transactions = await fetchingTransactions(uid);
        // render process ////
        
      renderTransaction(transactions)
    } else {
       location.assign("index.html");
    }
})

