import {Router} from "express";
import favouritesCTRL from "../controllers/FavouritesController.js";
//import {getFavourites, createFavourite, updateFavourite, deleteFavourite} from "./controllers/favouritesController.js";
import auth from "../middlewares/basicAuth.js";
const router = Router();

/**
 * without route chaining 
 * 
router.get("/", getFavourites);
router.post("/", createFavourite);
router.put("/:id", updateFavourite);
router.delete("/:id", deleteFavourite);
*/

// @route   /api/favourites
router
  .route("/")
  // @desc   POST Add new favourite (only if not already saved)
  // @access Developer

  .post(auth, favouritesCTRL.createFavourite)
  // @desc   GET all favourite meals
  // @access Developer
  .get(auth, favouritesCTRL.getFavourites);

// @route   /api/favourites/:id
router
  .route("/:idMeal")
  // @desc   PUT Update a favourite item 
  // @access Developer
  //.put(auth, favouritesCTRL.updateFavourites)
  // @desc   DELETE a favourite item
  // @access Developer
  .delete(auth, favouritesCTRL.deleteFavourites);

  // @route   /api/favourites/update
router
  .route("/update")
  // @desc   PUT Update a favourite item 
  // @access Developer
  .put(auth, favouritesCTRL.updateFavourite)
  // @desc   PUT Update a favourite item 
  // @access Developer
  .post(auth, favouritesCTRL.createFavourite)

export default router;
