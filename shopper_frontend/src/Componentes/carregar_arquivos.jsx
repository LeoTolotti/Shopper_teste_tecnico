import React, { useLayoutEffect, useState } from "react";
import Papa from "papaparse";
import "./carregar_arquivos.css";
import {
  validar_arquivo,
  conferir_dataBase,
  conferir_regras,
  conferir_itens,
  atualizar_itens,
} from "../servisos/api";

const Carregar_arquivos = () => {
  const [csvData, setCsvData] = useState(null);
  const [dados_errados, setDados_errados] = useState([]);
  const [dados, setDados] = useState(false);
  const [database_errados, setDatabase_errados] = useState([]);
  const [database, setDatabase] = useState(false);
  const [regras_erradas, setRegras_erradas] = useState([]);
  const [regras, setRegras] = useState(false);
  const [itens, setItens] = useState([]);
  const [btnItens, setBntItens] = useState(false);
  const mudancaArquivo = (e) => {
    const file = e.target.files[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        complete: (result) => {
          setCsvData(result.data);
        },
        error: (error) => {
          console.error("Erro ao analisar o arquivo CSV:", error);
        },
      });
    }
  };

  const validarArquivo = async () => {
    const res = await validar_arquivo(csvData);
    const erros = [];
    if (res.res != 0) {
      for (const item of res) {
        erros.push({
          index: `O item ${item.index + 1} da tabela esta com erros.`,
        });
      }
      setDados_errados(erros);
    } else {
      setDados(true);
      conferirDataBase();
    }
  };
  const conferirDataBase = async () => {
    const res = await conferir_dataBase(csvData);
    const dataBase = [];
    if (res.res != 0) {
      for (const item of res) {
        dataBase.push({
          index: `O item ${
            item.index + 1
          } da tabela não consta no banco de dados.`,
        });
      }
      setDatabase_errados(dataBase);
    } else {
      setDatabase(true);
      conferirRegras();
    }
  };
  const conferirRegras = async () => {
    const res = await conferir_regras(csvData);
    const regras = [];
    if (res.res != 0) {
      for (const item of res) {
        regras.push({
          index: `O item ${item.index + 1} da tabela contem erro:`,
          msg: `${item.msg}`,
        });
      }
      setRegras_erradas(regras);
    } else {
      setRegras(true);
      conferirItens();
    }
  };
  const conferirItens = async () => {
    const res = await conferir_itens(csvData);
    const itens = [];
    for (const item of res) {
      itens.push({
        cod: item.cod,
        nome: item.nome,
        preco_atual: item.preco_atual,
        novo_preco: item.novo_preco,
        msg: `${item.cod}, ${item.nome}, R$ ${item.preco_atual}, R$ ${item.novo_preco}.`,
      });
    }
    setItens(itens);
    setBntItens(true);
  };
  const atualizarItens = async () => {
    const res = await atualizar_itens(itens);
    alert(res.message);
    loadPage();
  };
  const loadPage = () => {
    window.location.reload();
  };

  return (
    <div className="carregamento_de_csv">
      <div className="carregamento_de_arquivo">
        <h3>Carregue o arquivo</h3>
        <input type="file" accept=".csv" onChange={mudancaArquivo} />
        <button onClick={validarArquivo}>Validar</button>
      </div>
      <div className="analise_de_dados">
        <h3>Dados</h3>
        <div className="dados_do_csv">
          <p>
            {dados && <span>OK...</span>}
            Todos os campos necessários existem.
          </p>
          {dados_errados && (
            <div>
              <ul>
                {dados_errados.map((item, index) => (
                  <li key={index}>{item.index}</li>
                ))}
              </ul>
            </div>
          )}
          <p>
            {database && <span>OK...</span>}
            Codigo do produto não encontrado no banco de dados.
          </p>
          {database_errados && (
            <div>
              <ul>
                {database_errados.map((item, index) => (
                  <li key={index}>{item.index}</li>
                ))}
              </ul>
            </div>
          )}
          <p>
            {regras && <span>OK...</span>}
            Regras para atualização de preços.
          </p>
          {regras_erradas && (
            <div>
              <ul>
                {regras_erradas.map((item, index) => (
                  <li key={index}>
                    {item.index}
                    <br />
                    {item.msg}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div>
            {btnItens && <p>Itens a serem atualizados no banco de dados.</p>}
            {itens && (
              <div>
                <ul>
                  {itens.map((item, index) => (
                    <li key={index}>{item.msg}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div>
            {btnItens && <button onClick={atualizarItens}>Atualizar</button>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Carregar_arquivos;
