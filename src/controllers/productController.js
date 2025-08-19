import slugify from "slugify";
import {
  addNewProduct,
  deleteProducts,
  getAllProducts,
  getProductById,
  getProductsByCategoryId,
  updateProduct,
} from "../models/Product/productModel.js";
import responseClient from "../utility/responseClient.js";
import { getCategoryById } from "../models/Category/categoryModel.js";
// add prodcut controller statrt here
export const addProductController = async (req, res, next) => {
  try {
    const slug = slugify(req.body.title, { lower: true });
    const category = await getCategoryById(req.body.categoryId);
    if (!category?._id) {
      throw new Error("could not find category");
    }
    const productPath = `${category?.path?.slice(1)}/${slug}`;

    const obj = {
      ...req.body,
      thumbnail: req.body.images[0],
      slug,
      productPath,
    };
    console.log(obj);

    const product = await addNewProduct(obj);
    console.log(product);

    product?._id
      ? responseClient({ res, message: "Product added succesfully👌" })
      : responseClient({
          res,
          message:
            "something went wrong,Product cound not added please try again!😒",
          statusCode: 401,
        });
  } catch (error) {
    next(error);
  }
};
// add prodcut controller end here

export const getProductsByCategoryIdController = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    if (categoryId) {
      // call model
      const products = await getProductsByCategoryId({ categoryId });
      if (Array.isArray(products)) {
        return responseClient({
          message: "here is the list of products based on selected category",
          res,
          payload: products,
        });
      }
    } else {
      return responseClient({ message: "invalid id", res, statusCode: 400 });
    }
  } catch (error) {
    next(error);
  }
};

export const getProductByIdController = async (req, res, next) => {
  try {
    const { _id } = req.params;
    console.log(_id);

    if (_id) {
      // call model
      const product = await getProductById({ _id });
      if (product?._id) {
        return responseClient({
          message: "here is the product",
          res,
          payload: product,
        });
      }
    } else {
      return responseClient({ message: "invalid id", res, statusCode: 400 });
    }
  } catch (error) {
    next(error);
  }
};
export const getAllProductsController = async (req, res, next) => {
  try {
    // call model
    const producstList = await getAllProducts();
    if (producstList?.length && Array.isArray(producstList)) {
      return responseClient({
        message: "here is the product list",
        res,
        payload: producstList,
      });
    } else {
      return responseClient({
        message: "there is no product sorry!😂",
        res,
        statusCode: 400,
      });
    }
  } catch (error) {
    next(error);
  }
};
export const updateProductsController = async (req, res, next) => {
  try {
    const { _id } = req.params;

    // call model
    const updatedProduct = await updateProduct({ _id }, req.body);
    if (updatedProduct?._id) {
      return responseClient({
        message: "product is updated",
        res,
        payload: updatedProduct,
      });
    } else {
      return responseClient({
        message: " sorry!😂 could not update the product. Try again later",
        res,
        statusCode: 400,
      });
    }
  } catch (error) {
    next(error);
  }
};
export const deleteProductsController = async (req, res, next) => {
  try {
    // call model
    const id = req.params.id;
    const deletedProductByIds = await deleteProducts([id]);

    if (deletedProductByIds.deletedCount >= 1) {
      return responseClient({
        res,
        message: `you have deleted ${deletedProductByIds.deletedCount} products☺️`,
      });
    }
    return responseClient({
      message: "could not deleted the products. Try again later",
      statusCode: 400,
      res,
    });
  } catch (error) {
    next(error);
  }
};
