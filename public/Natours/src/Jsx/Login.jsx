import { useEffect, useState } from 'react';
import { URL } from '../config';
import { useLogin } from './useLogin';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

function Login() {
  const { cookies, setCookie, removeCookie, login, setLogin, isloginLoad } =
    useLogin();
  const navigate = useNavigate();

  // removeCookie('jwt');
  const [email, setEmail] = useState('steve@example.com');
  const [password, setPassword] = useState('test1234');

  if (isloginLoad) return <p>Loading</p>;
  if (login) return navigate('/overview');

  // useEffect(() => {
  //   if (cookies.jwt) {
  //     isLogin();
  //     navigate('/overview');
  //   }
  // }, [isLogin, cookies.jwt, navigate]);

  async function handleSubmit(e) {
    try {
      e.preventDefault();
      const res = await fetch(`${URL}users/login`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          // Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();
      if (data.status !== 'success') throw new Error(data.message);

      setCookie('jwt', data.token, {
        path: '/',
        secure: true,
        sameSite: 'None',
      });
      toast.success('You are login.');
      setLogin(data.data);

      navigate('/overview');
    } catch (err) {
      console.log(err.message);
      toast.error(err.message);
    }
  }

  return (
    <div className="main">
      <div className="login-form">
        <h2 className="heading-secondary ma-bt-lg">Log into your account</h2>
        <form className="form" onSubmit={handleSubmit}>
          <div className="form__group">
            <label for="email" className="form__label">
              Email address
            </label>
            <input
              id="email"
              className="form__input"
              type="email"
              placeholder="your@email.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form__group">
            <label for="password" className="form__label">
              Password
            </label>
            <input
              id="password"
              className="form__input"
              type="password"
              placeholder="********"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="form__group">
            <button className="btn btn--green">Login</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
