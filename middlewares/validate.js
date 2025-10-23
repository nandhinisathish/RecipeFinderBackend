export const validateFavourite = (req, res, next) => {
  const { idMeal, title } = req.body;

  if (!idMeal || typeof idMeal !== "string" || idMeal.trim() === "") {
    return res
      .status(400)
      .json({
        error: "ValidationError",
        message: "idMeal is required and cannot be empty",
      });
  }

  if (!title || typeof title !== "string" || title.trim() === "") {
    return res
      .status(400)
      .json({
        error: "ValidationError",
        msg: "title is required and must be a string",
      });
  }

  next();
};
