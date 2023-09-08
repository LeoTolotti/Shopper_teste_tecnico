import React from "react";
import "./tela_carregamento_precos.css";
import Carregar_arquivos from "../Componentes/carregar_arquivos";

const Tela_carregamento_precos = () => {
  return (
    <div>
      <header className="nav_bar_home">
        <div className="nav_bar_home_div">
          <a href="#logo" className="a_logo">
            <img
              src="https://landing.shopper.com.br/static/media/logo-original.c7089ad32bcf61645d35.webp"
              alt="Logo da Shopper"
              className="img_logo"
            />
          </a>
          <nav className="componente_nav_bar">
            <a href="#DuvidasFrequentes">
              <button className="nav_bar_home_button_duvidas">
                Dúvidas frequentes
              </button>
            </a>

            <button className="nav_bar_home_button_login">Fazer Login</button>
            <button className="nav_bar_home_button_criar_conta">
              Crie sua conta
            </button>
          </nav>
        </div>
      </header>
      <div className="body_tela_carregamento_de_dados">
        <div>
          <Carregar_arquivos />
        </div>
      </div>
    </div>
  );
};

export default Tela_carregamento_precos;
