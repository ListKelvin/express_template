import Joi, { optional } from "joi";

const watchSchema = Joi.string().required().min(2).max(30).messages({
  "any.only": "Please enter a valid name",
});
const createWatchSchema = Joi.object({
  watchName: watchSchema,
  image: optional,
  price: Joi.number().required().min(1).max(10000).messages({
    "any.only": "Please enter a suitable price 1 - 10000$",
  }),
  automatic: Boolean,
  watchDescription: String,
  //   comments: Array<Comment>;
  brand: Joi.string().required().messages({
    "any.only": "Please select a brand",
  }),
});

const updateWatchSchema = Joi.object({
  watchName: watchSchema,
  image: Joi.string().optional(),
  price: Joi.number().required().min(1).max(10000).messages({
    "any.only": "Please enter a suitable price 1 - 10000$",
  }),
  automatic: Boolean,
  watchDescription: String,
  //   comments: Array<Comment>;
  brand: Joi.string().required().messages({
    "any.only": "Please select a brand",
  }),
});

export { createWatchSchema, updateWatchSchema };
