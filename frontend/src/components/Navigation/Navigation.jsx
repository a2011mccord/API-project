import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import * as sessionActions from '../../store/session';

function Navigation({ isLoaded }) {
  const dispatch = useDispatch();
  const sessionUser = useSelector(state => state.session.user);

  const logout = e => {
    e.preventDefault();
    dispatch(sessionActions.logout());
  }

  const sessionLinks = sessionUser ? (
    <>
      <li>
        <ProfileButton user={sessionUser} />
      </li>
      <li>
        <button onClick={logout}>Log Out</button>
      </li>
    </>
  ) : (
    <>
      <li>
        <NavLink to='/login'>Log In</NavLink>
      </li>
      <li>
        <NavLink to='/signup'>Sign Up</NavLink>
      </li>
    </>
  );

  return (
    <nav>
      <ul>
        <li>
          <NavLink to='/'>Home</NavLink>
        </li>
        {isLoaded && sessionLinks}
      </ul>
    </nav>
  )
}

export default Navigation;
