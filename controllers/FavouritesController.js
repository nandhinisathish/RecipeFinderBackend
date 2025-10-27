
import FavouriteModel from "../models/favourites.js";
import UserModel from "../models/userSchema.js";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

// POST /api/favourites
// Add meal to favourites
const createFavourite = async (req, res, next) => {
  try {
    //const { idMeal, strMeal } = req.body;
    const { idMeal, title, thumbnail, sourceUrl, youtubeUrl, origin, tags } = req.body;

    if (!idMeal || !title) {
      return res
        .status(400)
        .json({ message: "Error - missing mandatory fields" });
    }
  // Loop through the favourites and save each meal if not already saved
  const mealIds = []; // To store the valid meal ids
   const { favourites} = req.body; // Expect the favourites list in the body
    const userId = req.user.id; // Get the user's ID from the JWT payload (auth middleware)

  console.log("***** User id sent to mongoDB : ", userId);
 
    // Check if the meal already exists in the database or not
    const existingMeal = await FavouriteModel.findOne({ idMeal: meal.idMeal , userId}); 

    if (existingMeal) {
      // If meal already exists, use its _id
      mealIds.push(existingMeal._id);
    } else {
      // If the meal doesn't exist, create a new one and save it
      const newMeal = new FavouriteModel({ idMeal: favourites.idMeal,
        title: meal.strMeal, 
        category: meal.strCategory,
        area: meal.strArea, 
        instructions: meal.strInstructions, 
        mealThumb: meal.strMealThumb,
        tags: meal.strTags, 
        youtube: meal.strYoutube,
        source: meal.strSource 
      , userId});
        await newMeal.save();
      mealIds.push(newMeal._id);
    }
  

    // Preventing duplicates recipes getting saved by idMeal
    const existing = await FavouriteModel.findOne({
      idMeal,
      userId: req.user.id,
    });
    if (existing) {
      return res
        .status(400)
        .json({ message: "You have already saved this meal" });
    }

    const data = { ...req.body, userId: req.user.id };

    const favourite = await FavouriteModel.create(data);

    return res.status(201).json(favourite);
  } catch (error) {
    console.error(`❌ Error :`, error.message);
    return res.status(500).json({ msg: error.message });
  }
};

// GET /api/favourites
// Get all favourite meals, sorted by creation date (newest first)
const getFavourites = async (req, res, next) => {
  try {
    const currentUserId = req.user.id;

    const favouritesList = await FavouriteModel.find({
      userId: currentUserId,
    }).sort({ createdAt: -1 });
    return res.status(200).json(favouritesList);
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ msg: `❌ Error - ${err.message}` });
  }
};

// // PUT /api/favourites/:id
// // Update favourite meal

const updateFavouritesInDB = async (userId, favourites) => {
  // This is the function that updates the user's favourites in the DB
  const user = await UserModel.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  // Loop through the favourites and save each meal if not already saved
  const mealIds = []; // To store the valid meal ids
  
  console.log("***** User id sent to mongoDB : ", userId);
  for (let meal of favourites) {
    // Check if the meal already exists in the database or not
    const existingMeal = await FavouriteModel.findOne({ idMeal: meal.idMeal , userId}); 

    if (existingMeal) {
      // If meal already exists, use its _id
      mealIds.push(existingMeal._id);
    } else {
      // If the meal doesn't exist, create a new one and save it
      const newMeal = new FavouriteModel({ idMeal: meal.idMeal,
        title: meal.strMeal, 
        category: meal.strCategory, 
        area: meal.strArea, 
        instructions: meal.strInstructions, 
        mealThumb: meal.strMealThumb, 
        tags: meal.strTags, 
        youtube: meal.strYoutube, 
        source: meal.strSource 
      , userId});
        await newMeal.save();
      mealIds.push(newMeal._id);
    }
  }

  // Update the user's favourites with the list of ObjectIds
  user.favourites = mealIds;

  // Save the updated user
  await user.save();
  
  return user.favourites; // Return the updated favourites (now with ObjectIds)
};

const updateFavourite = async (req, res) => {
  try {
    const { favourites} = req.body; // Expect the favourites list in the body
    const userId = req.user.id; // Get the user's ID from the JWT payload (auth middleware)

    if (!Array.isArray(favourites)) {
      return res.status(400).json({ message: 'Invalid favourites list' });
    }

    // Call the function to update favourites in the database
    const updatedFavs = await updateFavouritesInDB(userId, favourites);
    
    // Return the updated favourites as the response
    return res.json(updatedFavs);

  } catch (err) {
    // Improved error logging for better debugging
    console.error('Error occurred while updating favourites:', err);
    return res.status(500).json({ msg: `❌ Error - ${err.message}` });
  }
};


// DELETE /api/favourites/:id
// Remove a favourite meal

const deleteFavourites = async (req, res, next) => {
    
  try {
    const {idMeal} = req.params;
     console.log("idMeal : ", idMeal);
          console.log("userId: req.user.id : ",  req.user.id);
          
// if (!mongoose.Types.ObjectId.isValid(idMeal)) {
//   return res.status(400).json({ message: "Invalid idMeal format" });
// }
    const deletedFavourite = await FavouriteModel.findOneAndDelete({
      idMeal,
      userId: req.user.id,
    });
console.log("deletedFavourite : ", deletedFavourite);
    if (!deletedFavourite) {
      
      return res.status(400).json({
        message:
          "Delete failed: Recipe with the given ID is not found in favourites.",
      });
    }

    return res.json({
      message: `Recipe-${req.params.id} removed from favourites list.`,
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ msg: `❌ Error - ${err.message}` });
  }
};

export default {
  createFavourite,
  getFavourites,
  updateFavourite,
  deleteFavourites,
};
