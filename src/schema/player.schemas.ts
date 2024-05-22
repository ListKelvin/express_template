import Joi from "joi";

const playerSchema = Joi.string().required().min(2).max(30).messages({
  "any.only": "Please enter a valid name",
});
const createPlayerSchema = Joi.object({
  name: playerSchema,
  club: String,
  nationId: String,
});

const updatePlayerSchema = Joi.object({
  name: playerSchema,
  club: String,
  nationId: String,
});

export { createPlayerSchema, updatePlayerSchema };
