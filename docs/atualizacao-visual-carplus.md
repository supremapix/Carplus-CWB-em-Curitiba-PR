# Atualização visual Carplus

## Escopo

A interface do site principal segue a identidade da landing page da Carplus: preto predominante (`#080808`), amarelo da marca (`#f59c00`), branco e cinzas. As áreas das fotos de pneus permanecem brancas para integrar as imagens aos cards. O cabeçalho, o menu móvel, o rodapé e os detalhes de produtos foram refinados para facilitar a leitura e a navegação.

O WhatsApp é a principal ação para consultar aplicação, preço e disponibilidade. O catálogo e os caminhos por marca, aro e veículo continuam disponíveis. Campos de orientação são opcionais; a mensagem pode ser revisada no WhatsApp antes do envio.

## Home e caminhos de busca

A abertura destaca “Pneus Prinx para elétricos e híbridos”, com a arte enviada pelo usuário em WebP de 1731 × 909 px. A mensagem pede carro e ano para conferir medida, aplicação e orçamento. O WhatsApp oficial `(41) 3082-7282` é a ação principal; “Encontrar meu pneu” leva ao buscador. O atalho flutuante de WhatsApp se recolhe enquanto o CTA da abertura ou o rodapé está visível e volta a observar esses elementos quando a rota muda.

A home apresenta um buscador real imediatamente após a abertura. `HomeTireSearch` fica em `#finder`, com o alvo `#catalog` e as referências de rolagem conectados ao conteúdo. O visitante pode pesquisar medida, marca ou carro, abrir todos os pneus ou pedir ajuda pelo WhatsApp quando não souber a medida.

O envio da busca abre `TireCatalogView` em `/pneus` com o termo informado. Os atalhos de marca da home e os atalhos de marca ou aro das páginas de conteúdo usam esse mesmo catálogo. Cada nova entrada redefine os filtros anteriores de marca, aro e categoria; “Ver todos os pneus” também limpa o termo de busca. Na revisão em navegador desta rodada, os caminhos por Linglong e pela medida `205/55 R16` abriram resultados e não mantiveram o filtro da consulta anterior.

Depois do buscador aparecem os produtos em destaque e a comparação por marcas. Em celulares com largura de até 639 px, são exibidos dois destaques; no computador, quatro. Todos continuam disponíveis no catálogo. A orientação de escolha vem em seguida, com o FAQ disponível e os campos opcionais dentro de um bloco expansível. Avaliações, serviços e perguntas institucionais ficam reunidos em “Avaliações, serviços e informações da loja”. A galeria principal mostra três fotos. Os antigos painéis de ofertas, hubs e filtros da home foram retirados da composição visual; os dados, as páginas e os caminhos do catálogo permanecem disponíveis.

## Logos, fotos e ações

As oito logos da faixa de marcas são PNGs servidos localmente em `public/images/brands/`: Michelin, Continental, XBRI, Bridgestone, Pirelli, Goodyear, Linglong e Firestone. Elas aparecem sobre áreas brancas, com as cores originais, sem filtro de clareamento ou redução de opacidade. Cada logo abre a marca correspondente no catálogo e conserva um endereço de link próprio.

Fotos reais da estrutura da Carplus aparecem nos fundos do buscador e da orientação, na galeria e no rodapé. As imagens conservam suas cores; camadas escuras mantêm o preto predominante e a leitura do texto. A galeria principal traz três fotos maiores com legendas fora da imagem. No rodapé, a foto real recebe uma camada preta de 80%. As fotos de pneus continuam em superfícies brancas.

## Fotos reais e descrições

A auditoria separou fotos institucionais das imagens de produtos e logos. Os 16 originais reais da galeria foram comparados com os arquivos públicos de `www.carpluscwb.com.br`: seus hashes SHA256 coincidem e os arquivos originais permanecem intactos. O registro de origem, assunto visível, dimensões e hashes está em [fotos-carplus.json](fotos-carplus.json). Novas variantes WebP em `public/images/carplus-real/` reduzem o peso de exibição sem ampliar as fotos.

Quatorze arquivos de galeria que continham imagens genéricas recebem fotos reais adequadas, mantendo os endereços, extensões e dimensões anteriores. Isso também corrige nomes que não correspondiam ao conteúdo: `alinhamento-jeep.webp`, por exemplo, mostrava um BMW azul em uma paisagem. A substituição conserva as URLs utilizadas em páginas e dados existentes.

| Arquivos substituídos | Assunto da foto real aplicada |
| --- | --- |
| `alinhamento-jeep.webp`, `jeep-compass.webp` | Jeep Compass na rampa de alinhamento |
| `montagem-pneu.webp`, `troca-pneu.webp`, `proprietario-pneu.webp` | Trabalho com pneus e equipamentos na oficina |
| `rodas-pretas.webp`, `oficina-carros.webp` | Rodas, pneus e equipamentos no interior da oficina |
| `caminhonete.webp` | SUVs suspensos no interior da Carplus |
| `fachada-logo.webp` | Fachada e identificação Carplus |
| `display-pneus.webp` | Pneus Prinx expostos na loja |
| `mecanico-motor.webp`, `mecanicos-trabalho.webp` | Pessoas e veículos em serviço na oficina |
| `escritorio.webp`, `loja-de-pneus-portao-curitiba-pirelli.png` | Área de atendimento e exposição de pneus |

As 16 descrições `imageAlt` dos artigos foram corrigidas para descrever a foto exibida. Foram removidas alegações que as imagens não demonstravam, como instalação de pneus elétricos, menor preço, inspeção de freios, óleo ou leitura de TWI. Os 16 campos `featuredImage` e todos os demais dados dos artigos continuam iguais. Fotos de catálogo, logos de fabricantes e as imagens específicas de produtos permanecem fora da substituição institucional.

Os seis arquivos legados em `public/images/quemsomos/` não têm referências nos componentes atuais. Cinco correspondem à sessão real da Carplus; `vistoria-alinhamento.jpg` mostra apenas um detalhe de freio e não permite confirmar o local ou a autoria pela imagem. Esse arquivo permanece sem uso e sem alegação de origem. Os endereços antigos não foram removidos.

Os CTAs marcados com `carplus-action-primary` e `carplus-action-secondary` usam dois níveis: amarelo com texto escuro para a ação principal e fundo escuro com contorno e texto claro para a ação de apoio. A fonte compartilhada é de 16 px no computador e no celular, com alvos de pelo menos 52 px de altura. O padrão abrange os CTAs da abertura, busca da home, orientação, localização e rodapé. Menus, filtros, links de marcas e controles internos do catálogo mantêm seus estilos próprios; a alteração não substitui todos os controles do site por um único tipo de botão.

## Conteúdo e FAQ

O guia de escolha apresenta três caminhos: marca, veículo e elétrico ou híbrido. O conteúdo orienta a conferência de modelo, versão, medida, índices e recomendação do fabricante, sem um ranking absoluto de marcas ou medidas presumidas.

`src/data/tireAdvice.ts` compartilha `FAQ_ADVICE` e `TIRE_ADVICE_SCHEMA` entre a interface React e a geração de HTML. O JSON-LD fica junto da seção de orientação: o HTML inicial contém o FAQ, e a versão React o remove quando a navegação sai da home. Ele não fica fixo no cabeçalho de outras páginas.

## Prévia social e compartilhamento

A home usa a arte enviada pelo usuário, “Nova Energia, Mesma Confiança”, exportada em PNG de 1200 × 630 px com Carplus, Prinx e pneus para elétricos e híbridos. O endereço absoluto da imagem é `https://www.carpluspneuseoficina.com.br/images/social/carplus-prinx-nova-energia-og.png`. As constantes de imagem, título, descrição e texto alternativo ficam em `src/lib/socialPreview.ts`.

O HTML inicial contém as tags Open Graph e Twitter completas, para leitura por serviços de compartilhamento sem executar JavaScript. O título e a descrição sociais destacam os pneus Prinx para elétricos e híbridos; o título, a descrição e a canônica de SEO da home permanecem iguais. As páginas secundárias conservam seus metadados anteriores, e a renderização React mantém as prévias próprias de produtos e artigos.

As tags sociais estáticas recebem apenas o marcador `data-carplus-social-fallback`. A aplicação remove esse conjunto antes de iniciar o React e passa a renderizar os metadados da página atual. Isso evita tags duplicadas e impede que a prévia de elétricos da home permaneça durante a navegação para um produto ou outra página.

O rodapé oferece envio pelo WhatsApp, cópia do link e compartilhamento nativo quando disponível. Se a cópia automática não estiver disponível, um campo permite selecionar o endereço manualmente. O compartilhamento usa o endereço da página atual e registra o evento `share`; o listener de contato ignora somente elementos com `data-share-channel`, evitando contabilizar uma indicação do site como um pedido de orçamento.

## Preservação

A referência de comparação é o commit `dc2773f4824d871f8e2b1f21dfed23f4c6d1e206`.

O inventário de referência contém 602 arquivos HTML gerados, 278 URLs indexáveis e 199 redirecionamentos. A verificação compara as rotas, os dados existentes, as canônicas, os metadados, os sitemaps, as regras de indexação, os redirecionamentos e as identificações de analytics com essa referência. A adição do FAQ na home, o ajuste de inicialização de rotas, a prévia social da home e as 16 descrições factuais das fotos dos artigos são exceções explícitas e restritas.

O GA4 do site principal é `G-7SM4151YFR`. As identificações de GA4/GTM da landing page de pneus para elétricos não foram importadas para este site. O atributo `data-analytics-url` mantém o evento de consulta do guia sem incluir os valores digitados na URL enviada pelo listener de analytics da aplicação.

## Verificação

Execute a partir da raiz do repositório:

```text
npm run lint
npm run build
node scripts/verify-preservation.mjs --base dc2773f4824d871f8e2b1f21dfed23f4c6d1e206 --allow-home-advice --allow-route-startup-fix --allow-social-preview --allow-real-photos
node scripts/verify-route-startup.mjs
node scripts/verify-social-preview.mjs --base dc2773f4824d871f8e2b1f21dfed23f4c6d1e206
```

`--allow-home-advice` permite somente o acréscimo do guia/FAQ e a higienização do evento de consulta. `--allow-route-startup-fix` permite somente as alterações específicas de estado e sincronização necessárias para manter a URL solicitada na inicialização e evitar uma seleção de catálogo antiga na navegação. `--allow-social-preview` permite apenas os valores sociais definidos para a home, seus marcadores de substituição, as alterações exatas de prévia em `EnhancedSEO` e o bloqueio específico de links de compartilhamento no listener de contato. Os metadados das páginas secundárias e as demais regras de preservação continuam ativos.

`--allow-real-photos` aceita somente o literal `imageAlt` aprovado para cada um dos 16 IDs originais dos artigos, associado ao mesmo `featuredImage`. Todo o restante do arquivo é comparado por hash. Controles negativos verificaram que alterações de ID, URL da foto, título, alt não aprovado, propriedade duplicada ou qualquer outro conteúdo continuam sendo rejeitadas, tanto contra `dc2773f` quanto contra `474faa8`.

`verify-route-startup.mjs` passou para a versão revisada do aplicativo. Ele verifica 12 URLs diretas com StrictMode e agrupamento de atualizações de estado, seleção entre produtos, saídas de produto para serviços/contato/home, histórico e delegação dos links do rodapé. Controles negativos reproduzem os problemas quando o bloqueio inicial ou a limpeza de seleção são retirados. O teste simula o ciclo de estado; a revisão visual em navegador complementa essa verificação.

`verify-social-preview.mjs` verifica o HTML que um crawler recebe sem JavaScript, a presença única das tags sociais, o PNG de 1200 × 630 px e a ausência da campanha da home nos outros 601 arquivos HTML. Ele também executa 51 casos de metadados React contra a referência, incluindo produtos, artigos, catálogo e páginas locais, além da remoção restrita dos metadados estáticos antes de iniciar a aplicação.

Após o build final, execute novamente a preservação com as quatro opções acima. A revisão em navegador inclui menu móvel, FAQ, ações de consulta, compartilhamento e exibição em computador e celular. Os testes da prévia verificam os arquivos locais de publicação; a leitura da nova prévia por serviços externos depende da publicação desses arquivos e da atualização do cache desses serviços.

Na rodada de simplificação da home, a revisão de fontes confirmou os novos alvos de rolagem, os caminhos para o catálogo e os atributos estáticos de analytics dos links de orientação. A revisão em navegador informou ausência de falhas no teste de contraste do estado inicialmente aberto. Conteúdo recolhido, estados de foco e interações também precisam ser considerados na revisão visual; o novo build deve passar novamente pelos dois verificadores antes da publicação.

Na rodada final de fotos reais, nova arte e simplificação do blog, as quatro execuções após o build passaram com código zero: preservação contra `dc2773f` e `474faa8` com as quatro opções, inicialização de rotas e prévia social. Foram preservados os 36 arquivos protegidos, os 602 HTML, os 1.919 registros de pneus, os 199 redirecionamentos, os inventários de sitemap e o GA4 `G-7SM4151YFR`. O teste social confirmou o novo PNG de 1200 × 630 px, a separação dos 601 HTML secundários e os 51 casos de metadados React. Os 16 originais reais, 16 variantes e 14 substituições também passaram na comparação independente de SHA256 e tamanho com o registro de origem.

## Publicação

O build produz os arquivos em `dist/`. A existência de um commit, pull request ou build local não confirma uma publicação no servidor externo. Esta atualização preserva os mecanismos técnicos verificados; não garante posições de busca nem volume de tráfego.
