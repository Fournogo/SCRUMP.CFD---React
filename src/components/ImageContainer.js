import "../css/ImageContainer.css"

function ImageContainer(props) {
    return (
        <div className="InsetImage">
            {props.children}
        </div>
    );
}

export default ImageContainer;