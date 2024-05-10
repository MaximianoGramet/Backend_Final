import { Schema, model } from "mongoose";

const cartSchema = new Schema({
  products: [
    {
      product: { type: Schema.Types.ObjectId, ref: "products" },
      quantity: { type: Number, required: true, default: 1 },
    },
  ],
});

cartSchema.pre("find", function () {
  this.populate({ path: "products.product" });
});

const CartModel = model("carts", cartSchema);

export { CartModel };
