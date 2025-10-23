import mongoose,{Schema} from "mongoose";


const favouriteSchema = new mongoose.Schema({
  userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
       required: true,
      validate: {
        validator: async function (userId) {
          const user = await mongoose.models.User.findById({ _id: userId });
          return !!user; // if user exists continue, else throw error
        },
        message: (props) =>
          `This user with ${props.path}:${props.value} does not exist`,
      },
      index: true, //Simple single key index
    },
   idMeal: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  thumbnail: String,       // strMealThumb
  sourceUrl: String,       // strSource
  youtubeUrl: String,      // strYoutube
  origin: String,          // strArea (e.g., "Italian", "Mexican")
  tags: [String],          // Optional local tags
  notes: String,           // Optional notes
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

//const Favourite = mongoose.model("Favourite", favouriteSchema);
//export default Favourite;
 // favourites: [Schema.Types.Mixed],
export default mongoose.model("favourites", favouriteSchema);

