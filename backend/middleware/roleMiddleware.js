export const isCustomer = (req, res, next) => {
  if (req.user.role !== "customer") {
    return res.status(403).json({ message: "Customer access only" });
  }
  next();
};

export const isTasker = (req, res, next) => {
  if (req.user.role !== "tasker") {
    return res.status(403).json({ message: "Tasker access only" });
  }
  next();
};