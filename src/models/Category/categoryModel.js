import categoryCollection from "./categorySchema.js";
// add new category
export const addNewCategory = async (obj) => {
  const category = await categoryCollection(obj).save();
  return category;
};

export const getCategoryById = async (_id) => {
  return await categoryCollection.findById(_id);
};

// Get categories by parent ID
export const getCategoriesByParentId = async (parentId) => {
  return await categoryCollection.find({ parent: parentId });
};

export const getCategoryBySlug = async (slug) => {
  return await categoryCollection.findOne({ slug });
};
export const getAllCategory = async () => {
  return await categoryCollection.find({}).lean();
};
//delete category
export const deleteCategoryById = async (_id) => {
  return await categoryCollection.findByIdAndDelete(_id);
};

export const updateCategory = async (filter, update) => {
  return await categoryCollection.findByIdAndUpdate(filter, update, {
    new: true,
  });
};
export const updateChildrenCategories = async (oldPath, newPath) => {
  // old path  = /men/shoes
  // new path  = /mens/shoes

  return await categoryCollection.updateMany(
    { path: { $regex: `^${oldPath}/` } }, // output:all the cateegries list with path /mens/shoes, /mens/shoe/casuals
    [
      {
        $set: {
          path: {
            $replaceOne: {
              input: "$path", //
              find: oldPath,
              replacement: newPath,
            },
          },
        },
      },
    ]
  );
};
