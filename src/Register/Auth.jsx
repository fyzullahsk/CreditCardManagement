function Auth(values) {
    const errors = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordPattern = /^[a-zA-Z0-9!@#$%^&*()_+}{":;?/>.<,|\\~`\-=[\]\\';,/]{8,}$/;
    const phonePattern = /^[0-9]{10}$/;
    
    if (!values.FullName) {
        errors.FullName = "Name should not be empty";
    }
if(!values.DOB){
    errors.DOB = "DOB should not be empty";
}
    if (!values.Email) {
        errors.Email = "Email should not be empty";
    } else if (!emailPattern.test(values.Email)) {
        errors.Email = "Invalid email format";
    }
    if (!values.PhoneNumber) {
        errors.PhoneNumber = "Phone Number should not be empty";
    } else if (!phonePattern.test(values.PhoneNumber)) {
        errors.PhoneNumber = "Phone Number must be 10 digits";
    }

    if (!values.Password) {
        errors.Password = "Password should not be empty";
    } else if (!passwordPattern.test(values.Password)) {
        errors.Password = "Password must be at least 8 characters long";
    }

    if (!values.ConfirmPassword) {
        errors.ConfirmPassword = "Confirm Password should not be empty";
    } else if (values.ConfirmPassword !== values.Password) {
        errors.ConfirmPassword = "Confirm Password and Password didn't match";
    }

    return errors;
}

export default Auth;
