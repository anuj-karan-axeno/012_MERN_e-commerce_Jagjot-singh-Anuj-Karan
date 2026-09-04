import { userModel } from "../../models/user.schema.js"
import { errorResponse, successResponse } from '../../utility/apiResponse.js'
import { generateToken } from "../../utility/auth.js"
import { isValidEmail, isValidPhoneNumber, isValidZip } from "../../utility/validation.js"
import bcrypt from 'bcrypt'


export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body
        const errors = []

        if (!email?.trim()) {
            errors.push({ field: "email", message: "Email is required" })
        } else if (!isValidEmail(email)) {
            errors.push({ field: "email", message: "Please enter a valid email address" })
        }

        if (!password?.trim()) {
            errors.push({ field: "password", message: "Password is required" })
        } else if (password.length < 6 || password.length > 12) {
            errors.push({ field: "password", message: "Password length should be min 6 and max 12" })
        }

        if (errors.length > 0) {
            return errorResponse(res, 401, "Validation failed", errors)
        }

        const user = await userModel.findOne({ email });
        if (!user) {
            return errorResponse(res, 404, "No account found with this email");
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return errorResponse(res, 401, "Incorrect password, please try again");
        }

        const token = generateToken({ _id: user._id.toString(), role: user.role });
        res.cookie("accessToken", token, { maxAge: 7 * 24 * 60 * 60 * 1000, sameSite: 'none' })
        const data = {

            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        }

        return successResponse(res, 200, "Successfully logged in", { ...data })

    } catch (error) {
        console.log(error)
        return errorResponse(res, 500, "Internal Server Error");
    }
}

export const registerUser = async (req, res) => {


    try {
        const { email, password, name, phone, address } = req.body
        const errors = []

        if (!name?.trim()) {
            errors.push({ field: "name", message: "Name is required" })
        }

        if (!email?.trim()) {
            errors.push({ field: "email", message: "Email is required" })
        } else if (!isValidEmail(email)) {
            errors.push({ field: "email", message: "Please enter a valid email address" })
        }

        if (!password?.trim()) {
            errors.push({ field: "password", message: "Password is required" })
        } else if (password.length < 6 || password.length > 12) {
            errors.push({ field: "password", message: "Password length should be min 6 and max 12" })
        }

        if (!phone?.toString().trim()) {
            errors.push({ field: "phone", message: "Phone number is required" })

        } else if (!isValidPhoneNumber(phone.toString().trim())) {
            errors.push({ field: "phone", message: "Please enter a valid phone number" })
        }

        if (!address || typeof address !== 'object') {
            errors.push({ field: "address", message: "Address is required" })
        } else {
            const { street, city, state, country, zip } = address

            if (!street?.trim()) {
                errors.push({ field: "address.street", message: "Street is required" })
            }
            if (!city?.trim()) {
                errors.push({ field: "address.city", message: "City is required" })
            }
            if (!state?.trim()) {
                errors.push({ field: "address.state", message: "State is required" })
            }
            if (!country?.trim()) {
                errors.push({ field: "address.country", message: "Country is required" })
            }

            if (!zip?.trim()) {
                errors.push({ field: "address.zip", message: "Zip code is required" })
            } else if (!isValidZip.test(zip.trim())) {
                errors.push({ field: "address.zip", message: "Please enter a valid zip code" })
            }
        }

        if (errors.length > 0) {
            return errorResponse(res, 401, "Validation failed", errors)
        }

        const existingUser = await userModel.findOne({ email })

        if (existingUser) {

            return errorResponse(res, 400, "User with these credentials already exists");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await userModel.create({
            email,
            password: hashedPassword,
            name,
            phone: phone.toString().trim(),
            address: {
                street: address.street.trim(),
                area: address.area.trim(),
                state: address.state.trim(),
                country: address.country.trim(),
                zip: address.zip.trim()
            }
        })

        return successResponse(res, 201, "Account created successfully");

    } catch (error) {
        console.log(error)
        return errorResponse(res, 500, "Internal Server Error");
    }
}