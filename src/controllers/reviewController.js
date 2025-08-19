import {
  deleteReview,
  getAllReviews,
  updateReview,
} from "../models/Review/reviewModel.js";
import responseClient from "../utility/responseClient.js";

// Controller to get all reviews
export const getAllReviewsController = async (req, res, next) => {
  try {
    // call model
    const reviews = await getAllReviews();
    if (reviews?.length && Array.isArray(reviews)) {
      return responseClient({
        message: "Here are all the reviews",
        res,
        payload: reviews,
      });
    } else {
      return responseClient({
        message: "No reviews found",
        res,
        statusCode: 404,
      });
    }
  } catch (error) {
    next(error);
  }
};

// Controller to update review status
// export const updateReviewStatusController = async (req, res, next) => {
//   try {
//     const { reviewId } = req.params;
//     const { newStatus } = req.body;

//     // Validate newStatus
//     const allowedStatuses = ["pending", "approved", "rejected"];
//     if (!allowedStatuses.includes(newStatus)) {
//       return responseClient({
//         message: "Invalid review status",
//         res,
//         statusCode: 400,
//       });
//     }

//     // call model to update review status
//     const updatedReview = await updateReview(reviewId, newStatus);
//     if (updatedReview?._id) {
//       return responseClient({
//         message: "Review status updated successfully",
//         res,
//         payload: updatedReview,
//       });
//     } else {
//       return responseClient({
//         message: "Failed to update review status",
//         res,
//         statusCode: 400,
//       });
//     }
//   } catch (error) {
//     next(error);
//   }
// };

export const updateReviewStatusController = async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    const { newStatus } = req.body;

    // Validate newStatus
    const allowedStatuses = ["pending", "approved", "rejected"];
    if (!allowedStatuses.includes(newStatus)) {
      return responseClient({
        message: "Invalid review status",
        res,
        statusCode: 400,
      });
    }

    // If status is rejected, delete the review
    // if (newStatus === "rejected") {
    //   const deletedReview = await deleteReview(reviewId);
    //   if (deletedReview?._id) {
    //     return responseClient({
    //       message: "Review rejected and deleted successfully",
    //       res,
    //       payload: deletedReview,
    //     });
    //   } else {
    //     return responseClient({
    //       message: "Failed to reject and delete review",
    //       res,
    //       statusCode: 400,
    //     });
    //   }
    // }

    // Otherwise, update the review status
    const updatedReview = await updateReview(reviewId, newStatus);
    if (updatedReview?._id) {
      return responseClient({
        message: "Review status updated successfully",
        res,
        payload: updatedReview,
      });
    } else {
      return responseClient({
        message: "Failed to update review status",
        res,
        statusCode: 400,
      });
    }
  } catch (error) {
    next(error);
  }
};
