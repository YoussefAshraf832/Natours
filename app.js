const path = require('path');
//
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');

const AppError = require('./utils/appErrors');
const errorHandler = require('./controller/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
// const bookingRouter = require('./routes/bookingRoutes');

const app = express();
/////////////////////////////////////////////////////
// app.set('view engine', 'pug');
app.use(cors());
app.options('*', cors());
// app.set('views', path.join(__dirname, 'public/Natours'));

app.use('/img', express.static(path.join(__dirname, 'public', 'img')));
app.use(express.static(path.join(__dirname, 'public/Natours')));
//
app.use(helmet());

if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

app.use(express.json({ limit: '10kb' }));

app.use(mongoSanitize());
app.use(xss());
app.use(
  hpp({
    whitelist: [
      'ratingsAverage',
      'ratingsQuantity',
      'duration',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  }),
);

const limiter = rateLimit({
  max: 1000,
  windowMs: 24 * 60 * 60 * 1000,
  message: 'Too many requests from this IP, Please try again ',
});
app.use('/api', limiter);

app.use((req, res, next) => {
  req.requestedTime = new Date().toISOString();
  next();
});

//

// app.get('/', (req, res) => {
//   res.status(200).render('index');
// });
// app.get('*', (req, res, next) => {
//   console.log(req.originalUrl);
//   if (req.originalUrl.startsWith('/api')) {
//     return next(); // سيب الـ request يكمل للـ API
//   }

//   res.sendFile(path.join(__dirname, 'public/Natours', 'index.html'));
// });

app.use(express.static(path.join(__dirname, 'public/Natours/dist')));

// أي route غير معروف يروح لـ index.html علشان React يتعامل معاه
app.get('*', (req, res, next) => {
  if (req.originalUrl.startsWith('/api')) return next(); // سيب الـ API يشتغل
  res.sendFile(path.join(__dirname, 'public/Natours/dist', 'index.html'));
});
/////////////////////////////////////////////////////

app.use('/api/v1/tours', tourRouter);

app.use('/api/v1/users', userRouter);

app.use('/api/v1/reviews', reviewRouter);

// app.use('/api/v1/booking', bookingRouter);

app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `Can't find ${req.originalUrl}`,
  // });

  // const err = new Error(`Can't find ${req.originalUrl}`);
  // err.statusCode = 404;
  // err.status = 'fail';

  next(new AppError(`Can't find ${req.originalUrl}`, 404));
});

app.use(errorHandler);

//////////////////////////////////////////////////////
module.exports = app;
