
# Items

> ## Caso de sucesso

- <span style='font-size:25px; color: green;'>&#10004;</span>
  <span style='font-size:16px;'>&#10140;</span> Recebe uma requisição do tipo **POST** na rota **/api/items**
- <span style='font-size:25px; color: green;'>&#10004;</span>
  <span style='font-size:16px;'>&#10140;</span> Ser acessada apenas por usuários **admin**, com token valido (middleware pattern PROXY)
- <span style='font-size:25px; color: green;'>&#10004;</span>
  <span style='font-size:16px;'>&#10140;</span> Receber file image (middleware pattern PROXY - multer)
- <span style='font-size:25px; color: green;'>&#10004;</span>
  <span style='font-size:16px;'>&#10140;</span> Receber os dados via body **title**, **image**
- <span style='font-size:25px; color: green;'>&#10004;</span>
  <span style='font-size:16px;'>&#10140;</span> Valida dados obrigatórios **title**, **image**
- <span style='font-size:15px;'>&#10060;</span>
  <span style='font-size:16px;'>&#10140;</span> Receber arquivo de image e realizar upload em algum serviço de storage ou local, definido pela rota
- <span style='font-size:25px; color: green;'>&#10004;</span>
  <span style='font-size:16px;'>&#10140;</span> Salvar um novo item
- <span style='font-size:25px; color: green;'>&#10004;</span>
  <span style='font-size:16px;'>&#10140;</span> Não adicionar se o title já estiver na base de dados
- <span style='font-size:25px; color: green;'>&#10004;</span>
  <span style='font-size:16px;'>&#10140;</span> Retorna **204** `created` e o objeto, ao salvar o objeto corretamente

> ## Exceções

- <span style='font-size:25px; color: green;'>&#10004;</span>
  <span style='font-size:16px;'>&#10140;</span> Retorna erro **404** se a API não existir
- <span style='font-size:25px; color: green;'>&#10004;</span>
  <span style='font-size:16px;'>&#10140;</span> Retorna erro **401** se o token estiver expirado, mal formatado ou invalido
- <span style='font-size:25px; color: green;'>&#10004;</span><span style='font-size:16px;'>&#10140;</span> Retorna erro **400** se title ou image não forem fornecidos pelo client
- <span style='font-size:25px; color: green;'>&#10004;</span>
  <span style='font-size:16px;'>&#10140;</span> Retorna erro **401** se o usuário não estiver logado
- <span style='font-size:25px; color: green;'>&#10004;</span>
  <span style='font-size:16px;'>&#10140;</span> Retorna status code **400** se o title já estiver duplicado
- <span style='font-size:25px; color: green;'>&#10004;</span>
  <span style='font-size:16px;'>&#10140;</span> Retorna status code **400** se ocorrer algum erro ao salvar a image
- <span style='font-size:25px; color: green;'>&#10004;</span>
  <span style='font-size:16px;'>&#10140;</span> Retorna erro **403** se o usuário estiver logado e não for `admin`
- <span style='font-size:25px; color: green;'>&#10004;</span>
  <span style='font-size:16px;'>&#10140;</span> Retorna erro **500** se der erro ao salvar os dados

-----------------------------------------------------------------------------------------------