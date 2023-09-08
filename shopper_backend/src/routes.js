import { Router } from "express";
import ControlePrecos from "./Controles/ControlePrecos";
const routes = new Router();

routes.post("/controle", ControlePrecos.conferencia_campos_necessarios);
routes.post("/controle/database", ControlePrecos.conferencia_databse);
routes.post("/controle/database/regras", ControlePrecos.conferir_regras);
routes.post("/controle/database/regras/itens", ControlePrecos.conferir_itens);
routes.post("/atualizar/itens", ControlePrecos.atualizar_itens);

export default routes;
