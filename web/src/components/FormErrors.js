import React from "react";

function FormErrors(props) {
  if (
    props.formerrors &&
    props.formerrors.passwordmatch
  ) {
    return (
      <div className="form-errors text-center">
        {props.formerrors.passwordmatch
          ? "The passwords entered do not match, please try again"
          : ""}
      </div>
    );
  } else if (
    props.formerrors &&
    props.formerrors.phoneNumberSize
  ) {
    return (
      <div className="form-errors text-center">
        {props.formerrors.phoneNumberSize
          ? "Phone Number must have 8 numbers"
          : ""}
      </div>
    );
  } else if (
    props.formerrors &&
    props.formerrors.phoneNumberInvalid
  ) {
    return (
      <div className="form-errors text-center">
        {props.formerrors.phoneNumberInvalid
          ? "Phone number must start with 8 or 9"
          : ""}
      </div>
    );
  } else if (
    props.formerrors &&
    (props.formerrors.blankfield || props.formerrors.usernameLimitd)
  ) {
    return (
      <div className="form-errors text-center">
        {props.formerrors.blankfield ? "All fields are required" : ""}
      </div>
    );
  } else if (props.apierrors) {
    return (
      <div className="form-errors text-center">{props.apierrors}</div>
    );
  } else if (props.formerrors && props.formerrors.cognito) {
    return (
      <div className="form-errors text-center">
        {props.formerrors.cognito.message}
      </div>
    );
  } else {
    return <div />;
  }
}

export default FormErrors;