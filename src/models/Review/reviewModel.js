import reviewCollection from "./reviewSchema.js";

//get reviews by product ID
export const getAllReviews = async () => {
  const reviews = await reviewCollection
    .find()
    .populate("userId", "fName lName email profilePicture")
    .populate("productId", "title thumbnail")
    .exec();

  return reviews;
};

// update review status
export const updateReview = async (reviewId, newStatus) => {
  const updatedReview = await reviewCollection.findByIdAndUpdate(
    reviewId,
    { status: newStatus },
    { new: true }
  );

  return updatedReview;
};

//delete review
export const deleteReview = async (reviewId) => {
  const deletedReview = await reviewCollection.findByIdAndDelete(reviewId);
  return deletedReview;
};
