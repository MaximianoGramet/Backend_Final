import { CartService } from "../Services/services.js";
import TicketDto from "../Services/dtos/ticket.dto.js";
import { productService } from "../Services/services.js";
import { ticketService } from "../Services/services.js";
import userModel from "../models/user.model.js";

export const getCartController = async (req, res) => {
  try {
    const carts = await CartService.findCart();
    res.json({
      data: carts,
      message: "Carts list",
    });
  } catch (error) {
    console.error(error);
    res.json({
      error,
      message: "Error",
    });
  }
};

export const getCartByIdController = async (req, res) => {
  const { cid } = req.params;
  try {
    const cart = await CartService.findById(cid);

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.status(200).json({
      cart,
      message: "Cart found",
    });
  } catch (error) {
    console.error(error);
    res.json({
      error,
      message: "Error",
    });
  }
};

export const createCartController = async (req, res) => {
  try {
    if (!req.session.user) {
      console.warn("You must be logged to create a cart");
      res.status(401).json({
        message: "Error,You must be logged to create a cart",
      });
    } else {
      const user = req.session.user;
      if (user) {
        const cart = await CartService.createCart();
        user.cart = cart._id;
        await userModel.findByIdAndUpdate(user._id, { cart: cart._id });
        req.session.user.cart = { cart: cart._id };
        res.json({
          cart,
          message: "Cart created",
        });
      } else {
        console.warn("User session not found");
      }
    }
  } catch (error) {
    console.error(error);
    res.json({
      error,
      message: "Error",
    });
  }
};

export const updateCartController = async (req, res) => {
  const { cid } = req.params;
  try {
    const cart = await CartService.updateProducts(cid, req.body);
    res.json({
      cart,
      message: "Cart updated",
    });
  } catch (error) {
    console.error(error);
    res.json({
      error,
      message: "Error",
    });
  }
};

export const deleteCartController = async (req, res) => {
  const { cid } = req.params;
  try {
    const cart = await CartService.deleteCart(cid);
    res.json({
      cart,
      message: "Cart deleted",
    });
  } catch (error) {
    console.error(error);
    res.json({
      error,
      message: "Error",
    });
  }
};

export const clearCartController = async (req, res) => {
  const { cid } = req.params;
  try {
    const result = await CartService.clearCart(cid);
    res.json({
      result,
      message: "Cart cleared",
    });
  } catch (error) {
    console.error(error);
    res.json({
      error,
      message: "Error",
    });
  }
};

export const deleteProductFromCartController = async (req, res) => {
  const { cid, pid } = req.params;
  try {
    const result = await CartService.deleteProductFromCart(cid, pid);
    res.json({
      result,
      message: "Product deleted from cart",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

export const setProductQuantityController = async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;
  try {
    const result = await CartService.setProductQuantity(cid, pid, quantity);
    res.json({
      result,
      message: "Product quantity updated",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

export const addProductCartController = async (req, res) => {
  const { cid, pid } = req.params;
  const currentUser = req.body.email;
  try {
    const product = await productService.getProductById(pid);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    if (product.owner === currentUser) {
      return res
        .status(403)
        .json({ message: "You cannot add your own product to your cart" });
    }
    const result = await CartService.addProductCart(cid, pid);
    res.json({
      result,
      message: "Product added",
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
    console.log(error);
  }
};

export const finishPurchase = async (req, res) => {
  try {
    let cart = await CartService.findById(req.params.cid);
    let total_price = 0;
    let unstocked_products = [];
    for (const item of cart.products) {
      console.log(item);
      let product = await productService.getProductById(item._id);
      if (product.stock >= item.quantity) {
        total_price += item.quantity * product.price;
        let stockcontrol = await productService.updateProduct(item, {
          stock: product.stock - item.quantity,
        });
      } else {
        unstocked_products.push({
          product: product._id,
          quantity: item.quantity,
        });
      }
    }

    if (total_price > 0) {
      cart.products = unstocked_products;
      const user = await userModel.findOne({ cart: req.params.cid });
      let newCart = await CartService.updateProducts(req.params.cid, cart);
      let newTicket = await ticketService.createTicket({
        code: `${req.params.cid}_${Date.now()}`,
        amount: total_price,
        purchaser: user.email,
      });
      return res.status(200).json(new TicketDto(newTicket));
    } else {
      if (cart.products && cart.products.length === 0) {
        return res.status(404).json({ message: "Cart is empty" });
      }
      return res.status(404).json({ message: "Purchase failed" });
    }
  } catch (error) {
    console.error(error);
  }
};
