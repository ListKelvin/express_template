import Joi from "joi";

export const emailSchema = Joi.string().email().required().messages({
  "any.only": "Please enter a valid email",
});
export const memberNameSchema = Joi.string().min(2).required().messages({
  "any.only": "Please enter a long name",
});
const passwordSchema = Joi.string().min(6).required();

export const loginSchema = Joi.object({
  email: emailSchema,
  password: passwordSchema,
  userAgent: Joi.string().optional(),
});
export const loginMemberSchema = Joi.object({
  memberName: memberNameSchema,

  password: passwordSchema,
  userAgent: Joi.string().optional(),
});
export const registerSchema = Joi.object({
  email: emailSchema,
  userAgent: Joi.string().optional(),
  password: passwordSchema,
  confirmPassword: Joi.string().valid(Joi.ref("password")).required().messages({
    "any.only": "Passwords do not match",
  }),
});
export const registerMemberSchema = Joi.object({
  email: emailSchema,
  memberName: memberNameSchema,
  userAgent: Joi.string().optional(),
  password: passwordSchema,
  confirmPassword: Joi.string().valid(Joi.ref("password")).required().messages({
    "any.only": "Passwords do not match",
  }),
});
export const verificationCodeSchema = Joi.string().min(1).max(24).required();

export const resetPasswordSchema = Joi.object({
  password: passwordSchema,
  verificationCode: verificationCodeSchema,
});
