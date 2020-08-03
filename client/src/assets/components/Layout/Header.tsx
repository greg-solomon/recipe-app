import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AuthState } from "../../../redux/reducers/authReducer";
import { AppState } from "../../../redux/store/store";
import { connect } from "react-redux";
import { MdArrowDropDown } from "react-icons/md";
import { logout } from "../../../redux/actions";
import { useSpring, animated } from "react-spring";
import { grey } from "@material-ui/core/colors";

interface IProps {
  auth: AuthState;
  logout: Function;
}

function Header({ auth, logout }: IProps) {
  const [atTop, setAtTop] = useState<boolean>(false);
  const handleLogout = () => {
    logout();
  };

  window.addEventListener("scroll", () => {
    if (window.scrollY === 0) {
      setAtTop(true);
    } else {
      setAtTop(false);
    }
  });

  const [toggle, setToggle] = useState(false);

  let color = auth.user !== null ? auth.user.color : grey[900];
  return (
    <header
      style={{
        backgroundColor: color,
        padding: atTop ? "0 5%" : "0 2%",
        height: atTop ? "12vh" : "10vh",
      }}
    >
      <Link to="/" aria-label="Go to Home">
        <h4>Recipeshare</h4>
      </Link>
      <DesktopNav auth={auth} handleLogout={handleLogout} />
      <button
        className="mobile-nav-btn"
        onClick={() => setToggle(!toggle)}
        aria-label="Open Menu"
      >
        Menu
      </button>
      <MobileNav
        auth={auth}
        handleLogout={handleLogout}
        toggle={toggle}
        setToggle={setToggle}
        color={color}
      />
    </header>
  );
}

function DesktopNav({ auth, handleLogout }: any) {
  const { isAuth } = auth;
  return (
    <nav className="desktop-nav">
      <ul>
        <li className="nav-link">
          <Link to="/search" aria-label="Go to Search">
            Search
          </Link>
        </li>
        <li className="nav-link">
          <Link to="/" aria-label="Go to Feed">
            Feed
          </Link>
        </li>
        <li className="nav-link">
          <Link to="/add" aria-label="Go to Add a Recipe">
            Add a Recipe
          </Link>
        </li>
        <li className="nav-link">
          {isAuth ? (
            <Authenticated
              handleLogout={handleLogout}
              user={auth.user}
              className="nav-link"
              color={auth.user !== null ? auth.user.color : grey[800]}
            />
          ) : (
            <Link to="/login" className="nav-link" aria-label="Go to Log in">
              Login
            </Link>
          )}
        </li>
      </ul>
    </nav>
  );
}

function Authenticated({ handleLogout, user, color }: any) {
  const [open, setOpen] = useState(false);
  const openHandler = () => {
    setOpen(!open);
  };

  return (
    <>
      {open && <div className="click-off" onClick={() => setOpen(false)} />}
      <div className="auth-wrapper">
        <button
          type="button"
          className="profile-btn"
          onClick={openHandler}
          style={{ textTransform: "none" }}
          aria-label="Open Profile Menu"
        >
          {user.displayName}
          <MdArrowDropDown />
        </button>
        {open && (
          <>
            <ul
              className="header-profile"
              style={{ backgroundColor: color, color: "white", zIndex: 40 }}
            >
              <li>
                <Link to="/me" aria-label="Go to Profile">
                  Profile
                </Link>
              </li>
              <li>
                <Link to="/settings" aria-label="Go to Settings">
                  Settings
                </Link>
              </li>
              <li
                onClick={handleLogout}
                style={{ cursor: "pointer" }}
                aria-label="Log out"
              >
                Logout
              </li>
            </ul>
          </>
        )}
      </div>
    </>
  );
}

function MobileNav({ handleLogout, auth, toggle, setToggle, color }: any) {
  const { isAuth } = auth;
  const menuSpring = useSpring({
    transform: toggle ? `translate3d(0%, 0, 0)` : `translate3d(100%, 0%, 0)`,
  });

  const closeSpring = useSpring({
    transform: toggle ? `translate3d(0%, 0, 0)` : `translate3d(-100%, 0%, 0)`,
  });
  return (
    <>
      <animated.div
        className="close-el"
        onClick={() => setToggle(false)}
        style={closeSpring}
      />
      <animated.div
        className="mobile-nav"
        style={{ ...menuSpring, backgroundColor: color }}
      >
        <button onClick={() => setToggle(false)}>Close Menu</button>
        <nav>
          <ul>
            <li>
              <Link to="/search" aria-label="Go to Search">
                Search
              </Link>
            </li>
            <li className="nav-link">
              <Link to="/" aria-label="Go to Feed">
                Feed
              </Link>
            </li>
            <li>
              <Link to="/add" aria-label="Go to Add a Recipe">
                Add a Recipe
              </Link>
            </li>
            <li>
              {isAuth ? (
                <>
                  <Link to="/me" aria-label="Go to Profile">
                    Profile
                  </Link>
                </>
              ) : (
                <Link to="/login" aria-label="Go to Login">
                  Login
                </Link>
              )}
            </li>
            {isAuth && (
              <>
                <li>
                  <Link to="/settings" aria-label="Go to Settings">
                    Settings
                  </Link>
                </li>
                <li
                  onClick={handleLogout}
                  aria-label="Log out"
                  style={{ cursor: "pointer", color: "white" }}
                >
                  Logout
                </li>
              </>
            )}
          </ul>
        </nav>
      </animated.div>
    </>
  );
}

const mapStateToProps = (state: AppState) => ({
  auth: state.auth,
  alert: state.alert,
});

export default connect(mapStateToProps, { logout })(Header);
