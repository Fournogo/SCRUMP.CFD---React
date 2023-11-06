//import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useAudio } from '../contexts/AudioContext';
import "../css/TopNavBar.css"

function TopNavBar({ items, linkTo }) {
    //const navigate = useNavigate();
    const { isPlaying, togglePlay } = useAudio();
  
    const allItems = {
      MusicNote: <div className="LeftNavColumn">
        <img onClick={togglePlay} className="MusicNote" src="/gifs/music-note.gif"></img>
        </div>,
      BackButton: <div className="RightNavColumn">
        <Link to={ linkTo }><img className="BackButton" src="/gifs/back.gif"></img></Link>
        </div>
    };
  
    return (
      <div className="TopNavBar">
        {items.map(item => allItems[item])}
      </div>
    );
  }

export default TopNavBar;