import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/header';
import DiseñadorMenu from '../components/designer/menu';
import DiseñadorMinijuegos from '../components/designer/minijuego';

const Designer = () => {
    const [currentComponent, setCurrentComponent] = useState('MenuDiseñador');

    const handleOpenMinijuegoDesigner = () => {
        setCurrentComponent('DiseñadorMinijuegos');
    };

    const renderComponent = () => {
        if (currentComponent === 'DiseñadorMinijuegos') {
            return <DiseñadorMinijuegos goBack={() => setCurrentComponent('MenuDiseñador')} />;
        }
        return <DiseñadorMenu openMinijuegoDesigner={handleOpenMinijuegoDesigner} />;
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Header />
            <div className="pt-20 p-4">
                {renderComponent()}
            </div>
        </div>
    );
}

export default Designer;
