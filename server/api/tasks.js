"use strict";
const User = require("../models/user");
const passportJWT = require("passport-jwt");
const Task = require("../models/task");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

const router = require("express").Router();

module.exports = function (passport) {

    passport.use(new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET
    }, (jwtPayload, cb) => {
        User.getById(jwtPayload.id)
            .then(user => {
                return cb(null, user);
            })
            .catch(err => {
                return cb(err);
            });
    }));

    router.use(passport.authenticate("jwt", { session: false }));

    router.use("/", (req, res, next) => {
        req.user
            ? next()
            : res.sendStatus(401);
    });

    router.post("/create", (req, res) => {

        Task.create(req.body)
            .then(() => res.sendStatus(200))
            .catch(err => res.status(500).json(err));

    });

    router.get("/my", (req, res) => {

        Task.getAllByExecutorId(req.user._id)
            .then((tasks) => res.json(tasks))
            .catch(err => res.status(500).json(err));

    });


    return router;
};

