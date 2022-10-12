const mongoose = require("mongoose");
const objectId = mongoose.Schema.Types.ObjectId;

const cartSchema = new mongoose.Schema(
  {
    userId: { type: objectId, require: true, unique: true },
    items: [
      {
        productId: { type: objectId, require: true },
        quantity: { type: Number, require: true, default: 1 },
      },
    ],
    totalPrice: { type: Number, require: true }, //comment: "Holds total price of all the items in the cart"
    totalItems: { type: Number, require: true }, //comment: "Holds total number of items in the cart"
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", cartSchema);
