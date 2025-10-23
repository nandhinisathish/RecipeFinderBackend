import FavouriteModel from "../models/favourites.js";
import dotenv from "dotenv";

dotenv.config();

// POST /api/favourites
// Add meal to favourites
const createFavourite = async (req, res, next) => {
  try {
    const { idMeal, title } = req.body;

    if (!idMeal || !title) {
      return res
        .status(400)
        .json({ message: "Error - missing mandatory fields" });
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

// PUT /api/favourites/:id
// Update favourite meal

const updateFavourites = async (req, res, next) => {
  try {
    const updateFavourites = await FavouriteModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    console.log("updateFavourites: ", updateFavourites);

    if (!updateFavourites) {
      return res.status(404).json({
        message: `Update Skipped: Recipe -${req.params.id} with the given ID is not found in favourites.`,
      });
    }
    return res.json(updateFavourites);
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ msg: `❌ Error - ${err.message}` });
  }
};

// DELETE /api/favourites/:id
// Remove a favourite meal

const deleteFavourites = async (req, res, next) => {
  try {
    const deletedFavourite = await FavouriteModel.findByIdAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!deletedFavourite) {
      console.log("deletedFavourite", deletedFavourite);
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
  updateFavourites,
  deleteFavourites,
};
