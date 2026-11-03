# Ampliação de linhas para consulta — 03/11/2026

O catálogo e os filtros por marca passam a apresentar 29 linhas adicionais para consulta em 14 marcas. Cinco linhas recebem destaque para elétricos: Michelin e.Primacy, Pilot Sport EV e Primacy 5, mais Prinx XLAB COMFORT EV e XNEX SPORT EV já existentes. As duas linhas Prinx não foram duplicadas no cadastro. Primacy 5 e e.Primacy não são apresentadas como exclusivas para elétricos.

As referências são editoriais: não são novos SKUs, ofertas ou promessas de fornecimento. Cada cartão informa “Linha sob consulta”, apresenta fonte e inicia uma consulta à Carplus com marca/modelo. Não foram criados preços, medidas, índices, imagens ou associações com carros. Referências internacionais estão identificadas e não comprovam comercialização no Brasil.

## Inventário e escolha

O arquivo `inventory.json` documenta os 1.939 registros (1.919 JSON + 20 promoções) e 20 marcas antes da ampliação. Os agrupamentos usam a linha cadastrada e consolidam grafias e marcadores de variantes; não contam medidas, veículos ou XL/run-flat como novos modelos. Famílias genéricas antigas, como EfficientGrip, Wrangler e PremiumContact, podem conter modelos distintos: os totais são conservadores, não uma alegação de contagem exaustiva. Os nomes completos Goodyear foram conferidos para não cadastrar novamente EfficientGrip Performance ou EfficientGrip SUV.

As onze marcas com uma linha eram Comforser, Hifly, JK Tyre, Linglong, Maxtrek, Provato, Roadking, Speedmax, Tornel, XBRI e ZMAX. Michelin, Goodyear e Yokohama também receberam novas opções. Os contadores fixos antigos foram substituídos por contagens reais de registros em `catalogCounts.json`, separadas da contagem de linhas.

## Fontes e comparação

Todas as URLs por linha estão em `src/data/consultationLines.ts` e visíveis nos cartões. Foram consultadas páginas Michelin Brasil, Goodyear Brasil, Prinx Brasil, lojas oficiais XBRI/Linglong/Speedmax, Roadking Brasil e catálogos internacionais Hifly, JK Tyre, Maxtrek, Tornel e Yokohama.

Para Comforser CF1100 e ZMAX ZEALION, a evidência primária acessível foi o registro público EPREL, identificado como tal. Para Provato GREEN e SPORT GREEN, foi usado o registro público Inmetro 003057/2020. Esses links somente documentam o nome da linha: não se atribuiu certificação a um SKU da loja. A fonte do fabricante Comforser não pôde ser lida (403), e os resultados Maxtrek/Tornel foram confirmados no índice de busca das páginas oficiais, com falha na leitura direta. Essas limitações impedem afirmações técnicas adicionais.

Comparação de nomes, sem reutilização de descrições ou fotos:

- [Guaporé — Yokohama](https://www.guaporepneus.com.br/loja/busca.php?avancada=1&filtrar_marca=Yokohama&loja=1411063&marca=Yokohama&palavra_busca=&pg=10): V107 e G058 aparecem em várias medidas; cada um é uma linha, não vários modelos.
- [Guaporé — XBRI](https://www.guaporepneus.com.br/xbri): variedade de famílias muito maior que o único Fastway A5 cadastrado. A seleção final XBRI usa a loja oficial como fonte.
- [AS Pneus — Provato](https://www.aspneus.com.br/marca/provato-43): GREEN e SPORT GREEN; disponibilidade do concorrente não foi transferida para a Carplus.
- [Lemans — ZMAX](https://www.lemansrodas.com.br/pneus/passeio/aro-17/pneu-zmax-aro-17-19540r17-zealion-81w-xl): ZEALION confirmado também no EPREL.
- [Tyreforce — Comforser](https://www.tyreforce.com.au/tyre-brands/comforser/): CF1100 aparece em diferentes medidas; a seleção usa a evidência pública EPREL, sem importar medidas ou condições comerciais.

## Preservação e validação

Vinculação confirmada pelo `DOMAIN` do gerador, canonicals em `EnhancedSEO.tsx`, domínio público e os mesmos nome/endereço/telefone da loja. Base: `1d954c2465dd8a56e99f0a16c4b318057f0e1f08`.

- `npm run lint` e `npm run build`: compilação TypeScript e geração de 2.557 páginas estáticas.
- `node --import tsx scripts/verify-catalog-expansion.tsx`: preserva catálogo, preços, produtos, índices, imagens, rodapé, App, SEO, rotas e redirecionamentos; testa contagens, fontes, busca e cinco referências EV explícitas.
- `node scripts/verify-catalog-browser.cjs`: Chrome, 1440px e 390px; filtros Michelin/XBRI, cinco destaques EV, destino WhatsApp, ausência de overflow e de erros JavaScript. Capturas na pasta `screenshots`.
- `node --import tsx scripts/verify-tire-illustrations.tsx`: passou para os 1.939 registros, incluindo avisos de IA e falhas de imagem. O teste antigo `verify-tire-image-safety.tsx` encontrou diferença CRLF/LF do checkout Windows na comparação textual; o teste específico desta alteração normaliza quebras de linha e confirma preservação.

O conteúdo adicionado aparece no HTML estático de `/pneus` e `/pneus-eletricos-curitiba`. Metadados e política atual de canonicals dos filtros foram preservados; esta entrega não tenta resolver a investigação separada de URLs antigas. Nenhum redirecionamento foi alterado.

## Integração

Trabalho isolado na branch `codex/catalogo-marcas-eletricos`. Não altera `Footer.tsx`. O gerador `scripts/build-seo.ts` recebe apenas importação e inserção da seleção de linhas no catálogo; uma alteração paralela no rodapé desse gerador deve ser mantida. Reler `main` antes de integrar e coordenar a publicação com a tarefa do rodapé. Não houve alteração de DNS, credenciais ou segurança.

Pendências comerciais: confirmar quais linhas/medidas efetivamente podem ser fornecidas, preços, prazos e aplicação com a loja antes de convertê-las em produtos/ofertas. Os índices inconsistentes já existentes em alguns Prinx EV foram mantidos para não misturar uma correção técnica sem revisão SKU a SKU com esta ampliação editorial.
