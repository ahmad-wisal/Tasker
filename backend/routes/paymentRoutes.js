import express from "express";
import protect from "../middleware/authMiddleware.js";
import { isCustomer } from "../middleware/roleMiddleware.js";
import { validateTaskPayment } from "../middleware/validateTaskPayment.js";
import { makePayment, createPaymentIntent } from "../controllers/paymentController.js";

const router = express.Router();

router.post(
  "/create-intent/:id",
  protect,
  isCustomer,
  validateTaskPayment,
  createPaymentIntent
);

router.post(
  "/:id",
  protect,
  isCustomer,
  validateTaskPayment,
  makePayment
);

export default router;