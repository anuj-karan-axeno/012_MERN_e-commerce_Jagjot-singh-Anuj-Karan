import { cartModel } from "../../models/cart.schema.js";
import { errorResponse, successResponse } from "../../utility/apiResponse.js";

export const addToCart = async (req, res) => {
    try {
        const userId = req.user._id;
        const { product, size, quantity } = req.body ?? {};

        if (!product || !size) {
            return errorResponse(res, 400, "Product and size are required");
        }

        if (quantity < 1) {
            return errorResponse(res, 400, "Quantity must be at least 1");
        }

        let cart = await cartModel.findOne({ user: userId });

        if (!cart) {
            cart = await cartModel.create({
                user: userId,
                items: [
                    {
                        product,
                        size,
                        quantity
                    }
                ]
            });

            return successResponse(res, 201, "Product added to cart", cart);
        }

        const existingItem = cart.items.find((item) => {
            return (
                item.product.toString() === product &&
                item.size.toLowerCase() === size.toLowerCase()
            );
        });

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({
                product,
                size,
                quantity
            });
        }

        await cart.save();

        return successResponse(res, 200, "Product added to cart", cart);

    } catch (error) {
        console.error(error)

        return errorResponse(res, 500, "Internal Server Error");
    }
};

export const increaseCartItemQuantity = async (req, res) => {
    try {
        const userId = req.user?._id;
        const { itemId } = req.params;

        const cart = await cartModel.findOne({ user: userId });

        if (!cart) {
            return errorResponse(res, 404, "Cart not found");
        }

        const item = cart.items.find((item) => item.product == itemId);

        if (!item) {
            return errorResponse(res, 404, "Item not found in cart");
        }

        item.quantity += 1;

        await cart.save();

        return successResponse(res, 200, "Quantity increased", cart);

    } catch (error) {
        console.error(error);

        if (error.name === "CastError") {
            return errorResponse(res, 400, "Invalid item ID");
        }

        return errorResponse(res, 500, "Internal Server Error");
    }
};

export const decreaseCartItemQuantity = async (req, res) => {
    try {
        const userId = req.user?._id;
        const { itemId } = req.params;

        const cart = await cartModel.findOne({ user: userId });

        if (!cart) {
            return errorResponse(res, 404, "Cart not found");
        }

        const item = cart.items.find((item) => item.product == itemId);

        if (!item) {
            return errorResponse(res, 404, "Item not found in cart");
        }

        if (item.quantity <= 1) {
            cart.items = [];
        } else {
            item.quantity -= 1;
        }

        await cart.save();

        return successResponse(res, 200, "Quantity decreased", cart);
        
    } catch (error) {
        console.error(error);
        
        return errorResponse(res, 500, "Internal Server Error");
    }
};

export const fetchCart = async (req, res) => {
    try {
        const userId = req.user?._id;
        
        const cart = await cartModel.findOne({ user: userId });
        
        if (!cart) {
            return errorResponse(res, 400, "Cart not found");
        }
        
        return successResponse(res, 200, "Successfully fetched cart", cart);
        
    } catch (error) {
        console.error(error);

        return errorResponse(res, 500, "Internal Server Error");
    }
}