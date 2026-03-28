console.log("om nama shivaya");
require('dotenv').config();
let http = require('http');
let express = require('express');
let mongoose = require('mongoose');
let bodyParser = require('body-parser');
let app = express();
let bp = bodyParser.json();
var nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const SALT_ROUNDS = 10;

// MongoDB connection: prefer env, then local, then optional Atlas fallback
const localUri = 'mongodb://localhost:27017/karunadu';
const atlasUri = process.env.MONGO_ATLAS_URI || 'mongodb+srv://<user>:<password>@<cluster>/<db>?retryWrites=true&w=majority';
const mongoUri = process.env.MONGO_URI || localUri;

function connectToMongo(uri) {
    mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => {
        console.log(`âœ… MongoDB Connected Successfully! ${uri}`);
    }).catch((err) => {
        console.log(`âŒ MongoDB Connection Failed (${uri}):`, err);
        if (uri === localUri && atlasUri && !atlasUri.includes('<')) {
            console.log('âš¡ Attempting Atlas fallback...');
            connectToMongo(atlasUri);
        } else {
            console.log('ðŸš¨ Both local and Atlas connections failed.');
        }
    });
}

connectToMongo(mongoUri);

// package document
let packageschema = new mongoose.Schema({
    "name": String,
    "type": String,
    "cost": Number,
    "duration": String,
    "depaturedate": Date,
    "depatureaddress": String,
    "icon": String,
    "slides": [String],
    "itinerary": [String],
    "description": String,
    "visitingplaces": [String]
});

// booked package document, which is the subdocument of user document
let bookingschema = new mongoose.Schema({
    "packageId": String,
    "packagename": String,
    "packageicon": String,
    "depaturedate": Date,
    "enddate": Date,
    "depatureaddress": String,
    "duration": String,
    "dobooking": Date,
    "adults": Number,
    "children": Number,
    "totalcost": Number,
    "payment": { "cardno": Number, "cardname": String, "dateofexpire": Date, "cvc": String }
});

// user document
let userschema = new mongoose.Schema({
    "accountname": String,
    "email": String,
    "password": String,
    "phone": Number,
    "dob": Date,
    "address": { "street": String, "city": String, "district": String },
    "bookedpackages": [bookingschema]
});

userschema.index({ "email": 1 }, { unique: true }); // making the email field as index in schema level

let packagesModel = new mongoose.model("packages", packageschema);
let usersModel = new mongoose.model("users", userschema);
let bookingmodel = new mongoose.model("booking", bookingschema);

// Seed a test user for immediate login validation
usersModel.findOne({ email: 'testuser@example.com' }).then(async (existing) => {
    if (!existing) {
        const hashed = await bcrypt.hash('Password123', SALT_ROUNDS);
        new usersModel({
            email: 'testuser@example.com',
            password: hashed,
            accountname: 'Test User',
            phone: 9999999999,
            address: { street: 'Demo', city: 'Demo', district: 'Demo' }
        }).save().then(() => {
            console.log('âœ… Seed user created: testuser@example.com / Password123');
        }).catch((err) => {
            console.log('âŒ Seed user create failed:', err);
        });
    } else {
        console.log('âœ… Seed user already exists');
    }
}).catch((err) => {
    console.log('âŒ Seed user check failed:', err);
});

// âœ… FIXED: Better CORS configuration
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

app.listen(3000, function() {
    console.log("âœ… Server running @ http://localhost:3000");
});

// âœ… IMPORTANT: Update these with your real Gmail and App Password
// To get Gmail App Password:
// 1. Enable 2-Step Verification on your Google account
// 2. Go to Google Account â†’ Security â†’ App Passwords
// 3. Generate a password and paste it below
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'your-email@gmail.com',   // âœ… PUT YOUR GMAIL HERE
        pass: 'your-app-password'        // âœ… PUT YOUR GMAIL APP PASSWORD HERE
    }
});

// this routing is used for signin purpose
app.post("/signin", bp, async function (req, res) {
    console.log("signin called");
    console.log(req.body);

    const email = (req.body.email || "").toLowerCase().trim();
    const pw = req.body.password || "";

    if (!email || !pw) {
        return res.status(400).send({ message: "missingCredentials" });
    }

    try {
        const user = await usersModel.findOne({ email: email });
        if (!user) {
            return res.status(404).send({ message: "invalidemail" });
        }

        const stored = user.password || "";
        let isValid = false;

        if (stored.startsWith("$2")) {
            isValid = await bcrypt.compare(pw, stored);
        } else {
            isValid = stored === pw;
            if (isValid) {
                // upgrade legacy plain-text password to hash
                user.password = await bcrypt.hash(pw, SALT_ROUNDS);
                await user.save();
            }
        }

        if (!isValid) {
            return res.status(401).send({ message: "invalidPassword" });
        }

        return res.send({ message: user.email });
    } catch (err) {
        console.error("signin db error", err);
        return res.status(500).send({ message: "serverError" });
    }
});

// this routing is used for retrieving all packages present in database
app.get("/packages", function (req, res) {
    packagesModel.find({}, null, { sort: 'depaturedate' }, function (err, data) {
        res.json(data);
    });
});

// this routing is used for querying packages based on type field
app.post("/fetchBySearch", bp, function (req, res) {
    console.log(req.body.searchdata);
    packagesModel.find({ "type": req.body.searchdata }, function (err, data) {
        console.log("search request");
        res.json(data);
    });
});

// this routing is used for querying the package document based on the _id field
app.post("/fetchById", bp, function (req, res) {
    console.log("fetch by id called");
    console.log(req.body.packageId);
    packagesModel.find({ "_id": req.body.packageId }, function (err, data) {
        res.json(data);
    });
});

// this routing is not used
app.get("/logout", function (req, res) {
    console.log("destroyed successfully");
});

// this routing is used for signup
app.post("/newuser", bp, function (req, res) {
    const email = (req.body.email || "").toLowerCase().trim();
    const pw = req.body.password;

    if (!email || !pw) {
        return res.status(400).send({ message: "missingCredentials" });
    }

    usersModel.findOne({ email: email }, function (err, existing) {
        if (err) {
            console.error("newuser db error", err);
            return res.status(500).send({ message: "serverError" });
        }

        if (existing) {
            return res.status(409).send({ message: "emailExists" });
        }

        // send welcome email (optional)
        var mailOptions = {
            from: 'your-email@gmail.com',  // âœ… PUT YOUR GMAIL HERE TOO
            to: email,
            subject: 'karunadu tourism',
            text: 'Thank you for registering with karunadu!'
        };

        transporter.sendMail(mailOptions, async function (error, info) {
            // we don't block signup for email failure in this flow; still create user.
            if (error) {
                console.warn('Email send failed', error);
            } else {
                console.log('Email sent: ' + info.response);
            }

            const hashedPw = await bcrypt.hash(pw, SALT_ROUNDS);
            const newUser = new usersModel({
                email: email,
                password: hashedPw,
                accountname: req.body.accountname || "",
                phone: req.body.phone || null,
                dob: req.body.dob || null,
                address: req.body.address || { street: "", city: "", district: "" }
            });

            newUser.save(function (saveErr, savedUser) {
                if (saveErr) {
                    console.error("newuser save error", saveErr);
                    if (saveErr.code === 11000) {
                        return res.status(409).send({ message: "emailExists" });
                    }
                    return res.status(500).send({ message: "serverError" });
                }
                return res.send({ message: "valid" });
            });
        });
    });
});

// this routing is used for querying profile details of the user
app.post("/profile", bp, function (req, res) {
    usersModel.find({ "email": req.body.email }, function (err, data) {
        res.json(data);
        console.log(data);
    });
});

// this routing is used for updating the profile details of the user
app.post("/profileUpdate", bp, function (req, res) {
    console.log(req.body);
    usersModel.findOneAndUpdate({ "email": req.body.email }, {
        $set: {
            "accountname": req.body.accountname,
            "dob": req.body.dob,
            "phone": req.body.phone,
            "address.street": req.body.address.street,
            "address.city": req.body.address.city,
            "address.district": req.body.address.district
        }
    }, { new: true }, function (err, data) {
        console.log(data);
        res.send({ "message": "ok" });
    });
});

// this routing is used for inserting the current booked package info
app.post("/booking", bp, function (req, res) {
    var dt = new bookingmodel(req.body.details);
    console.log(dt);
    usersModel.findOneAndUpdate({ "email": req.body.email }, { $push: { "bookedpackages": dt } }, function (err, data) {
        if (err) {
            console.error("booking save error", err);
            return res.status(500).send({ "message": "serverError" });
        }

        // send booking receipt (non-blocking)
        const details = req.body.details || {};
        const mailOptions = {
            from: 'your-email@gmail.com',
            to: req.body.email,
            subject: 'Karunadu booking confirmation',
            text: `Your booking is confirmed.\n\nPackage: ${details.packagename}\nDeparture: ${details.depaturedate}\nDuration: ${details.duration} days\nTotal: Rs ${details.totalcost}\n\nThank you for choosing Karunadu.`
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.warn('Receipt email failed', error);
            } else {
                console.log('Receipt email sent: ' + info.response);
            }
        });

        res.send({ "message": "ok" });
    });
});

// this function generates array of dates
var getDateArray = function (start, days) {
    var arr = new Array();
    var dt = new Date(start);
    while (days-- != 0) {
        arr.push(new Date(dt));
        dt.setDate(dt.getDate() + 1);
    }
    return arr;
};

// this routing checks for booking date clashes
app.post("/checkclash", bp, function (req, res) {
    var userselected = getDateArray(req.body.depaturedate, req.body.duration);
    console.log(userselected);
    usersModel.find({ "email": req.body.email }, function (err, data) {
        var sending = "ok";
        for (var i = 0; i < data.length; i++) {
            for (var j = 0; j < data[i].bookedpackages.length; j++) {
                var generated = getDateArray(data[i].bookedpackages[j].depaturedate, data[i].bookedpackages[j].duration);
                for (var k = 0; k < userselected.length; k++) {
                    for (var m = 0; m < generated.length; m++) {
                        if (generated[m].getDate() == userselected[k].getDate() &&
                            generated[m].getMonth() == userselected[k].getMonth() &&
                            generated[m].getFullYear() == userselected[k].getFullYear())
                            sending = "not ok";
                        else
                            continue;
                    }
                }
            }
        }
        res.send({ "message": sending });
    });
});

// this routing is used for querying user booked packages
app.post("/mybookedpackages", bp, function (req, res) {
    console.log("working");
    usersModel.find({ "email": req.body.email }, 'bookedpackages', function (err, data) {
        res.json(data);
        console.log(data);
    });
});

// this routing is used for cancel booked package
app.post("/cancelbooking", bp, function (req, res) {
    console.log(req.body);
    usersModel.findOneAndUpdate({ "email": req.body.email }, { $pull: { "bookedpackages": { "_id": req.body.id } } }, function (err, data) {
        res.send({ "message": "ok" });
    });
});

// this routing is used for resetting user password
app.post("/resetpswd", bp, async function (req, res) {
    console.log("it's working");
    const hashedPw = await bcrypt.hash(req.body.password || "", SALT_ROUNDS);
    usersModel.findOneAndUpdate({ "email": req.body.email }, { $set: { "password": hashedPw } },
        { new: true }, function (err, data) {
            console.log(data);
            res.send({ "message": "ok" });
        });
});

app.post("/contactus", bp, function (req, res) {
    console.log("ya working");
    var mailOptions = {
        from: 'your-email@gmail.com',  // âœ… PUT YOUR GMAIL HERE TOO
        to: req.body.email,
        subject: req.body.subject,
        text: req.body.name + "," + req.body.message
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            res.send({ "message": "not ok" });
        } else {
            res.send({ "message": "ok" });
            console.log('Email sent: ' + info.response);
        }
    });
});

