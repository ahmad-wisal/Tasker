import express from "express";
import { registerUser, loginUser, verifyUser } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", verifyUser);



router.get("/", (req, res) => {
    res.send("Auth route is working...");
});

export default router;
