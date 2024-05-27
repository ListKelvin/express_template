import Joi from "joi";

const brandSchema = Joi.string().required().min(2).max(30).messages({
  "any.only": "Please enter a valid Brand",
});
const createBrandSchema = Joi.object({
  brandName: brandSchema,
});

const updateBrandSchema = Joi.object({
  brandName: brandSchema,
});

export { createBrandSchema, updateBrandSchema };
