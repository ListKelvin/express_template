import Joi from "joi";

const nationSchema = Joi.string().required().min(2).max(30).messages({
  "any.only": "Please enter a valid nation",
});
const createNationSchema = Joi.object({
  name: nationSchema,
  imageUrl: String,
});

const updateNationSchema = Joi.object({
  name: nationSchema,
  imageUrl: String,
});

export { createNationSchema, updateNationSchema };
