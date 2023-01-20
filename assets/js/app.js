const cl = console.log;

const stdSubmit = document.getElementById("stdSubmit");
const btnUpdate = document.getElementById("btnUpdate");
const btnSubmit = document.getElementById("btnSubmit");
const fname = document.getElementById("fname");
const lname = document.getElementById("lname");
const email = document.getElementById("email");
const number = document.getElementById("number");
const stdInfoContainer = document.getElementById("stdInfoContainer");

let stdArr = [];

let templating = (arr) => {
    let result = ``;
    arr.forEach((std,i) => {
        result += `
                <tr>
                    <td>${i + 1}</td>
                    <td>${std.fname}</td>
                    <td>${std.lname}</td>
                    <td>${std.email}</td>
                    <td>${std.number}</td>
                    <td>
                        <button class="btn btn-info" data-id="${std.id}" onclick="onEditHandler(this)">edit</button>
                    </td>
                    <td>
                        <button class="btn btn-danger" data-id="${std.id}" onClick="onDeleteHandler(this)">delete</button>
                    </td>
                </tr>        
        `;
    });
    stdInfoContainer.innerHTML = result;
};

const setStdInfoDetails = () => {
    localStorage.setItem("setStdDetails",JSON.stringify(stdArr));
};

if(localStorage.getItem("setStdDetails")){
    stdArr = JSON.parse(localStorage.getItem("setStdDetails"));
    templating(stdArr);
};

const onStdSubmitHandler = (eve) => {
    eve.preventDefault();
    let obj = {
        fname : fname.value,
        lname : lname.value,
        email : email.value,
        number : number.value,
        id : UUIDGeneratorBrowser(),
    };
    stdArr.push(obj);// first we push the object
    setStdInfoDetails();// then we push the whole updated object to the local storage
    templating(stdArr);
    stdSubmit.reset();
};

const onEditHandler = (ele) => {
    // ele.target; // target not work on inline callback function for that we need to write this keyword in inline call back function. And this keyword represent that element.
    // cl(ele);// now it will gives you that element not the event

    let getId = ele.getAttribute("data-id");
    // cl(getId)
    localStorage.setItem("updateId", getId);
    let getObj = stdArr.find(ele => ele.id === getId);
    fname.value = getObj.fname;
    lname.value = getObj.lname;
    email.value = getObj.email;
    number.value = getObj.number;

    btnSubmit.classList.add("d-none");
    btnUpdate.classList.remove("d-none");
};

const onStdUpdate = (ele) => {
    let getUpdateId = localStorage.getItem("updateId");
    // cl(getUpdateId);S
    stdArr.forEach(std => {
        if(std.id === getUpdateId){// here as we don't want to push or create the new update object that why we cannot use filter or find method so in this case we use forEach method
            std.fname = fname.value;
            std.lname = lname.value;
            std.email = email.value;
            std.number = number.value;
        };
    });
    setStdInfoDetails();// here the updated values pass to the localStorage we pass the whole updated stdArr.
    // templating(stdArr);// again run templating function to update the table of the UI.
    let getUpdateEle = [...document.querySelectorAll("#stdInfoContainer [data-id]")];// gives the all button which having data-id attribute
    let findEle = getUpdateEle.find(ele => ele.dataset.id === getUpdateId);// it find that element having same id compared to getUpdateId
    let updateEle = [...findEle.parentElement.parentElement.children];// it gives the 'tr' of that id element and returns the htmlcollection which changes to array and it contents all 'td'.
    cl(updateEle);
    // cl(updateEle[1].innerText);
    updateEle[1].innerText = fname.value;
    updateEle[2].innerText = lname.value;
    updateEle[3].innerText = email.value;
    updateEle[4].innerText = number.value;
    stdSubmit.reset();

    btnUpdate.classList.add("d-none");
    btnSubmit.classList.remove("d-none");
};

const onDeleteHandler = (ele) => {
    // let getDeleteId = ele.getAttribute("data-id");
    let getDeleteId = ele.dataset.id;// alternate method to get id if we use custom attribute then we have property dataset which gives the 'DOMStringMap' it is the object of the custom attribute values
    let getIndex = stdArr.findIndex(std => std.id === getDeleteId);
    stdArr.splice(getIndex, 1);
    setStdInfoDetails();// update the array after the element get removed in localStorage
    ele.parentElement.parentElement.remove();// remove element from the table of UI
};

const UUIDGeneratorBrowser = () =>
  ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );// get directly from google

stdSubmit.addEventListener("submit",onStdSubmitHandler);
btnUpdate.addEventListener("click",onStdUpdate);