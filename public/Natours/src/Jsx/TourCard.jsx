import { CiLocationOn } from 'react-icons/ci';
import {
  IoPersonOutline,
  IoFlagOutline,
  IoCalendarClearOutline,
} from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { URL_IMAGE } from '../config';

function TourCard({ tour }) {
  const navigate = useNavigate();

  function tourDetails(id) {
    navigate(`/tour/${id}`);
  }
  return (
    <div className="card">
      <div className="card__header">
        <div className="card__picture">
          <div className="card__picture-overlay">&nbsp;</div>
          <img
            src={`${URL_IMAGE}img/tours/${tour?.imageCover}`}
            alt="Tour 1"
            className="card__picture-img"
          />
        </div>

        <h3 className="heading-tertirary">
          <span>{tour?.name}</span>
        </h3>
      </div>

      <div className="card__details">
        <h4 className="card__sub-heading">{`${tour?.difficulty.charAt(0).toUpperCase() + tour?.difficulty.slice(1)} ${
          tour?.duration
        }-day tour`}</h4>
        <p className="card__text">{tour?.summary}</p>
        <div className="card__data">
          <svg className="card__icon">
            <CiLocationOn />
          </svg>
          <span>{tour?.startLocation.description}</span>
        </div>
        <div className="card__data">
          <svg className="card__icon">
            <IoCalendarClearOutline />
          </svg>
          <span>{tour?.startDates[0].slice(0, 7)}</span>
        </div>
        <div className="card__data">
          <svg className="card__icon">
            <IoFlagOutline />
          </svg>
          <span>{tour?.locations.length} stops</span>
        </div>
        <div className="card__data">
          <svg className="card__icon">
            <IoPersonOutline />
          </svg>
          <span>{tour?.maxGroupSize} people</span>
        </div>
      </div>

      <div className="card__footer">
        <p>
          <span className="card__footer-value">${tour?.price}</span>
          <span className="card__footer-text"> per person</span>
        </p>
        <p className="card__ratings">
          <span className="card__footer-value">{tour?.ratingsAverage} </span>
          <span className="card__footer-text">
            rating {`(${tour?.ratingsQuantity})`}
          </span>
        </p>
        <button
          className="btn btn--green btn--small"
          onClick={() => tourDetails(tour._id)}
        >
          Details
        </button>
      </div>
    </div>
  );
}

export default TourCard;
