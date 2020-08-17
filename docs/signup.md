# Cadastro de uma nova conta

> ## Caso de sucesso

- <span style='font-size:25px; color: green;'>&#10004;</span><span style='font-size:16px;'>&#10140;</span> Recebe uma requisição do tipo **POST** na rota **/api/signup**
- <span style='font-size:25px; color: green;'>&#10004;</span><span style='font-size:16px;'>&#10140;</span> Valida dados obrigatórios **name**, **email**, **password** e **passwordConfirmation**
- <span style='font-size:25px; color: green;'>&#10004;</span><span style='font-size:16px;'>&#10140;</span> Valida que **password** e **passwordConfirmation** são iguais
- <span style='font-size:25px; color: green;'>&#10004;</span><span style='font-size:16px;'>&#10140;</span> Valida que o campo **email** é um e-mail válido
- <span style='font-size:25px; color: green;'>&#10004;</span><span style='font-size:16px;'>&#10140;</span> **Valida** se já existe um usuário com o email fornecido
- <span style='font-size:25px; color: green;'>&#10004;</span><span style='font-size:16px;'>&#10140;</span> Gera uma senha **criptografada** (essa senha não pode ser descriptografada)
- <span style='font-size:25px; color: green;'>&#10004;</span><span style='font-size:16px;'>&#10140;</span> **Cria** uma conta para o usuário com os dados informados, **substituindo** a senha pela senha criptorafada
- <span style='font-size:25px; color: green;'>&#10004;</span><span style='font-size:16px;'>&#10140;</span> Gera um **token** de acesso a partir do ID do usuário
- <span style='font-size:25px; color: green;'>&#10004;</span><span style='font-size:16px;'>&#10140;</span> **Atualizar** os dados do usuário com o token de acesso gerado.
- <span style='font-size:25px; color: green;'>&#10004;</span><span style='font-size:16px;'>&#10140;</span> Retorna **200** com o token de acesso e id do usuário
> ## Exceções


- <span style='font-size:25px; color: green;'>&#10004;</span><span style='font-size:16px;'>&#10140;</span> Retorna erro **404** se a API não existir
- <span style='font-size:25px; color: green;'>&#10004;</span><span style='font-size:16px;'>&#10140;</span> Retorna erro **400** se name, email, password ou passwordConfirmation não forem fornecidos pelo client
- <span style='font-size:25px; color: green;'>&#10004;</span><span style='font-size:16px;'>&#10140;</span> Retorna erro **400** se password e passwordConfirmation não forem iguais
- <span style='font-size:25px; color: green;'>&#10004;</span><span style='font-size:16px;'>&#10140;</span> Retorna erro **400** se o campo email for um e-mail inválido
- <span style='font-size:25px; color: green;'>&#10004;</span><span style='font-size:16px;'>&#10140;</span> Retorna erro **403** se o email fornecido já estiver em uso
- <span style='font-size:25px; color: green;'>&#10004;</span><span style='font-size:16px;'>&#10140;</span> Retorna erro **500** se der erro ao tentar gerar uma senha criptografada
- <span style='font-size:25px; color: green;'>&#10004;</span><span style='font-size:16px;'>&#10140;</span> Retorna erro **500** se der erro ao tentar criar a conta do usuário
- <span style='font-size:25px; color: green;'>&#10004;</span><span style='font-size:16px;'>&#10140;</span> Retorna erro **500** se der erro ao tentar gerar o token de acesso
- <span style='font-size:25px; color: green;'>&#10004;</span><span style='font-size:16px;'>&#10140;</span> Retorna erro **500** se der erro ao tentar atualizar o usuário com o token de acesso gerad