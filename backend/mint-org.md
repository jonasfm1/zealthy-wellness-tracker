app.py: Exato. É o ponto de ignição (entry point) da API. Ele não "escreve" a lógica das rotas dentro dele, mas registra os pacotes de rotas, aplica o CORS para autorizar a comunicação com o Next.js e inicializa a conexão com o banco carregando as regras do config.py.

config.py: Correto. É o escudo do projeto. Ele captura as variáveis de ambiente (URL do banco e a chave secreta JWT) para o servidor usar, garantindo que senhas reais nunca fiquem escritas em texto no código-fonte.

models.py: Exato. É o mapeamento objeto-relacional (ORM). Ele transforma as classes Python automaticamente em tabelas estruturadas no banco de dados, configurando as chaves estrangeiras e a regra de exclusão em cascata.

routes/auth_bp.py: Funciona como a portaria do sistema. Ele recebe o e-mail e senha, aplica a criptografia e, se tudo estiver certo, gera e assina digitalmente o Token JWT (o crachá de acesso do usuário).

routes/wellness_bp.py: É o cofre das métricas de saúde. É aqui que ocorre a interceptação: o decorador @token_required barra qualquer pedido que não tenha um "crachá" JWT válido. Se validado, ele permite salvar ou buscar a água, nutrição, exercícios e o diário.

routes/external_bp.py: Atua como um proxy limpo. Em vez de o front-end bater diretamente na API de avaliação da Zealthy, ele pede para este arquivo no nosso servidor Flask fazer o trabalho silenciosamente e devolver os dados de sono e passos prontos.

seed.py: É um injetor tático de dados. Um script executado apenas uma vez para forjar a conta da Alice e popular o banco com o histórico retroativo de 3 dias, permitindo que a gente já tenha dados reais para renderizar os gráficos sem precisar preencher na mão.