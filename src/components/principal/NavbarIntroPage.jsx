import React from 'react';
import GoogleOauth from '../oauth/GoogleOauth.jsx';

export default function NavbarIntroPage() {

    const setNavLinkActive = (link) => {
        const links = document.getElementsByClassName('nav-link active');
        const activeLink = links.item(0);

        activeLink.setAttribute("class", "nav-link");   
        link.setAttribute("class", "nav-link active");
    }

    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top" id="mainNav">
                <div className="container px-4">
                    <a className="navbar-brand" href="#intro" aria-label='elRastro'>elRastro</a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation"><span className="navbar-toggler-icon"></span></button>
                    <div className="collapse navbar-collapse" id="navbarResponsive">
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item" ><a id='link-inicio' aria-label='inicio' className="nav-link active" href="#inicio" onClick={() => {setNavLinkActive(document.getElementById("link-inicio"))}}>Inicio</a></li>
                            <li className="nav-item"><a id='link-anuncios' label='pujas' className="nav-link" href="#anuncios" onClick={() => {setNavLinkActive(document.getElementById("link-anuncios"))}}>Subastas</a></li>
                            <li className="nav-item"><a id='link-interactua' className="nav-link" href="#interactua" onClick={() => {setNavLinkActive(document.getElementById("link-interactua"))}}>Contacta</a></li>
                            <li className="nav-item"><a id='link-about' className="nav-link" href="#sobre-nosotros" onClick={() => {setNavLinkActive(document.getElementById("link-about"))}}>Sobre nosotros</a></li>
                            <li className="nav-item"><GoogleOauth/></li>
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    )
}