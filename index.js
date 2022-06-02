"use strict";
exports.__esModule = true;
var db_1 = require("./db");
var nanoid_1 = require("nanoid");
var cors = require("cors");
//import {v4  as uuidv4} from "uuid"
var express = require("express");
var port = process.env.PORT || 3000;
var app = express();
app.use(express.static("dist"));
app.use(express.json());
app.use(cors());
var userCollection = db_1.firestore.collection("users");
var roomCollection = db_1.firestore.collection("rooms");
app.post("/rooms", function (req, res) {
    var userId = req.body.userId;
    userCollection.doc(userId).get().then(function (doc) {
        if (doc.exists) {
            var roomRef_1 = db_1.rtdb.ref("rooms/" + (0, nanoid_1.nanoid)());
            roomRef_1.set({
                messages: [],
                owner: userId
            }).then(function () {
                var roomLongId = roomRef_1.key;
                var roomId = 1000 + Math.floor(Math.random() * 999);
                roomCollection.doc(roomId.toString()).set({
                    rtdbRoomId: roomLongId
                }).then(function () {
                    res.json({
                        id: roomId.toString()
                    });
                });
            });
        }
        else {
            res.status(401).json({
                messages: "You don't exist"
            });
        }
    });
});
app.get("/rooms/:roomId", function (req, res) {
    var userId = req.query.userId;
    var roomId = req.params.roomId;
    userCollection.doc(userId).get().then(function (doc) {
        if (doc.exists) {
            roomCollection.doc(roomId).get()
                .then(function (snap) {
                var data = snap.data();
                res.json(data);
            });
        }
        else {
            res.status(401).json({
                messages: "You don't exist"
            });
        }
    });
});
app.post("/signup", function (req, res) {
    var email = req.body.email;
    var name = req.body.name;
    userCollection
        .where("email", "==", email)
        .get()
        .then(function (searchResponse) {
        if (searchResponse.empty) {
            userCollection.add({
                email: email,
                name: name
            }).then((function (newUserRef) {
                res.json({
                    id: newUserRef.id,
                    "new": true
                });
            }));
        }
        else {
            res.status(404).json({
                message: "User already exists"
            });
        }
    });
});
app.post("/auth", function (req, res) {
    var email = req.body.email;
    userCollection
        .where("email", "==", email)
        .get()
        .then(function (searchResponse) {
        if (searchResponse.empty) {
            res.status(404).json({
                message: "Not found"
            });
        }
        else {
            res.json({
                id: searchResponse.docs[0].id
            });
        }
    });
});
app.post("/messages", function (req, res) {
    var roomId = req.body.roomId;
    var message = req.body.message;
    var fullName = req.body.fullName;
    roomCollection.doc(roomId).get()
        .then(function (snap) {
        var rtdbId = snap.data();
        console.log(rtdbId.rtdbRoomId);
        var chatroomRef = db_1.rtdb.ref("/rooms/" + rtdbId.rtdbRoomId + "/messages");
        console.log(req.body);
        chatroomRef.push({
            message: message,
            fullName: fullName
        }, function () { return res.json("todo ok"); });
    });
});
app.get("*", function (req, res) {
    res.sendFile(__dirname + "/dist/index.html");
});
//app.user(express.static('dist'))
app.listen(port, function () {
    console.log("Example app listening on port ".concat(port));
});
