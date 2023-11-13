import { Link } from "react-router-dom";
import Window from "../components/Window"
import TopNavBar from "../components/TopNavBar"
import "../css/Home.css"

function Home() {

  const messages = [
    "SCRUMP THAT DUMP!!",
    "OK MAYBE REACT.JS ISN'T FOR LOSERS",
    "HOME OF THE GIGA SCRUMP!!",
    "SCRUMPALICIOUS!!",
    "NOW OFFERING REDUCED FAT SCRUMP!!",
    "SCRUMP.CFD IS A FRONT BUT FOR WHAT??",
    "MOBILE APP??",
    "SOUTH CAROLINA RUMP?",
    "100% OHIO!!"
  ]

  const message = String(messages[Math.floor(Math.random()*messages.length)]);

    return (
      <div className="Background">
      <TopNavBar items={['MusicNote']}>
      </TopNavBar>
      <div className="CenterDiv">

      <Window className="HomeYellowWindow">
        <img className="SnailCat" src="/gifs/snailing-cat.gif"></img>
        <h5 className="Hint">~pssst click the logo~</h5>
        <Link to="/weather">
          <img className="CenterImg" src="/gifs/scrumpcfd.gif"></img>
        </Link>
        <img className="RunningCat" src="gifs/running.gif"></img>
        <h4 className = "HomeText RainbowText">{ message }</h4>
      </Window>
      </div>
      {/*<img className="ScrumpTech" src="/png/scrumptech.png"></img>*/}
      </div>
    );
  }

export default Home;