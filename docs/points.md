# Cadastro de um novo ponto de coleta

> ## Caso de sucesso

01. ❌ Recebe uma requisição do tipo **POST** na rota **/api/points**
02. ❌ Receber os dados via body **token**, **name**, **latitude**, **longitude**, **city**, **state**, **items**, **image**, **email**, **whatsapp**
03. ❌ Valida dados obrigatórios **token**, **name**, **latitude**, **longitude**, **city**, **state**, e **items**
04. ❌ Além dos dados obrigatórios aceitar também os dados **image**, **whatsapp**
05. ❌ Valida que o campo **token** é um token válido, não expirado e formatado corretamente
07. ❌ Receber arquivo de image no campo **image** e realizar upload em algum serviço de storage
10. ❌ Retorna **200** ao salvar o objeto corretamente

> ## Exceções

01. ❌ Retorna erro **404** se a API não existir
02. ❌ Retorna erro **401** se **token** estiver invalido, expirado ou mal formatado
07. ❌ Retorna erro **500** se der erro ao tentar criar a um novo ponto de coleta