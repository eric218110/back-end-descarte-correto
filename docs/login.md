
# Login com email e password

> ## Caso de sucesso

- <span style='font-size:25px; color: green;'>&#10004;</span><span style='font-size:16px;'>&#10140;</span> Recebe uma requisição do tipo **POST** na rota **/api/login**
- <span style='font-size:25px; color: green;'>&#10004;</span><span style='font-size:16px;'>&#10140;</span> Valida dados obrigatórios **email** e **password**
- <span style='font-size:25px; color: green;'>&#10004;</span><span style='font-size:16px;'>&#10140;</span> Valida que o campo **email** é um e-mail válido
- <span style='font-size:25px; color: green;'>&#10004;</span><span style='font-size:16px;'>&#10140;</span> **Busca** o usuário com o email e senha fornecidos
- <span style='font-size:25px; color: green;'>&#10004;</span><span style='font-size:16px;'>&#10140;</span> Gera um **token** de acesso a partir do ID do usuário
- <span style='font-size:25px; color: green;'>&#10004;</span><span style='font-size:16px;'>&#10140;</span> **Atualiza** os dados do usuário com o token de acesso gerado
- <span style='font-size:25px; color: green;'>&#10004;</span><span style='font-size:16px;'>&#10140;</span> Retorna **200** com o token de acesso, id do usuário

> ## Exceções

- <span style='font-size:25px; color: green;'>&#10004;</span><span style='font-size:16px;'>&#10140;</span> Retorna erro **404** se a API não existir
- <span style='font-size:25px; color: green;'>&#10004;</span><span style='font-size:16px;'>&#10140;</span> Retorna erro **400** se email ou password não forem fornecidos pelo client
- <span style='font-size:25px; color: green;'>&#10004;</span><span style='font-size:16px;'>&#10140;</span> Retorna erro **400** se o campo email for um e-mail inválido
- <span style='font-size:25px; color: green;'>&#10004;</span><span style='font-size:16px;'>&#10140;</span> Retorna erro **401** se não encontrar um usuário com os dados fornecidos
- <span style='font-size:25px; color: green;'>&#10004;</span><span style='font-size:16px;'>&#10140;</span> Retorna erro **500** se der erro ao tentar gerar o token de acesso
- <span style='font-size:25px; color: green;'>&#10004;</span><span style='font-size:16px;'>&#10140;</span> Retorna erro **500** se der erro ao tentar atualizar o usuário com o token de acesso gerado

-----------------------------------------------------------------------------------------------