function Window(props) {
    return (
      <div className={`YellowWindow ${props.className}`}>
        {props.children}
      </div>
    );
  }

export default Window;