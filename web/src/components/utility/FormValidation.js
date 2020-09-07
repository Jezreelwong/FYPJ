function validateForm(event, state) {
  // clear all error messages
  const inputs = document.getElementsByClassName("border-danger");
  for (let i = 0; i < inputs.length; i++) {
    if (!inputs[i].classList.contains("error")) {
      inputs[i].classList.remove("border-danger");
    }
  }

  //login validation

  if (state.hasOwnProperty("username") && state.username === "") {
    if (document.getElementById("username")) {
      document.getElementById("username").classList.add("border-danger");
      return { blankfield: true };
    }
  }
  if (state.hasOwnProperty("email") && state.email === "") {
    if (document.getElementById("email")) {
      document.getElementById("email").classList.add("border-danger");
      return { blankfield: true };
    }
  }

  if (state.hasOwnProperty("role") && state.role === "") {
    document.getElementById("role").classList.add("border-danger");
    return { blankfield: true };
  }
  if (state.hasOwnProperty("safUnit") && state.safUnit === "") {
    document.getElementById("safUnit").classList.add("border-danger");
    return { blankfield: true };
  }
  if (state.hasOwnProperty("preferredusername") && state.preferredusername === "") {
    if (document.getElementById("preferredusername")) {
      document.getElementById("preferredusername").classList.add("border-danger");
      return { blankfield: true };
    }
  }
  if (state.hasOwnProperty("firstname") && state.firstname === "") {
    if (document.getElementById("firstname") !== null) {
      document.getElementById("firstname").classList.add("border-danger");
      return { blankfield: true };
    }
  }
  // in Users page, firstname is first_name
  if (state.hasOwnProperty("first_name") && state.first_name === "") {
    if (document.getElementById("first_name") !== null) {
      document.getElementById("first_name").classList.add("border-danger");
      return { blankfield: true };
    }
  }
  if (state.hasOwnProperty("lastname") && state.lastname === "") {
    if (document.getElementById("lastname") !== null) {
      document.getElementById("lastname").classList.add("border-danger");
      return { blankfield: true };
    }
  }
  // in Users page, lastname is last_name
  if (state.hasOwnProperty("last_name") && state.last_name === "") {
    if (document.getElementById("last_name") !== null) {
      document.getElementById("last_name").classList.add("border-danger");
      return { blankfield: true };
    }
  }
  if (
    state.hasOwnProperty("forgetcode") && state.forgetcode === ""){
    if (document.getElementById("forgetcode") !== null) {
      document.getElementById("forgetcode").classList.add("border-danger");
      return { blankfield: true };
    }
  }
  if (
    state.hasOwnProperty("verificationcode") && state.verificationcode === ""){
    if (document.getElementById("verificationcode") !== null) {
      document.getElementById("verificationcode").classList.add("border-danger");
      return { blankfield: true };
    }
  }
  if (state.hasOwnProperty("password") && state.password === "") {
    if (document.getElementById("password") !== null) {
      document.getElementById("password").classList.add("border-danger");
      return { blankfield: true };
    }
  }
  if (state.hasOwnProperty("oldpassword") && state.oldpassword === "") {
    document.getElementById("oldpassword").classList.add("border-danger");
    return { blankfield: true };
  }
  if (state.hasOwnProperty("newpassword") && state.newpassword === "") {
    if (document.getElementById("newpassword") !== null) {
      document.getElementById("newpassword").classList.add("border-danger");
      return { blankfield: true };
    }
  }
  if (state.hasOwnProperty("confirmpassword") && state.confirmpassword === "") {
    if (document.getElementById("confirmpassword") !== null) {
      document.getElementById("confirmpassword").classList.add("border-danger");
      return { blankfield: true };
    }
  }
  if (state.hasOwnProperty("firstpassword") && state.firstpassword === "") {
    if (document.getElementById("firstpassword") !== null) {
      document.getElementById("firstpassword").classList.add("border-danger");
      return { blankfield: true };
    }
  }
  if (state.hasOwnProperty("confirmfirstpassword") && state.confirmfirstpassword === "") {
    if (document.getElementById("confirmfirstpassword") !== null) {
      document.getElementById("confirmfirstpassword").classList.add("border-danger");
      return { blankfield: true };
    }
  }
  if (
    state.hasOwnProperty("newpassword") &&
    state.hasOwnProperty("confirmpassword") &&
    state.newpassword !== state.confirmpassword
  ) {
    if(document.getElementById("newpassword") !== null && document.getElementById("confirmpassword") !== null){
      document.getElementById("newpassword").classList.add("border-danger");
      document.getElementById("confirmpassword").classList.add("border-danger");
      return { passwordmatch: true };
    }
  }
  if (
    state.hasOwnProperty("firstpassword") &&
    state.hasOwnProperty("confirmfirstpassword") &&
    state.firstpassword !== state.confirmfirstpassword
  ) {
    if (document.getElementById("firstpassword") !== null && document.getElementById("confirmfirstpassword") !== null) {
      document.getElementById("firstpassword").classList.add("border-danger");
      document.getElementById("confirmfirstpassword").classList.add("border-danger");
      return { passwordmatch: true };
    }
  }

  //Ferry Gudieline validation
  if (state.hasOwnProperty("guidelines") && state.guidelines === "") {
    document.getElementById("guidelines").classList.add("border-danger");
    return { blankfield: true };
  }
  if (state.hasOwnProperty("RadioPassenger") && state.hasOwnProperty("RadioRPL")) {
    if (document.getElementById("RadioPassenger").checked !== false && document.getElementById("RadioRPL").checked !== false) {
      return { blankfield: true };
    }
  }

  //Dashboard validation
  if (state.hasOwnProperty("cancellationReason") && state.cancellationReason === "") {
    if (document.getElementById("cancellationReason") !== null) {
      document.getElementById("cancellationReason").classList.add("border-danger");
      return { blankfield: true };
    }
  }

  //Announcement validation
  if (state.hasOwnProperty("message") && state.message === "") {
    document.getElementById("meassage").classList.add("border-danger");
    return { blankfield: true };
  }

  //Booking validation
  if (state.hasOwnProperty("departureDate") && state.departureDate === "") {
    if (document.getElementById("departureDate") !== null) {
      document.getElementById("departureDate").classList.add("border-danger");
      return { blankfield: true };
    }
  }

  if (state.hasOwnProperty("departureTime") && state.departureTime === "") {
    if (document.getElementById("departureTime") !== null) {
      document.getElementById("departureTime").classList.add("border-danger");
      return { blankfield: true };
    }
  }

  if (state.hasOwnProperty("numPassenger") && state.numPassenger === "") {
    if (document.getElementById("numPassenger") !== null) {
      document.getElementById("numPassenger").classList.add("border-danger");
      return { blankfield: true };
    }
  }

  if (state.hasOwnProperty("bookingUnit") && state.bookingUnit === "") {
    if (document.getElementById("bookingUnit") !== null) {
      document.getElementById("bookingUnit").classList.add("border-danger");
      return { blankfield: true };
    }
  }

  return;
}

export default validateForm;