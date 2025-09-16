import { useNavigate } from 'react-router-dom';
import { useLogin } from './useLogin';
import { IoSettingsOutline } from 'react-icons/io5';
import { BsBriefcaseFill } from 'react-icons/bs';
import { FaRegStar, FaCreditCard, FaRegMap } from 'react-icons/fa';
import { LuUsers } from 'react-icons/lu';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { URL, URL_IMAGE } from '../config';

function Account() {
  const { login, cookies, setCookie, setLogin } = useLogin();
  const navigate = useNavigate();
  const [name, setName] = useState(login?.user?.name);
  const [photo, setPhoto] = useState(login?.user?.photo);
  const [email, setEmail] = useState(login?.user?.email);
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  useEffect(() => {
    setName(login?.user?.name);
    setEmail(login?.user?.email);
  }, [login]);

  if (!login) return navigate('/login');

  const handleSaveSetting = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('email', email);
    form.append('name', name);
    form.append('photo', photo);

    try {
      const res = await fetch(`${URL}users/updateMe`, {
        method: 'PATCH',
        headers: {
          // 'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${cookies?.jwt}`,
        },
        // body: JSON.stringify({
        //   email,
        //   name,
        // }),
        body: form,
      });

      const data = await res.json();
      if (data.status !== 'success') throw new Error(data.message);

      // setCookie('jwt', data.token, {
      //   path: '/',
      //   secure: true,
      //   sameSite: 'None',
      // });
      toast.success('Settings successfly updating.');
      setLogin(data.data);
    } catch (err) {
      console.log(err.message);
      toast.error(err.message);
    }
  };

  const handleSavePassword = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${URL}users/updateMyPassword`, {
        method: 'PATCH',
        headers: {
          'content-type': 'application/json',
          Authorization: `Bearer ${cookies?.jwt}`,
        },
        body: JSON.stringify({
          currentPassword: password,
          password: newPassword,
          passwordConfirm: confirmNewPassword,
        }),
      });

      const data = await res.json();
      if (data.status !== 'success') throw new Error(data.message);

      setCookie('jwt', data.token, {
        path: '/',
        secure: true,
        sameSite: 'None',
      });
      toast.success('Password successfly updating.');
      setLogin(data.data);

      setConfirmNewPassword('');
      setNewPassword('');
      setPassword('');
    } catch (err) {
      console.log(err.message);
      toast.error(err.message);
    }
  };

  return (
    <main className="main">
      <div className="user-view">
        <nav className="user-view__menu">
          <ul className="side-nav">
            <li className="side-nav--active">
              <a href="#">
                <svg>
                  <IoSettingsOutline />
                </svg>
                Settings
              </a>
            </li>
            <li>
              <a href="#">
                <svg>
                  <BsBriefcaseFill />
                </svg>
                My bookings
              </a>
            </li>
            <li>
              <a href="#">
                <svg>
                  <FaRegStar />
                </svg>
                My reviews
              </a>
            </li>
            <li>
              <a href="#">
                <svg>
                  <FaCreditCard />
                </svg>
                Billing
              </a>
            </li>
          </ul>

          {login?.user?.role === 'admin' && (
            <div className="admin-nav">
              <h5 className="admin-nav__heading">Admin</h5>
              <ul className="side-nav">
                <li>
                  <a href="#">
                    <svg>
                      <FaRegMap />
                    </svg>
                    Manage tours
                  </a>
                </li>
                <li>
                  <a href="#">
                    <svg>
                      <LuUsers />
                    </svg>
                    Manage users
                  </a>
                </li>
                <li>
                  <a href="#">
                    <svg>
                      <FaRegStar />
                    </svg>
                    Manage reviews
                  </a>
                </li>
                <li>
                  <a href="#">
                    <svg>
                      <BsBriefcaseFill />
                    </svg>
                    Manage bookings
                  </a>
                </li>
              </ul>
            </div>
          )}
        </nav>

        <div className="user-view__content">
          <div className="user-view__form-container">
            <h2 className="heading-secondary ma-bt-md">
              Your account settings
            </h2>
            <form className="form form-user-data">
              <div className="form__group">
                <label className="form__label" htmlFor="name">
                  Name
                </label>
                <input
                  id="name"
                  className="form__input"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="form__group ma-bt-md">
                <label className="form__label" htmlFor="email">
                  Email address
                </label>
                <input
                  id="email"
                  className="form__input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form__group form__photo-upload">
                <img
                  className="form__user-photo"
                  src={
                    photo && typeof photo != 'string'
                      ? window.URL.createObjectURL(photo)
                      : `${login?.user?.photo}`
                  }
                  alt="User photo"
                />
                <input
                  type="file"
                  accept="image/*"
                  className="form__upload"
                  onChange={(e) => setPhoto(e.target.files[0])}
                  id="photo"
                  name="photo"
                />
                <label htmlFor="photo">Choose new photo</label>
                {/* <a href="" className="btn-text">
                  Choose new photo
                </a> */}
              </div>
              <div className="form__group right">
                <button
                  onClick={(e) => handleSaveSetting(e)}
                  className="btn btn--small btn--green"
                >
                  Save settings
                </button>
              </div>
            </form>
          </div>

          <div className="line">&nbsp;</div>

          <div className="user-view__form-container">
            <h2 className="heading-secondary ma-bt-md">Password change</h2>
            <form className="form form-user-settings">
              <div className="form__group">
                <label className="form__label" htmlFor="password-current">
                  Current password
                </label>
                <input
                  id="password-current"
                  className="form__input"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={8}
                />
              </div>
              <div className="form__group">
                <label className="form__label" htmlFor="password">
                  New password
                </label>
                <input
                  id="password"
                  className="form__input"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  minLength={8}
                />
              </div>
              <div className="form__group ma-bt-lg">
                <label className="form__label" htmlFor="password-confirm">
                  Confirm password
                </label>
                <input
                  id="password-confirm"
                  className="form__input"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  minLength={8}
                />
              </div>
              <div className="form__group right">
                <button
                  onClick={(e) => handleSavePassword(e)}
                  className="btn btn--small btn--green"
                >
                  Save password
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Account;
