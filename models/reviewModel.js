const mongoose = require('mongoose');

const Tour = require('./tourModel');

const reviewSchma = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review most be empty!'],
      trim: true,
      maxlength: [1000, 'max length most be 1000 chars'],
    },
    rating: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating most be above 1.0'],
      max: [5, 'Rating most be below 5.0'],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review most belong to a tour'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review most belong to a user'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

reviewSchma.index({ tour: 1, user: 1 }, { unique: true });

reviewSchma.pre(/^find/, function (next) {
  // this.populate({
  //   path: 'user',
  //   select: 'name photo',
  // }).populate({
  //   path: 'tour',
  //   select: 'name -guides',
  // });
  this.populate({
    path: 'user',
    select: 'name photo',
  });
  next();
});

reviewSchma.statics.calcAverageRatings = async function (tourId) {
  const stats = await this.aggregate([
    { $match: { tour: tourId } },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);

  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsAverage: stats[0].avgRating,
      ratingsQuantity: stats[0].nRating,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsAverage: 4.5,
      ratingsQuantity: 0,
    });
  }
};

reviewSchma.post('save', function () {
  this.constructor.calcAverageRatings(this.tour);
});

reviewSchma.pre(/^findOneAnd/, async function (next) {
  this.review = await this.findOne();
  next();
});

reviewSchma.post(/^findOneAnd/, async function () {
  await this.review.constructor.calcAverageRatings(this.review.tour);
});

const Review = mongoose.model('Review', reviewSchma);

module.exports = Review;
