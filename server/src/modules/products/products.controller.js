import { categoryModel } from "../../models/category.schema.js"
import { productModel } from "../../models/product.schema.js"
import { errorResponse, successResponse } from "../../utility/apiResponse.js"
import { uploadToCloudinary } from "../../utility/uploadToCloudinary.js"

export const addProduct = async (req, res) => {
    try {
        const { name, description, price, categories, variants } = req.body ?? {}
        console.log(req.body)
        const errors = []

        if (!name?.trim()) {
            errors.push({ field: "name", message: "Product name is required" })
        }
        if (!description?.trim()) {
            errors.push({ field: "description", message: "Description is required" })
        }
        if (price === undefined || isNaN(price) || Number(price) < 0) {
            errors.push({ field: "price", message: "A valid price is required" })
        }
        let categoryIds = []
        if (categories) {
            try {
                categoryIds = typeof categories === "string" ? JSON.parse(categories) : categories
            } catch {
                errors.push({ field: "category", message: "Categories must be valid JSON" })
            }
        }

        if (!Array.isArray(categoryIds) || categoryIds.length === 0) {
            errors.push({ field: "category", message: "At least one category is required" })
        }

        const thumbnailFile = req.files?.thumbnailImage?.[0]
        const galleryFiles = req.files?.galleryImages || []

        if (!thumbnailFile) {
            errors.push({ field: "thumbnailImage", message: "Thumbnail image is required" })
        }
        if (galleryFiles.length === 0) {
            errors.push({ field: "galleryImages", message: "At least one gallery image is required" })
        }

        let parsedVariants = []
        if (variants) {
            try {
                parsedVariants = typeof variants === "string" ? JSON.parse(variants) : variants
            } catch (err) {
                errors.push({ field: "variants", message: "Variants must be valid JSON" })
            }
        }

        if (!Array.isArray(parsedVariants) || parsedVariants.length === 0) {
            errors.push({ field: "variants", message: "At least one variant (size/quantity) is required" })
        } else {
            parsedVariants.forEach((v, i) => {
                if (!v.size?.toString().trim()) {
                    errors.push({ field: `variants[${i}].size`, message: "Size is required" })
                }
                if (v.quantity === undefined || isNaN(v.quantity) || Number(v.quantity) < 0) {
                    errors.push({ field: `variants[${i}].quantity`, message: "Valid quantity is required" })
                }
            })
        }

        if (errors.length > 0) {
            return errorResponse(res, 400, "Validation failed", errors)
        }

        const existingCategories = await categoryModel.find({ _id: { $in: categoryIds } })
        if (existingCategories.length !== categoryIds.length) {
            return errorResponse(res, 400, "One or more categories are invalid")
        }

        const thumbnailUpload = await uploadToCloudinary(thumbnailFile.buffer, 'products/thumbnails')

        const galleryUploads = await Promise.all(
            galleryFiles.map(file => uploadToCloudinary(file.buffer, 'products/gallery'))
        )

        const product = await productModel.create({
            name: name.trim(),
            description: description.trim(),
            price: Number(price),
            thumbnailImage: thumbnailUpload.secure_url,
            galleryImages: galleryUploads.map(img => img.secure_url),
            category: categoryIds,
            variants: parsedVariants.map(v => ({
                size: v.size.toString().trim(),
                quantity: Number(v.quantity)
            }))
        })

        return successResponse(res, 201, "Product created successfully", product)

    } catch (error) {
        console.log(error)
        return errorResponse(res, 500, "Internal Server Error")
    }
}

export const deleteProduct = async (req, res) => {
    try {
        const { productId } = req.body

        if (!productId?.trim()) {
            return errorResponse(res, 400, "Product ID is required")
        }

        const product = await productModel.findById(productId)

        if (!product) {
            return errorResponse(res, 404, "Product not found")
        }


        await productModel.findByIdAndDelete(productId)

        return successResponse(res, 200, "Product deleted successfully")

    } catch (error) {
        console.log(error)

        return errorResponse(res, 500, "Internal Server Error")
    }
}

export const updateProduct = async (req, res) => {
    //TODO
}


export const fetchAllProducts = async (req, res) => {
    try {
        const products = await productModel.find();
        if (!products) {
            return errorResponse(res, 500, "Unable to fetch all products")
        }
        return successResponse(res, 200, "Successfully fetched all the products", products)
    } catch (error) {
        console.log(error)
        return errorResponse(res, 500, "Internal Server Error")
    }
}

export const fetchProductById = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await productModel.findOne({ _id: id });

        if (!product) {
            return errorResponse(res, 500, "Unable to fetched product")
        }
        return successResponse(res, 200, "Successfully fetched product", product)
    } catch (error) {
        console.log(error)
        return errorResponse(res, 500, "Internal Server Error")
    }
}