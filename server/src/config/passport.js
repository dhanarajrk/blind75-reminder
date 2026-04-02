import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User.js";

const configurePassport = () => {
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: process.env.GOOGLE_CALLBACK_URL_PROD,
            },
            async (_accessToken, _refreshToken, profile, done) => {
                try {
                    const email = profile.emails?.[0]?.value;

                    if (!email) {
                        return done(new Error("No email found from Google"), null);
                    }

                    let user = await User.findOne({ email });

                    if (!user) {
                        user = await User.create({
                            name: profile.displayName,
                            email,
                            authProvider: "google",
                            avatar: profile.photos?.[0]?.value || "",
                            reminderEnabled: true,
                        });
                    } else if (!user.avatar && profile.photos?.[0]?.value) {
                        user.avatar = profile.photos[0].value;
                        await user.save();
                    }

                    return done(null, user);
                } catch (err) {
                    return done(err, null);
                }
            }
        )
    );
};

export default configurePassport;