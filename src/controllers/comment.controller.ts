import CommentModel from "../models/comment.model";
import MemberModal from "../models/member.model";
import WatchModel from "../models/watch.model";
import { createCommentSchema } from "../schema/comment.schemas";
import catchErrors from "../utils/catchErrors";
import { verifyToken } from "../utils/jwt";
import validateRequest from "../utils/validateRequest";

export const createCommentHandler = catchErrors(async (req, res) => {
  const { payload } = verifyToken(req.cookies.accessToken);
  const member = await MemberModal.findOne({ _id: payload?.memberId });
  const watchDe = await WatchModel.findOne({ _id: req.body.watchId });
  const { rating, content } = req.body;
  // const request = validateRequest(createCommentSchema, {
  //   ...req.body,
  // });
  if (watchDe == null) {
    res.redirect("404");
  } else {
    if (parseInt(rating) <= 0 || content == "" || parseInt(rating) >= 4) {
      console.log("rating", rating);

      res.render("/watches/watchDetail", {
        _id: watchDe._id,
        name: watchDe.watchName,
        price: watchDe.price,
        image: watchDe.image,
        description: watchDe.watchDescription,
        isAutomatic: watchDe.automatic,
        brandId: watchDe?.brandId.brandName,
        errorMessage: "Content or Rating is invalid",
      });
    }
  }

  const commentDoc = await CommentModel.findOne({
    author: member?._id,
    watchId: req.body.watchId,
  }).lean();
  if (commentDoc) {
    return res.render("400", {
      errorMessage: `You have commented this orchid before.`,
      isLoggedIn: !!req.cookies.accessToken,
      member: member?.role,
    });
  }
  const commentDocument = await CommentModel.create({
    content: req.body.content,
    rating: req.body.rating,
    author: member?._id,
    watchId: req.body.watchId,
  });

  const watch = await WatchModel.findById(req.body.watchId);
  watch?.comments?.push(commentDocument._id);
  watch?.save();

  return res.redirect(`/watches/${watch?._id}`);
});
