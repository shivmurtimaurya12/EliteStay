const User = require("../models/user.js")

module.exports.renderSignupForm=(req, res) => {
    res.render("./users/signup.ejs");
}

module.exports.signup=async (req, res) => {
        try {
            const { username, email, password } = req.body;
            const newUser = new User({ username, email });
            const registerdUser = await User.register(newUser, password);
            req.login(registerdUser, (err) => {
                if (err) {
                    return next(err);
                }
                req.flash("success", "Welcome to EliteStay!");
                res.redirect("/listings");
            });

        } catch (e) {
            req.flash("error", e.message);
            res.redirect("/signup");
        }
    }

    module.exports.renderLoginForm=(req, res) => {
    res.render("./users/login.ejs");
}

module.exports.login=async (req, res) => {
        req.flash("success", "Welcom back to Elitestay!");
        const redirectUrl = res.locals.redirectUrl || "/listings";
        res.redirect(redirectUrl);
    }

 module.exports.logout= (req, res) => {
    req.logout((error) => {
        if (error) {
            return next(error);
        }
        req.flash("success", "logged you out!");
        res.redirect("/listings");
    });

}   