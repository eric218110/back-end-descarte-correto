# Listar pontos de coletas

> ## Caso de sucesso

- <span style='font-size:15px;'>&#10060;</span>
  <span style='font-size:16px;'>&#10140;</span> Recebe uma requisição do tipo **GET** na rota **/api/points**
- <span style='font-size:15px;'>&#10060;</span>
  <span style='font-size:16px;'>&#10140;</span> Receber os dados via query **city**, **state**, **items**
- <span style='font-size:15px;'>&#10060;</span>
  <span style='font-size:16px;'>&#10140;</span> Validar campos obrigatorio **city**, **state**, **items**
- <span style='font-size:15px;'>&#10060;</span>
  <span style='font-size:16px;'>&#10140;</span> Listar os points realizando filtro a partir dos campos **city**, **state**, **items**
- <span style='font-size:15px;'>&#10060;</span>
  <span style='font-size:16px;'>&#10140;</span> Listar apenas a image url da tabela items
- <span style='font-size:15px;'>&#10060;</span>
  <span style='font-size:16px;'>&#10140;</span> Retorna **204** `No Content` se não encontrar nenhum dado a partir dos filtros 
- <span style='font-size:15px;'>&#10060;</span>
  <span style='font-size:16px;'>&#10140;</span> Retorna **200** e os dados ao encontrar a partir do filtro 

> ## Exceções

- <span style='font-size:15px;'>&#10060;</span>
  <span style='font-size:16px;'>&#10140;</span> Retorna erro **404** se a API não existir
- <span style='font-size:15px;'>&#10060;</span>
  <span style='font-size:16px;'>&#10140;</span> Retorna erro **500** se der erro ao listar os pontos de coleta