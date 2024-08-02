import React from 'react';

const Button = ( {text = "Sin Texto"} ) => {

    const buttonStyle = {
        backgroundColor: "#FF0000",
        width: "100px",
        height: "100px",
    }

    return(
        <button style={buttonStyle}>
            {text}
        </button>
    );

}

export default Button;