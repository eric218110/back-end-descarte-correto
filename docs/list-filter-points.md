# Listar pontos de coletas

> ## Caso de sucesso

01. ❌ Recebe uma requisição do tipo **GET** na rota **/api/points**
02. ❌ Receber os dados via query **city**, **state**, **items**
03. ❌ Validar campos obrigatorio **city**, **state**, **items**
04. ❌ Listar os points realizando filtro a partir dos campos **city**, **state**, **items**
05. ❌ Listar apenas a image url da tabela items
06. ❌ Retorna **204** `No Content` se não encontrar nenhum dado a partir dos filtros 
07. ❌ Retorna **200** e os dados ao encontrar a partir do filtro 

> ## Exceções

01. ❌ Retorna erro **404** se a API não existir
03. ❌ Retorna erro **500** se der erro ao listar os pontos de coleta