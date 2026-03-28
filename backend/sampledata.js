console.log("Adding sample data...");

var mongoose = require("mongoose");

var packageSchema = new mongoose.Schema({
    name: String,
    type: String,
    cost: Number,
    duration: Number,
    depaturedate: Date,
    depatureaddress: String,
    icon: String,
    slides: [String],
    itinerary: [String],
    description: String,
    visitingplaces: [String]
});

var Package = mongoose.model("packages", packageSchema);

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/karunadu");
    console.log("MongoDB connected successfully!");

    var packages = [
        {
            name: "Mysuru Palace Highlights",
            type: "district",
            cost: 3500,
            duration: 2,
            depaturedate: new Date(),
            depatureaddress: "Mysuru",
            icon: "img/mysorepalace.jpg",
            slides: ["img/mysorepalace.jpg", "img/palace.jpg"],
            itinerary: ["Palace visit", "Chamundi Hills", "Brindavan Gardens"],
            description: "Explore the majestic Mysuru Palace, Chamundi Hills and Brindavan Gardens.",
            visitingplaces: ["Mysuru Palace", "Chamundi Hills", "Brindavan Gardens"]
        },
        {
            name: "Hampi Heritage Tour",
            type: "historical",
            cost: 5500,
            duration: 3,
            depaturedate: new Date(),
            depatureaddress: "Hampi",
            icon: "img/ahampi/vijaya_vittala_temple.jpg",
            slides: ["img/ahampi/stone_chariot.jpg", "img/ahampi/hemakuta_temple.jpg"],
            itinerary: ["Stone Chariot", "Vijaya Vittala Temple", "Hemakuta Hill"],
            description: "Visit the UNESCO World Heritage site of Hampi with ancient temples.",
            visitingplaces: ["Stone Chariot", "Vijaya Vittala Temple", "Hemakuta Temple"]
        },
        {
            name: "Coorg Nature Escape",
            type: "nature",
            cost: 6200,
            duration: 3,
            depaturedate: new Date(),
            depatureaddress: "Madikeri",
            icon: "img/coorg.jpg",
            slides: ["img/amadikeri/abbey_falls.jpg", "img/amadikeri/bisle_ghat.jpg"],
            itinerary: ["Coffee estates", "Abbey Falls", "Golden Temple"],
            description: "Experience lush green coffee plantations and Abbey Falls in Coorg.",
            visitingplaces: ["Abbey Falls", "Bisle Ghat", "Golden Temple"]
        },
        {
            name: "Bandipur Wildlife Safari",
            type: "wildlife",
            cost: 7200,
            duration: 2,
            depaturedate: new Date(),
            depatureaddress: "Bandipur",
            icon: "img/tiger.png",
            slides: ["img/tiger.png", "img/kudremukh.jpg"],
            itinerary: ["Jeep safari", "Nature walk", "Forest lodge stay"],
            description: "Exciting wildlife safari at Bandipur National Park.",
            visitingplaces: ["Bandipur National Park"]
        },
        {
            name: "Dharmasthala Devotional Tour",
            type: "devotional",
            cost: 2800,
            duration: 2,
            depaturedate: new Date(),
            depatureaddress: "Dharmasthala",
            icon: "img/devotional.jpg",
            slides: ["img/devotional.jpg", "img/sringeri.jpg"],
            itinerary: ["Temple darshan", "Local heritage walk"],
            description: "Visit the famous Dharmasthala temple and sacred shrines.",
            visitingplaces: ["Dharmasthala Temple", "Manjunath Temple"]
        },
        {
            name: "Bengaluru Premium City Tour",
            type: "premium",
            cost: 9200,
            duration: 2,
            depaturedate: new Date(),
            depatureaddress: "Bengaluru",
            icon: "img/vidhana.jpg",
            slides: ["img/vidhana.jpg", "img/vidhansoudha.jpg"],
            itinerary: ["Lalbagh", "Cubbon Park", "Vidhana Soudha"],
            description: "Explore Lalbagh, Cubbon Park and Vidhana Soudha with premium transport.",
            visitingplaces: ["Lalbagh", "Cubbon Park", "Vidhana Soudha"]
        }
    ];

    await Package.deleteMany({});
    var docs = await Package.insertMany(packages);
    console.log("Sample packages added! Total:", docs.length, "packages");
    docs.forEach(function (p) {
        console.log(" -", p.name, "| Rs " + p.cost);
    });
    console.log("Done! Refresh your website.");
    await mongoose.connection.close();
}

main().catch(function (err) {
    console.log("Error:", err);
    process.exit(1);
});
