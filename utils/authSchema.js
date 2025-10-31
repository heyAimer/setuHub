import * as Yup from "yup";
export const signUpValidationSchema = Yup.object().shape({
    username: Yup.string().required("Username is required!"),
    email: Yup.string().required("Email is required!").email("Invalid email"),
    password: Yup.string().required("Password is required!").min(2, "Password must 2 characters long"),
    confirmPassword: Yup.string().required("Please confirm your password").oneOf([Yup.ref('password'), null], 'Passwords must match')
});

export const signInValidationSchema = Yup.object().shape({
  email: Yup.string().required("Email is required!").email("Invalid email"),
  password: Yup.string().required("Password is required!").min(2, "Password must be at least 2 characters"),
});
