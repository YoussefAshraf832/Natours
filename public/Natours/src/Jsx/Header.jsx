import { IoSearchOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { useLogin } from './useLogin';
import { URL_IMAGE } from '../config';

function Header() {
  const navigate = useNavigate();
  const { login, removeCookie } = useLogin();

  function handleLogout() {
    removeCookie('jwt');
    navigate(`/login`);
  }
  function handleLogin() {
    navigate(`/login`);
  }

  function handleAccountSetting() {
    navigate(`/me`);
  }

  return (
    <header className="header">
      <nav className="nav nav--tours">
        <button className="nav__el" onClick={() => navigate(`/`)}>
          All tours
        </button>
        <form className="nav__search">
          <button className="nav__search-btn">
            <svg>
              <IoSearchOutline />
            </svg>
          </button>
          <input
            type="text"
            placeholder="Search tours"
            className="nav__search-input"
          />
        </form>
      </nav>
      <div className="header__logo">
        <img src={`${URL_IMAGE}img/logo-white.png`} alt="Natours logo" />
      </div>
      <nav className="nav nav--user">
        {login && (
          <>
            <button className="nav__el" onClick={handleLogout}>
              log out
            </button>
            <a onClick={handleAccountSetting} className="nav__el">
              <img
                src={
                  `${URL_IMAGE}img/users/${login?.user?.photo}` ||
                  `${login?.user?.photo}`
                }
                alt="User photo"
                className="nav__user-img"
              />
              <span>{login?.user?.name.split(' ')[0]}</span>
            </a>
          </>
        )}
        {!login && (
          <>
            <button onClick={handleLogin} className="nav__el">
              Log in
            </button>
            <button className="nav__el nav__el--cta">Sign up</button>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;
