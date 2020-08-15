# Cadastro

> ## Listar um unico ponto de coleta

01. ❌ Recebe uma requisição do tipo **GET** na rota **/api/points/:id**
02. ❌ Receber o dado **id** via query params
03. ❌ Valida o campo obrigatório **id**
04. ❌ Buscar o campo **id** na base de dados
05. ❌ Retorna **200** com um unico ponto de coleta 

> ## Exceções

01. ❌ Retorna erro **404** se a API não existir
02. ❌ Retorna erro **401** se **token** estiver invalido, expirado ou mal formatado
07. ❌ Retorna erro **500** se der erro ao tentar criar a um novo ponto de coleta