import Joi from 'joi';

export const registerSchema = Joi.object({
    username: Joi.string().min(3).required(),
    password: Joi.string().min(5).required(),
    email: Joi.string().email().required(),
});

export const loginSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
});

export const contactSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    address: Joi.string().required(),
    timezone: Joi.string().required(),
});
