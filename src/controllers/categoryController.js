import slugify from "slugify";
import {
  addNewCategory,
  deleteCategoryById,
  getAllCategory,
  getCategoriesByParentId,
  getCategoryById,
  updateCategory,
  updateChildrenCategories,
} from "../models/Category/categoryModel.js";
import responseClient from "../utility/responseClient.js";
import { getCategoryPath } from "../utility/categoryPath.js";
import {
  getProductsByCategoryId,
  updateProductsCategoryPath,
} from "../models/Product/productModel.js";
import buildCategoryTree from "../utility/buildCategoryTree.js";

export const createNewCategory = async (req, res, next) => {
  try {
    const category = req.body;

    const { path, level } = await getCategoryPath({
      name: category.name,
      parentId: category.parent === "" ? null : category.parent,
    });

    const obj = {
      ...category,
      slug: slugify(category.name, { lower: true }),
      path,
      level,
    };
    const cat = await addNewCategory(obj);

    cat?._id
      ? responseClient({ req, res, message: "New Category Added Sucessfully" })
      : responseClient({
          req,
          res,
          message: "unable to add New Category",
          statusCode: 401,
        });
  } catch (error) {
    if (error.message.includes("E11000 duplicate key error collection")) {
      error.message = "this category is already available.Try next 😊";
    }
    next(error);
  }
};
export const getAllCategories = async (req, res, next) => {
  try {
    const categories = await getAllCategory();

    if (categories.length && Array.isArray(categories)) {
      const nestedCategories = buildCategoryTree(categories);
      return responseClient({
        res,
        message: "here is the list of all categories",
        payload: nestedCategories,
      });
    } else {
      responseClient({
        res,
        statusCode: 400,
        message: "something went wrong could not create categpry",
      });
    }
  } catch (error) {
    next(error);
  }
};

// export const updateCategoryController = async (req, res, next) => {
//   try {
//     // step 1 get data from req.body
//     const { _id, name } = req.body;

//     // step 2 fetch csategry by id from db
//     const category = await getCategoryById(_id);

//     if (category?._id) {
//       const { parent } = category;
//       const oldPath = category.path;

//       const newslug = slugify(name, { lower: true });
//       const { path } = await getCategoryPath({
//         name: name,
//         parentId: parent === "" ? null : parent,
//       });
//       // update category

//       const updateObj = { name, path, slug: newslug };
//       const updatedCategory = await updateCategory({ _id }, updateObj);
//       if (updatedCategory?._id) {
//         // update the children
//         const updatedChildrens = await updateChildrenCategories(oldPath, path);
//         if (updatedChildrens?.modifiedCount > 0) {
//           const updatedProdtcsWithCategoryPath =
//             await updateProductsCategoryPath(oldPath, path);

//           if (updatedProdtcsWithCategoryPath?.modifiedCount > 0) {
//             return responseClient({
//               message: "updated the category successfully",
//               res,
//             });
//           } else {
//             responseClient({
//               message: `categrory has been updated but there is no product under this categry`,
//               res,
//             });
//           }
//         }
//       }
//     }
//     return responseClient({
//       res,
//       message: "something went wrong could not update category",
//       statusCode: 400,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// delete category
export const updateCategoryController = async (req, res, next) => {
  try {
    // Step 1: Get ID from params, name from body
    const { id } = req.params;
    const { name } = req.body;

    if (!id || !name) {
      return responseClient({
        res,
        statusCode: 400,
        message: "Category ID and name are required",
      });
    }

    // Step 2: Fetch category by ID
    const category = await getCategoryById(id);

    if (!category) {
      return responseClient({
        res,
        statusCode: 404,
        message: "Category not found",
      });
    }

    const oldPath = category.path;
    const parent = category.parent || null;

    // Step 3: Generate new slug and path
    const newSlug = slugify(name, { lower: true });
    const { path } = await getCategoryPath({
      name,
      parentId: parent === "" ? null : parent,
    });

    // Step 4: Update category
    const updateObj = { name, path, slug: newSlug };
    const updatedCategory = await updateCategory(id, updateObj);

    if (!updatedCategory) {
      return responseClient({
        res,
        statusCode: 400,
        message: "Failed to update category",
      });
    }

    // Step 5: Update children categories paths
    const updatedChildren = await updateChildrenCategories(oldPath, path);

    if (updatedChildren?.modifiedCount > 0) {
      // Step 6: Update products' category paths
      const updatedProducts = await updateProductsCategoryPath(oldPath, path);

      if (updatedProducts?.modifiedCount > 0) {
        return responseClient({
          res,
          message: "Updated category and products successfully",
        });
      } else {
        return responseClient({
          res,
          message:
            "Category updated, but no products found under this category",
        });
      }
    }

    // If no children updated, still send success
    return responseClient({
      res,
      message: "Category updated successfully (no child categories affected)",
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    // Check for child categories
    const childCategories = await getCategoriesByParentId(id);

    const hasChildren = childCategories.length > 0;

    if (hasChildren) {
      return responseClient({
        res,
        statusCode: 400,
        message:
          " delete sub categories first inside this category before deleting this category",
      });
    }

    // Check if category is associated with products
    const products = await getProductsByCategoryId({ categoryId: id });

    if (products.length > 0) {
      return responseClient({
        res,
        statusCode: 400,
        message: "Cannot delete a category which has products",
      });
    }

    // Delete category using model function
    const deletedCategory = await deleteCategoryById(id);

    if (!deletedCategory) {
      return responseClient({
        res,
        statusCode: 404,
        message: "Could not find category",
      });
    }

    return responseClient({
      res,
      statusCode: 200,
      message: "Category deleted successfully",
    });
  } catch (error) {
    return responseClient({
      res,
      statusCode: 500,
      message: "Server Error",
      error: error.message,
    });
  }
};
