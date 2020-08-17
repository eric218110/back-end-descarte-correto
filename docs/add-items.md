
# Items

> ## Caso de sucesso

01. ❌ Recebe uma requisição do tipo **POST** na rota **/api/items**
02. ❌ Ser acessada apenas por usuários **admin**, com token valido (middleware pattern PROXY)
03. ❌ Receber file image (middleware pattern PROXY - multer)
05. ❌ Receber os dados via body **title**, **image**
06. ❌ Valida dados obrigatórios **title**, **image**
08. ❌ Receber arquivo de image no campo **image** e realizar upload em algum serviço de storage
09. ❌ Retorna **201** `created` e o objeto, ao salvar o objeto corretamente

> ## Exceções

01. ❌ Retorna erro **404** se a API não existir
02. ❌ Retorna erro **401** se o token estiver expirado, mal formatado ou invalido
02. ❌ Retorna erro **401** se o usuário não estiver logado
02. ❌ Retorna erro **403** se o usuário estiver logado e não for `admin`
03. ❌ Retorna erro **500** se der erro ao salvar os dados

-----------------------------------------------------------------------------------------------