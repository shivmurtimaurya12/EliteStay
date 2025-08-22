const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });



module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs", { allListings });

}

module.exports.renderNewForm = (req, res) => {
    res.render("./listings/new.ejs");
}

module.exports.showListing = async (req, res) => {
    const { id } = req.params;
    const listings = await Listing.findById(id)
        .populate({ path: "reviews", populate: { path: "author" } })
        .populate("owner");

    if (!listings) {
        req.flash("error", "Listing does not exist !");
        return res.redirect("/listings");
    }
    // console.log(req.user._id);
    // console.log(listings.owner._id);
    res.render("./listings/show.ejs", { listings });

}

module.exports.createListing = async (req, res) => {
    // let{title,description,image,price,location,country}=req.body;
    // console.log(req.body);
    // await new Listing(req.body).save();

    let location = req.body.listing.location;
    let country = req.body.listing.country;
    let joinedString = location.concat(",", country);

    let response = await geocodingClient.forwardGeocode({
        query: joinedString,
        limit: 1
    })
        .send()

    let url = req.file.path;
    let filename = req.file.filename;

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };

    newListing.geometry = response.body.features[0].geometry;
    let respo = await newListing.save();
    // console.log(respo);


    req.flash("success", "New Listing Created !");
    res.redirect("/listings");

}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const listings = await Listing.findById(id);
    if (!listings) {
        req.flash("error", "Listing does not exist !");
        return res.redirect("/listings");
    }

    let originalImageUrl = listings.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");

    res.render("./listings/edit.ejs", { listings, originalImageUrl });

}

module.exports.updateListing = async (req, res) => {
    // console.log(req.body);

    const { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if (req.file) {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();

    }



    req.flash("success", "Listing Updated Successfully !");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing = async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted Successfully !");
    res.redirect("/listings");
}

module.exports.destination = async (req, res) => {
    const { location } = req.body.listing;
    let allListings = await Listing.find({});
    res.render("./listings/destiListing.ejs", { allListings, location });

}