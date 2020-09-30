# Cadastro de um novo ponto de coleta

> ## Caso de sucesso

- <span style='font-size:25px; color: green;'>&#10004;</span>
  <span style='font-size:16px;'>&#10140;</span> Recebe uma requisição do tipo **POST** na rota **/api/points**
- <span style='font-size:25px; color: green;'>&#10004;</span>
  <span style='font-size:16px;'>&#10140;</span> Ser acessada apenas por usuários logado, com token valido (middleware pattern PROXY) - **user** in Middleware ou admins
- <span style='font-size:25px; color: green;'>&#10004;</span>
  <span style='font-size:16px;'>&#10140;</span> Receber file image (middleware pattern PROXY - multer)
- <span style='font-size:15px;'>&#10060;</span>
  <span style='font-size:16px;'>&#10140;</span> Definir uma imagem padrão se a imagem não for informada
- <span style='font-size:25px; color: green;'>&#10004;</span>
  <span style='font-size:16px;'>&#10140;</span> Receber os dados via body **name**, **latitude**, **longitude**, **city**, **state**, **items**, **email**, **image**
- <span style='font-size:25px; color: green;'>&#10004;</span>
  <span style='font-size:16px;'>&#10140;</span> Valida dados obrigatórios **name**, **latitude**, **longitude**, **city**, **state**, e **items**
- <span style='font-size:25px; color: green;'>&#10004;</span>
  <span style='font-size:16px;'>&#10140;</span> Além dos dados obrigatórios aceitar também os dados **image**
- <span style='font-size:25px; color: green;'>&#10004;</span>
  <span style='font-size:16px;'>&#10140;</span> Receber arquivo de image no campo **image** e realizar upload em algum serviço de storage
- <span style='font-size:25px; color: green;'>&#10004;</span>
  <span style='font-size:16px;'>&#10140;</span> Retorna **204** `created` ao salvar o objeto corretamente
- <span style='font-size:25px; color: green;'>&#10004;</span>
  <span style='font-size:16px;'>&#10140;</span> Receber os items em formato de string concatenado com '`,`' e converter em um `Array`
- <span style='font-size:15px;'>&#10060;</span>
  <span style='font-size:16px;'>&#10140;</span> Validar se já existe um ponto no local informado

> ## Exceções

- <span style='font-size:25px; color: green;'>&#10004;</span>
  <span style='font-size:16px;'>&#10140;</span> Retorna erro **404** se a API não existir
- <span style='font-size:25px; color: green;'>&#10004;</span>
  <span style='font-size:16px;'>&#10140;</span> Retorna erro **403** se o usuário estiver logado
- <span style='font-size:15px;'>&#10060;</span>
  <span style='font-size:16px;'>&#10140;</span> Retorna erro **400** se o item informado não for um uuid
- <span style='font-size:15px;'>&#10060;</span>
  <span style='font-size:16px;'>&#10140;</span> Retorna erro **400** `Point already exist` if já existir um ponto no mesmo local informado
- <span style='font-size:25px; color: green;'>&#10004;</span>
  <span style='font-size:16px;'>&#10140;</span> Retorna erro **403** se o usuário estiver logado
- <span style='font-size:25px; color: green;'>&#10004;</span>
  <span style='font-size:16px;'>&#10140;</span> Retornar erro **401** se o token estiver expirado, mal formatado ou invalido
- <span style='font-size:25px; color: green;'>&#10004;</span>
  <span style='font-size:16px;'>&#10140;</span> Retornar **400** se não for encontrado um ou mais items informados
- <span style='font-size:25px; color: green;'>&#10004;</span>
  <span style='font-size:16px;'>&#10140;</span> Retorna erro **500** se der erro ao tentar criar a um novo ponto de coleta