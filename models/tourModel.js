const mongoose = require('mongoose');
const slugify = require('slugify');

// const User = require('./userModel');
// const validator = require('validator');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour most have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'max length most be 40 chars'],
      minlength: [10, 'min length most be 10 chars'],
      // validate: [validator.isAlpha, 'Tour name most only contain chars'],
    },
    duration: { type: Number, required: [true, 'A tour most have a duration'] },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour most have a max group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour most have a difficulty'],
      trim: true,
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'difficulty most be easy, medium or difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating most be above 1.0'],
      max: [5, 'Rating most be below 5.0'],
      set: (val) => Math.round(val * 10) / 10,
    },
    ratingsQuantity: { type: Number, default: 0 },
    price: { type: Number, required: [true, 'A tour most have a price'] },
    priceDiscount: {
      type: Number,
      validate: {
        validator(val) {
          return val < this.price && !(val < 0);
        },
        message: `Discount should be below regular price`,
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour most have a summary'],
    },
    description: { type: String, trim: true },
    imageCover: {
      type: String,
      required: [true, 'A tour most have a cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    startDates: [Date],
    slug: String,
    secretTour: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      type: {
        type: String,
        default: 'Point',
        enum: {
          values: ['Point'],
          message: 'startLocation shoud be Point',
        },
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: {
            values: ['Point'],
            message: 'startLocation shoud be Point',
          },
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// tourSchema.index({ price: 1 });
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: '2dsphere' });
tourSchema.index({ price: 1, ratingsAverage: -1 });

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id',
});

tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// tourSchema.pre('save', async function (next) {
//   const guidesPromises = this.guides.map(async (id) => await User.findById(id));

//   this.guides = await Promise.all(guidesPromises);

//   next();
// });

// tourSchema.post('save', function (doc, next) {
//   console.log(doc);
//   next();
// });

//
tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select:
      '-__v -passwordResetExpires -passwordResetToken -passwordChangedAt -email',
  });
  next();
});

tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  // this.start = Date.now();
  next();
});

// tourSchema.post(/^find/, function (docs, next) {
//   console.log(`Time token: ${Date.now() - this.start} ms`);
//   console.log(docs);
//   next();
// });

//

tourSchema.pre('aggregate', function (next) {
  console.log(
    this.pipeline()
      .map((obj) => Object.keys(obj))[0]
      .includes('$geoNear'),
  );
  const geoNear = this.pipeline()
    .map((obj) => Object.keys(obj))[0]
    .includes('$geoNear');

  if (!geoNear) {
    this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
    next();
  }

  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
