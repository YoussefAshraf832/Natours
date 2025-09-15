import { URL_IMAGE } from '../config';

function TourImages({ image, tour }) {
  const imgNumber = image.split('.')[0].slice(-1);

  return (
    <div className="picture-box">
      <img
        className={`picture-box__img picture-box__img--${imgNumber}`}
        src={`${URL_IMAGE}img/tours/${image}`}
        alt={`${tour.name} Tour ${imgNumber}`}
      />
    </div>
  );
}

export default TourImages;
