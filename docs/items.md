
# Items

> ## Caso de sucesso

1. ❌ Recebe uma requisição do tipo **GET** na rota **/api/items**
2. ❌ validar se o **token** recebido via header é valido e não está expirado
3. ❌ validar se o **id** recebido via header é valido
4. ❌ Retorna **200** com o itens

> ## Exceções

1. ❌ Retorna erro **404** se a API não existir
3. ❌ Retorna erro **401** se o campo token for um token expirado, invalido ou inexistente
4. ❌ Retorna erro **401** se não encontrar um usuário com id fornecidos
5. ❌ Retorna erro **500** se der erro ao tentar retornar os dados

-----------------------------------------------------------------------------------------------