import { errorResponse } from "../utility/apiResponse";

export const roleMiddleware = (...roles) => {
  
  return (req, res, next) => {
    const userRole = req.role;

    if (!roles.includes(userRole)) {
      return errorResponse(res, 403, { message: "Access Denied" })
    }

    next();
  };
};
