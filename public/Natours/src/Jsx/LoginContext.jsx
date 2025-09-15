import { createContext, useCallback, useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { URL } from '../config';
import { useNavigate } from 'react-router-dom';
// import { useLocalStorageState } from '../hooks/useLocalStorageState';
// import { isLogin } from "../api/user";

export const LoginContext = createContext();
function LoginProvider({ children }) {
  const [cookies, setCookie, removeCookie] = useCookies(['jwt']);
  const [login, setLogin] = useState();
  const [isloginLoad, setLoginLoad] = useState(cookies.jwt ? true : false);

  useEffect(() => {
    if (cookies.jwt) {
      async function isLogin() {
        setLoginLoad(true);
        const res = await fetch(`${URL}users/login`, {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            // Authorization: `Bearer ${jwt}`,
          },
          body: JSON.stringify({
            jwtToken: cookies.jwt,
          }),
        });
        const data = await res.json();

        // setCookie('jwt', data.token, {
        //   path: '/',
        //   secure: true,
        //   sameSite: 'None',
        // });

        setLogin(data.data);
        setLoginLoad(false);
      }

      isLogin();
    } else {
      setLogin(false);
    }
  }, [cookies.jwt]);

  // const [login, setLogin] = useLocalStorageState(false, 'login');

  // const checkLogin = useCallback(
  // async function checkLogin() {
  // setLogin(() => false);
  // if (cookies?.jwt) {
  //   const logined = await isLogin(cookies?.jwt);
  //   setLogin(() => logined);
  // }
  // },
  // [cookies, setLogin],
  // );

  return (
    <LoginContext.Provider
      // value={{ cookies, setCookie, login, setLogin, checkLogin, removeCookie }}
      value={{ cookies, setCookie, removeCookie, login, setLogin, isloginLoad }}
    >
      {children}
    </LoginContext.Provider>
  );
}
export default LoginProvider;
