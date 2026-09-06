import { errorResponse, successResponse } from "../../utility/apiResponse.js"
import { userModel } from '../../models/user.schema.js'

export const getUserInfo = async (req, res) => {
    try {
        const userID = req.user._id

        const user = await userModel.findById(userID).select("-password");

        if (!user) {
            return errorResponse(res, 400, "User account didn't find")
        }

        return successResponse(res, 200, "Successfully get the user details", user)
    } catch (error) {
        return errorResponse(res, 500, "Internal Server Error")
    }
}