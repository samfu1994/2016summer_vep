function checkStar() {
    if(document.regForm.firstname.value.length == 0) {
        alert("First name cannot be empty");
        return false;
    }

    if(document.regForm.lastname.value.length == 0) {
        alert("Last name cannot be empty");
        return false;
    }

    if(document.regForm.uscid.value.length == 0) {
        alert("USC ID cannot be empty");
        return false;
    }

    if(document.regForm.email.value.length == 0) {
        alert("Email cannot be empty");
        return false;
    }

    if(document.regForm.password.value.length == 0) {
        alert("Password cannot be empty");
        return false;
    }
    if(document.regForm.confirm.value.length == 0) {
        alert("Confirm password cannot be empty");
        return false;
    }
    if(document.regForm.confirm.value.length == 0) {
        alert("Confirm password cannot be empty");
        return false;
    }

    // USC ID valid
    var reg = /[0-9]{10}/;
    if (!reg.test(document.regForm.uscid.value)) {
        alert("USC ID must be 10-digit number");
        return false;
    }

    // Email valid
    var reg = /[a-z0-9]+([._\\-]*[a-z0-9])*@usc.edu/;
    if (!reg.test(document.regForm.email.value)) {
        alert("Email address must end with usc.edu");
        return false;
    }

    // password match
    if(document.regForm.password.value != document.regForm.confirm.value) {
        alert("Password are not the same");
        return false;
    }

    // gender selected
    if(document.regForm.gender.value == "") {
        alert("Choose your gender");
        return false;
    }

    // term checked
    if(!document.regForm.term.checked) {
        alert("Check the checkbox");
        return false;
    }

    document.getElementById("pre").style.display = "";
    document.getElementById("showFirstName").innerHTML = document.regForm.firstname.value;
    return false;

}