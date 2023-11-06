import "../css/Label.css"

function Label({children, dimensions}) {

    return(
        <div className={`LabelOutside ${dimensions}`}>
        <div className="LabelInside PurpleFlashText">
            {children}
        </div>
        </div>
    )
}

export default Label;