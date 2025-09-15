import { URL_IMAGE } from '../config';

function Guides({ guide }) {
  return (
    <div className="overview-box__detail">
      <img
        src={`${URL_IMAGE}img/users/${guide.photo}`}
        alt={guide.role}
        className="overview-box__img"
      />
      <span className="overview-box__label">
        {guide.role === 'guide' ? 'Tour guide' : 'Lead guide'}
      </span>
      <span className="overview-box__text">{guide.name}</span>
    </div>
  );
}

export default Guides;
