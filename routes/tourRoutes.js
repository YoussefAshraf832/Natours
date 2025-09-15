const express = require('express');
const {
  getAllTour,
  createNewTour,
  getTour,
  updateTour,
  deleteTour,
  aliasTopTours,
  getTourStats,
  getMonthlyPlan,
  getToursWithin,
  getAllDistances,
  uploadTourImages,
  resizeTourImages,
} = require('../controller/tourController');

const { protect, restrictTo } = require('../controller/authController');

const reviewRouter = require('./reviewRoutes');

// const { createReview } = require('../controller/reviewController');

const router = express.Router();

// router.param('id', checkId);

router.use('/:tourId/reviews', reviewRouter);

router
  .route('/')
  .get(getAllTour)
  .post(protect, restrictTo('admin', 'lead-guide'), createNewTour);

router.route('/top-5-cheap').get(aliasTopTours, getAllTour);
router.route('/tour-stats').get(getTourStats);
router
  .route('/monthly-plan/:year')
  .get(protect, restrictTo('admin', 'lead-guide', 'guide'), getMonthlyPlan);

router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(getToursWithin);

router.route('/distances/:latlng/unit/:unit').get(getAllDistances);

router
  .route('/:id')
  .get(getTour)
  .patch(
    protect,
    restrictTo('admin', 'lead-guide'),
    uploadTourImages,
    resizeTourImages,
    updateTour,
  )
  .delete(protect, restrictTo('admin', 'lead-guide'), deleteTour);

// router
//   .route('/:tourId/reviews')
//   .post(protect, restrictTo('user'), createReview);

module.exports = router;
