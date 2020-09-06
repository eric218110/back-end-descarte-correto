# Listar um unico ponto de coleta

> ## Casos de sucesso

- <span style='font-size:25px; color: green;'>&#10004;</span>
  <span style='font-size:16px;'>&#10140;</span> Recebe uma requisição do tipo **GET** na rota **/api/points/:id**
- <span style='font-size:25px; color: green;'>&#10004;</span>
  <span style='font-size:16px;'>&#10140;</span> Receber o dado **id** via query params
- <span style='font-size:25px; color: green;'>&#10004;</span>
  <span style='font-size:16px;'>&#10140;</span> Valida o campo obrigatório **id**
- <span style='font-size:25px; color: green;'>&#10004;</span>
  <span style='font-size:16px;'>&#10140;</span> Buscar o campo **id** na base de dados
- <span style='font-size:25px; color: green;'>&#10004;</span>
  <span style='font-size:16px;'>&#10140;</span> Validar se o campo **id** é do tipo UUID
- <span style='font-size:25px; color: green;'>&#10004;</span>
  <span style='font-size:16px;'>&#10140;</span> Retorna **204** `No Content` se não encontrar nenhum dado a partir dos id
- <span style='font-size:25px; color: green;'>&#10004;</span>
  <span style='font-size:16px;'>&#10140;</span> Retorna **200** com um unico ponto de coleta caso encontrado

> ## Exceções

- <span style='font-size:25px; color: green;'>&#10004;</span>
  <span style='font-size:16px;'>&#10140;</span> Retorna erro **404** se a API não existir
- <span style='font-size:25px; color: green;'>&#10004;</span>
  <span style='font-size:16px;'>&#10140;</span> Retorna erro **400** se id não for do tipo UUID
- <span style='font-size:25px; color: green;'>&#10004;</span>
  <span style='font-size:16px;'>&#10140;</span> Retorna erro **500** se der erro ao tentar criar a um novo ponto de coleta