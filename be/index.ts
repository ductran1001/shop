import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
// import connectDatabase from '';
import routes from './routes';

//JWT
import path from 'path';
import passport from 'passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtSettings } from './config/constant';
import connectDatabase from './config/db';

// jwt
// Passport: jwt
const opts: any = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = jwtSettings.SECRET;
opts.audience = jwtSettings.AUDIENCE;
opts.issuer = jwtSettings.ISSUER;

passport.use(
    new Strategy(opts, function (payload, done) {
        // console.log('payload', payload);
        let error = null;
        let user = true;
        return done(error, user);
    })
);

// Middleware
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(morgan('dev'));
app.use(cookieParser());

// to serve images inside public folder
// console.log(path.join(__dirname, 'public'));
// console.log(path.join(process.cwd(), 'public'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'dist/public')));
// Routes
app.use('/api/auth', routes.authRouter);
app.use('/api/user', passport.authenticate('jwt', { session: false }), routes.userRouter);
app.use('/api', routes.categoryRouter);
app.use('/api/slider', routes.sliderRouter);
app.use('/api', routes.productRouter);
app.use('/api/color', routes.colorRouter);
app.use('/api/brand', routes.brandRouter);
app.use('/api/order', routes.orderRouter);
app.use('/api/upload', passport.authenticate('jwt', { session: false }), routes.uploadRouter);
app.use('/api/upload-cloud', passport.authenticate('jwt', { session: false }), routes.uploadCloud);

// Database
connectDatabase();

//server listening
const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
    console.log('Server is running on port', PORT);
});
