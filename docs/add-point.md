# Cadastro de um novo ponto de coleta

> ## Caso de sucesso

01. ❌ Recebe uma requisição do tipo **POST** na rota **/api/points**
02. ❌ Ser acessada apenas por usuários logado, com token valido (middleware pattern PROXY)
03. ❌ Receber file image (middleware pattern PROXY - multer)
04. ❌ Definir uma imagem padrão se a imagem não for informada
05. ❌ Receber os dados via body **name**, **latitude**, **longitude**, **city**, **state**, **items**, **email**, **whatsapp**
06. ❌ Valida dados obrigatórios **name**, **latitude**, **longitude**, **city**, **state**, e **items**
07. ❌ Além dos dados obrigatórios aceitar também os dados **image**, **whatsapp**
08. ❌ Receber arquivo de image no campo **image** e realizar upload em algum serviço de storage
09. ❌ Retorna **200** ao salvar o objeto corretamente

> ## Exceções

01. ❌ Retorna erro **404** se a API não existir
02. ❌ Retorna erro **403** se o usuário estiver logado
03. ❌ Retorna erro **500** se der erro ao tentar criar a um novo ponto de coleta