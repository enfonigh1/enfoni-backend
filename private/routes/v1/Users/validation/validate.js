/* eslint-disable */
// VALIDATION
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

const complexityOptions = {
  min: 6,
  max: 1025,
  lowerCase: 1,
  upperCase: 1,
  numeric: 1,
  symbol: 1,
  requirementCount: 4,
};

// register validation
const registerValidation = (data) => {
  const schema = Joi.object({
    full_name: Joi.string().required(),
    email: Joi.string().min(6).required().email().required(),
    password: passwordComplexity(complexityOptions).required(),
    college_name: Joi.string(),
    student_id: Joi.string().min(6),
    phone_number: Joi.string().min(10),
    date_of_graduation: Joi.date(),
  });
  return schema.validate(data);
};

// Guest register validation using full name, email and password
const guestRegisterValidation = (data) => {
  const schema = Joi.object({
    full_name: Joi.string().required(),
    email: Joi.string().min(6).required().email().required(),
    password: passwordComplexity(complexityOptions).required(),
  });
  return schema.validate(data);
};

// login validation
const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().min(6).required().email().required(),
    password: passwordComplexity(complexityOptions).required(),
  });
  return schema.validate(data);
};

// forgot-password email validation
const emailValidation = (data) => {
  const emailschema = Joi.object({
    email: Joi.string().min(6).required().email().required(),
  });
  return emailschema.validate(data);
};

// reset password validation
const passwordValidation = (data) => {
  const passwordschema = Joi.object({
    email: Joi.string().min(6).required().email().required(),
    password: passwordComplexity(complexityOptions).required(),
  });
  return passwordschema.validate(data);
};

module.exports = {
  registerValidation,
  loginValidation,
  emailValidation,
  passwordValidation,
  guestRegisterValidation,
};
