"use strict";
const User = require("../models/user");
const Storage = require("../models/storage");
const LocalStrategy = require("passport-local").Strategy;
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

module.exports = function (passport) {

    passport.use("local", new LocalStrategy({ usernameField: "login", passwordField: "password" },
        async (login, password, done) => {
            try {
                const user = await User.getByLogin(login);
                if (!user) return done(null, false, { message: "Incorrect login." });

                const res = await User.validatePassword(login, password);
                if (!res) return done(null, false, { message: "Incorrect password." });

                return done(null, user);

            } catch (err) {
                return done(err);
            }
        }
    ));

    const createPatrialUser = (user) => {
        return {
            id: user._id, 
            login: user.login, 
            username: user.username,
            photoUrl: user.photoUrl
        };
    };

    router.get("/register", (req, res) => {
        res.render("register", { user: req.user });
    });

    router.post("/register", async (req, res) => {
        const { login, password, username } = req.body;
        const user = await User.getByLogin(login);

        if(!user) 
            User.create({ login, password, username })
                .then(user => {
                    Storage.create({userId: user._id});

                    const partialUser = createPatrialUser(user);
                    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "14d" });

                    res.json({ partialUser, token });
                })
                .catch(err => res.status(500).send(err.toString()));
        else
            res.status(400).send("Login already registred");
    });

    router.get("/login", (req, res) => {
        res.render("login", { user: req.user });
    });

    router.post("/login", (req, res, next) => {
        // console.log(req.body);

        passport.authenticate("local", (err, user, info) => {

            if (err || !user) {
                return res.status(400).json({
                    message: `${JSON.stringify(info)}`,
                    user: user
                });
            }

            req.login(user, (err) => {
                if (err) return res.send(err);
                const partialUser = createPatrialUser(user);
                const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "14d" });
                return res.json({ 
                    partialUser, 
                    token 
                });
            });

        })(req, res, next);
    });

    router.get("/logout", (req, res) => {
        req.logout();
        res.sendStatus(200);
    });

    return router;
};