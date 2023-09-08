const { getConnection } = require("../database"); // Certifique-se de importar a conexão corretamente

class ControlePrecos {
  async conferencia_campos_necessarios(req, res) {
    const { dados } = req.body;
    const dados_filtrados = dados.filter((item) => item.product_code !== null);
    const itens_conferidos = [];
    const itens_erros = [];
    dados_filtrados.forEach((item, index) => {
      if (item.product_code > 0 && item.new_price > 0) {
        itens_conferidos.push({ index, item });
      } else {
        itens_erros.push({ index, item });
      }
    });
    if (itens_erros.length > 0) {
      res.status(200).json(itens_erros);
    } else {
      res.status(200).json({ res: "0" });
    }
  }
  async conferencia_databse(req, res) {
    try {
      const { dados } = req.body;
      const connection = await getConnection();
      const itens = [];
      const dados_filtrados = dados.filter(
        (item) => item.product_code !== null
      );
      for (const item of dados_filtrados) {
        const [rows] = await connection.execute(
          `SELECT * FROM products WHERE code = ${item.product_code}`
        );
        if (rows.length == 0) {
          const index = dados_filtrados.indexOf(item);
          itens.push({ index, item });
        }
      }
      await connection.end();
      if (itens.length > 0) {
        res.status(200).json(itens);
      } else {
        res.status(200).json({ res: "0" });
      }
    } catch (error) {
      console.error("Erro ao conferir o banco de dados:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  }
  async conferir_regras(req, res) {
    try {
      const { dados } = req.body;
      const connection = await getConnection();
      const itens = [];
      const itens_erros = [];
      const dados_filtrados = dados.filter(
        (item) => item.product_code !== null
      );
      for (const item of dados_filtrados) {
        const [rows] = await connection.execute(
          `SELECT * FROM products WHERE code = ${item.product_code}`
        );
        const custo_produto = parseFloat(rows[0].cost_price);
        const venda_produto = parseFloat(rows[0].sales_price);
        const novo_preco_produto = parseFloat(item.new_price);
        if (item.product_code == rows[0].code) {
          if (novo_preco_produto > custo_produto) {
            const limiteSuperior = parseFloat(
              (venda_produto + venda_produto * 0.1).toFixed(2)
            );
            const limiteInferior = parseFloat(
              (venda_produto - venda_produto * 0.1).toFixed(2)
            );
            if (
              novo_preco_produto >= limiteInferior &&
              novo_preco_produto <= limiteSuperior
            ) {
              const index = dados_filtrados.indexOf(item);
              itens.push({
                index: index,
                msg: "Produto OK.",
              });
            } else {
              const index = dados_filtrados.indexOf(item);
              itens_erros.push({
                index: index,
                msg: "Preço fora da faixa de 10% acima ou abaixo do preço de custo.",
              });
            }
          } else {
            const index = dados_filtrados.indexOf(item);
            itens_erros.push({
              index: index,
              msg: "Novo preço abaixo do preço de custo.",
            });
          }
        }
      }
      await connection.end();
      if (itens_erros.length > 0) {
        res.status(200).json(itens_erros);
      } else {
        res.status(200).json({ res: "0" });
      }
    } catch (error) {
      console.error("Erro ao conferir o banco de dados:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  }
  async conferir_itens(req, res) {
    try {
      const { dados } = req.body;
      const connection = await getConnection();
      const itens = [];
      const dados_filtrados = dados.filter(
        (item) => item.product_code !== null
      );
      for (const item of dados_filtrados) {
        const [rows] = await connection.execute(
          `SELECT * FROM products WHERE code = ${item.product_code}`
        );
        const codigo = rows[0].code;
        const nome = rows[0].name;
        const preco_atual = rows[0].sales_price;
        const novo_preco = item.new_price.toFixed(2);
        itens.push({
          cod: codigo,
          nome: nome,
          preco_atual: preco_atual,
          novo_preco: novo_preco,
        });
      }
      await connection.end();
      res.status(200).json(itens);
    } catch (error) {
      console.error("Erro ao conferir o banco de dados:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  }
  async atualizar_itens(req, res) {
    try {
      const { dados } = req.body;
      const connection = await getConnection();
      for (const item of dados) {
        await connection.execute(
          `UPDATE products SET sales_price = ${item.novo_preco} WHERE code = ${item.cod}`
        );
      }
      for (const item of dados) {
        const [pack] = await connection.execute(
          `SELECT pack_id FROM packs WHERE product_id = ${item.cod}`
        );
        if (pack && pack.length > 0) {
          console.log(pack);
          const id_pack = pack[0].pack_id;
          const products_pack = [];
          const [id_products_pack] = await connection.execute(
            `SELECT * FROM packs WHERE pack_id = ${id_pack}`
          );
          for (const item of id_products_pack) {
            const [valor_produto] = await connection.execute(
              `SELECT sales_price FROM products WHERE code = ${item.product_id}`
            );
            const valor = valor_produto[0];
            products_pack.push({
              item: item.product_id,
              valor: valor.sales_price,
              qty: item.qty,
            });
          }
          const resultado = products_pack.map((item) => ({
            ...item,
            valor: parseFloat(item.valor) * item.qty,
          }));
          const soma = resultado.reduce((acumulador, item) => {
            return acumulador + item.valor;
          }, 0);
          const res = parseFloat(soma.toFixed(2));
          await connection.execute(
            `UPDATE products SET sales_price = ${res} WHERE code = ${id_pack}`
          );
        }
      }
      await connection.end();
      res.status(200).json({ message: "Dados atualizados com sucesso" });
    } catch (error) {
      console.error("Erro ao conferir o banco de dados:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  }
}

export default new ControlePrecos();
