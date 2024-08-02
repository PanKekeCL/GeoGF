import React, { useState, useEffect } from 'react';
import Button from "../components/Button";

const Home = () => {
    const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });

    useEffect(() => {
        const handleResize = () => {
            setDimensions({ width: window.innerWidth, height: window.innerHeight });
        };

        // Agregar un event listener para detectar cambios en las dimensiones al cambiar el tamaño de la ventana
        window.addEventListener('resize', handleResize);

        // Limpiar el event listener cuando el componente se desmonta
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []); // El array vacío asegura que useEffect se ejecute solo una vez al montar el componente

    const backgroundStyle = {
        backgroundColor: "#001818",
        width: "100%",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "#FFFFFF",
    }

    const containerStyle = {
        backgroundColor: "#C0F020",
        height: "100%",
        width: "60vh",
        color: "#000000",
        padding: "5% 10px 10px", // 20px arriba, 10px a los lados y 10px abajo
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start", // Alinea los elementos desde la parte superior
        alignItems: "center",
        overflow: "hidden",
      };

    const textBoxStyle = {
        backgroundImage: 'url("../public/textbox31.png")', // Ajusta la ruta según la estructura de tu proyecto
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        width: 'auto',
        height: '150px', // Ajusta la altura según tus necesidades
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#FFFFFF',
        
      };

    return (
        <div style={backgroundStyle}>
            <div style={containerStyle}>
                <img src="https://imgix.ranker.com/user_node_img/86/1714869/original/old-man-willow-fictional-characters-photo-u1?auto=format&q=60&fit=crop&fm=pjpg&dpr=2&crop=faces&h=90&w=90" alt="Logo del Juego" style={{ width: '80%', maxWidth: '30vw' }} />
                
                <div style={textBoxStyle}>
                    <p>Hola</p>
                </div>

                <Button />
                <h1>Dimensiones del Navegador</h1>
                <p>Ancho: {dimensions.width}px</p>
                <p>Alto: {dimensions.height}px</p>
            </div>
        </div>
    );
}

export default Home;
