import { Link } from "react-router-dom";
import Window from "../components/Window"
import TopNavBar from "../components/TopNavBar"
import "../css/Navigation.css"

function Navigation() {

  const cities = [
    { name: 'AUSTIN', path: 'austin' },
    { name: 'FORT WORTH', path: 'fort-worth' },
    { name: 'DALLAS', path: 'dallas' },
    { name: 'HOUSTON', path: 'houston' },
    { name: 'ALBUQUERQUE', path: 'albuquerque' },
    { name: 'RENO', path: 'reno' },
    { name: '!! OHIO !!', path: 'ohio' },
    { name: 'DENVER', path: 'denver' },
    { name: 'NEW YORK CITY', path: 'new-york' },
    { name: 'CHICAGO', path: 'chicago' },
    { name: 'MINNEAPOLIS', path: 'minneapolis' },
    { name: 'SEATTLE', path: 'seattle' },
    { name: 'UNITED STATES', path: 'united-states', specialClass: 'PurpleFlashText' }
  ];

  return (
    <div className="FlexViewport">
    <TopNavBar items={['MusicNote', 'BackButton']} linkTo="/">
    </TopNavBar>
    <Window className="NavigationYellowWindow">
      <div>
      <h2 className="PurpleFlashText">CHOOSE FROM OUR ORGANIZED LIST OF GLOBAL CITIES!!!</h2>
      </div>

      <div className="CenterDiv">
      {
        cities.map(city => (
          <Link key={city.path} to={`/weather/${city.path}`}>
            <h2 className={city.specialClass || ''}>{city.name}</h2>
          </Link>
        ))
      }
      </div>

    </Window>
    <img className="Nancy" src="gifs/nancy.gif"></img>

    </div>
    );
  }

export default Navigation;