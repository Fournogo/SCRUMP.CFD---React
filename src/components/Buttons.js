import "../css/Buttons.css"

export function PauseButton(props) {
    return (
        <div onClick={props.onClick} className="Button">
            <img src="/png/pause.png"></img>
        </div>
    );
}

export function NextButton(props) {
    return (
        <div onClick={props.onClick} className="Button">
            <img src="/png/next.png"></img>
        </div>
    );
}

export function BackButton(props) {
    return (
        <div onClick={props.onClick} className="Button">
            <img src="/png/back.png"></img>
        </div>
    );
}

export function BrowserButton(props) {
    return (
        <div onClick={props.onClick} className="Button BrowserButton">
            <h4 className="PurpleFlashText">
                BROWSER
            </h4>
        </div>
    );
}

// Browser button displayname ensures you can properly pass browser button to an OSWindow
BrowserButton.displayName = 'BrowserButton'
PauseButton.displayName = 'PauseButton'
NextButton.displayName = 'NextButton'
BackButton.displayName = 'BackButotn'

