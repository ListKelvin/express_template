import Joi from "joi";

const commentSchema = Joi.string().required().min(2).messages({
  "any.only": "Please enter a comment",
});
const ratingSchema = Joi.string().required().min(1).max(3).messages({
  "any.only": "Please rating",
});
const createCommentSchema = Joi.object({
  rating: ratingSchema,
  content: commentSchema,
});

export { createCommentSchema };
