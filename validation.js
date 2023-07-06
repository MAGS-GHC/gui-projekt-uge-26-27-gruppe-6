const Joi = require("joi");
const jwt = require("jsonwebtoken");

const registerValidation = (data) => {
  const schema = new Joi.object({
    name: Joi.string().min(2).max(255).required(),
    email: Joi.string().min(6).max(255).required(),
    password: Joi.string().min(6).max(255).required(),
  });
  return schema.validate(data);
};

const loginValidation = (data) => {
  const schema = new Joi.object({
    email: Joi.string().min(6).max(255).required(),
    password: Joi.string().min(6).max(255).required(),
  });
  return schema.validate(data);
};
const verifyToken = (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    res.status(401).json({ error: "acces denied" });

    try {
      const verified = jwt.verify(token, process.env.TOKEN_SECRET);
      req.user = verified;
      next();
    } catch {
      res.statut(400).json({ error: "Token worknt" });
    }
  }
};

module.exports = { registerValidation, loginValidation, verifyToken };
