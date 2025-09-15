import { BiSolidStar } from 'react-icons/bi';
import { FaRegStar } from 'react-icons/fa';
import { URL_IMAGE } from '../config';

function ReviewCard({ review }) {
  const rating = +review.rating;

  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="reviews__card">
      <div className="reviews__avatar">
        <img
          src={`${URL_IMAGE}img/users/${review.user.photo}`}
          alt={review.user.name}
          className="reviews__avatar-img"
        />
        <h6 className="reviews__user">{review.user.name}</h6>
      </div>
      <p className="reviews__text">{review.review}</p>
      <div className="reviews__rating">
        {stars.map((num) =>
          rating >= num ? (
            <svg className="reviews__star reviews__star--active">
              <BiSolidStar />
            </svg>
          ) : (
            <svg className="reviews__star reviews__star--inactive">
              <FaRegStar />
            </svg>
          ),
        )}
        {/* <svg className="reviews__star reviews__star--active">
          <use xlink:href="img/icons.svg#icon-star"></use>
        </svg>
        <svg className="reviews__star reviews__star--active">
          <use xlink:href="img/icons.svg#icon-star"></use>
        </svg>
        <svg className="reviews__star reviews__star--active">
          <use xlink:href="img/icons.svg#icon-star"></use>
        </svg>
        <svg className="reviews__star reviews__star--active">
          <use xlink:href="img/icons.svg#icon-star"></use>
        </svg>
        <svg className="reviews__star reviews__star--active">
          <use xlink:href="img/icons.svg#icon-star"></use>
        </svg> */}
      </div>
    </div>
  );
}

export default ReviewCard;
