# Cadastro de um novo ponto de coleta

> ## Caso de sucesso

- [ ❌ ] - Recebe uma requisição do tipo **POST** na rota **/api/points**
- [ ❌ ] - Ser acessada apenas por usuários logado, com token valido (middleware pattern PROXY)
- [ ❌ ] - Receber file image (middleware pattern PROXY - multer)
- [ ❌ ] - Definir uma imagem padrão se a imagem não for informada
- [ ❌ ] - Receber os dados via body **name**, **latitude**, **longitude**, **city**, **state**, **items**, **email**, **whatsapp**
- [ ❌ ] - Valida dados obrigatórios **name**, **latitude**, **longitude**, **city**, **state**, e **items**
- [ ❌ ] - Além dos dados obrigatórios aceitar também os dados **image**, **whatsapp**
- [ ❌ ] - Receber arquivo de image no campo **image** e realizar upload em algum serviço de storage
- [ ❌ ] - Retorna **201** `created` ao salvar o objeto corretamente

> ## Exceções

- [ ❌ ] - Retorna erro **404** se a API não existir
- [ ❌ ] - Retorna erro **403** se o usuário estiver logado
- [ ❌ ] - Retorna erro **401** se o token estiver expirado, mal formatado ou invalido
- [ ❌ ] - Retorna erro **500** se der erro ao tentar criar a um novo ponto de coleta