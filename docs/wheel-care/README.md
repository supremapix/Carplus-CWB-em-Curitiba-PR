# Conteúdo sobre cuidado com rodas de liga leve

Data: 9 de novembro de 2026. Base: ff20c28dcca177fec4c4e9e3613489ef6242fb45.

## Escopo
- Artigo novo em /blog/rodas-de-liga-leve-riscadas-na-troca-de-pneus, categoria Rodas, com empatia, perguntas úteis, conferência antes/depois, quatro respostas e contato Carplus.
- Bloco na página /troca-de-pneus-curitiba com foto real da oficina e link para o artigo.
- Ajustes nos trechos diretamente relacionados de três artigos antigos para retirar garantia absoluta e não atribuir proteções específicas sem comprovação.
- Home, catálogo, contatos, navegação, rodapé, estilos globais e funções de compartilhamento preservados.

## Fontes e imagens
- Dados da loja: https://www.carpluscwb.com.br/, consultado em 09/11/2026.
- Montagem e inspeção: https://www.michelin.com.br/auto/conselhos/troca-de-pneus/montagem-de-pneus e https://www.conti.com.br/tire-knowledge/fitting-tires/. As fontes descrevem recomendações gerais, não certificam procedimentos da Carplus.
- Imagens existentes /images/galeria/rodas-de-liga-leve.webp e /images/galeria/montagem-tecnica.jpg; variantes otimizadas /images/carplus-real/rodas-de-liga-leve.webp e /images/carplus-real/montagem-tecnica.webp. Pixels inspecionados. Proveniência preexistente em docs/fotos-carplus.json.
- Nenhuma imagem gerada, depoimento inventado, comparação de antes/depois, equipamento novo, serviço de recuperação ou promessa de risco zero.

## Verificações locais
- npm run lint e npm run build: passaram.
- scripts/verify-wheel-care.ts, verify-canonical-ownership.mjs e verify-inner-controls.mjs: passaram.
- Cinco testes de compartilhamento: passaram.
- HTML estático da Home idêntico à base, exceto nomes dos bundles.
- Navegador local não iniciou devido a restrição do ambiente (socket Operation not permitted). Browser remoto não alcançou a porta local. Validação visual remota deve ocorrer no preview/publicação; isso não equivale a um passe de QA visual.
