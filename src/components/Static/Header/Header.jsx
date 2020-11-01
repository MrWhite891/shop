/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { isOpenLogin, setAdmin } from "../../../actions/actions";
import Login from "../../Login/Login";
import "./Header.css";
import { useEffect } from "react";
const Header = () => {
  const head = React.useRef();
  const dispatch = useDispatch();
  const total = useSelector((state) => state.total);
  const isOpen = useSelector((state) => state.isOpenLogin);
  const isAdmin = useSelector((state) => state.isAdmin);
  const deletedProducts = useSelector((state) => state.deletedProducts);

    if(!isAdmin && localStorage.getItem('isAdmin')){
      dispatch(setAdmin())
    }

  window.addEventListener("scroll", () => {
    if (!head.current || window.innerWidth < 766) return;
    if (window.scrollY > 0) {
      head.current.className = "fixed";
    } else head.current.className = null;
  });

  const openLogin = () => {
    console.log("asdasd");
    dispatch(isOpenLogin());
  };

  return (
    <>
      {isOpen ? <Login /> : null}
      <header ref={head}>
        <div className="container">
          <NavLink to="/" activeClassName="">
            <img
              id="logo"
              src={require("../../../image/logo.png")}
              alt="logo"
            />
          </NavLink>
          <ul>
            <li>
              <NavLink activeClassName="active" exact to="/">
                Каталог
              </NavLink>
            </li>
            <li>
              {total === 0 ? null : (
                <NavLink activeClassName="active" to="/cart">
                  <div className="divCart">
                    Корзина
                    <span className="total">{total}</span>
                  </div>
                </NavLink>
              )}
            </li>
            <li>
              {!isAdmin ? 
              <button className="divLogin" onClick={openLogin}>
              Вход
            </button> :
            <NavLink activeClassName="active" to="/cab">
                  <div className="divCart">
                    Личный кабинет
                  </div>
                </NavLink>
            }
            </li>
            {isAdmin ? 
            <li>
              <button onClick={()=>{
                dispatch(setAdmin())
                localStorage.removeItem('isAdmin')
              }} className="divLogin">
            Выйти
          </button>
            </li>
          : null}
          </ul>
        </div>
      </header>
    </>
  );
};

export default Header;
