import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ProfileButton from "./ProfileButton";
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);
  const navigate = useNavigate();

  return (
    <nav>
      <ul>
        <li>
          <img
            id="logo"
            src="/images/homeshare-logo.jpg"
            onClick={() => navigate('/')}
          />
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
