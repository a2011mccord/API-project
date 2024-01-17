import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  return (
    <nav>
      <ul>
        <li>
          <NavLink to='/'>Home</NavLink>
        </li>
        {isLoaded && (
          <div>
            {sessionUser &&
              <NavLink to='/spots/new' className="create-spot">
                Create a New Spot
              </NavLink>
            }
            <li className="profile">
              <ProfileButton user={sessionUser} />
            </li>
          </div>
        )}
      </ul>
    </nav>
  )
}

export default Navigation;
