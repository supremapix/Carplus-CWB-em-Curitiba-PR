import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';
import prerender from './scripts/vite-plugin-prerender';

export default defineConfig(({ command }) => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      ...(command === 'build'
        ? [
            prerender({
              staticDir: path.join(__dirname, 'dist'),
              routes: [
                '/',
                '/pneus',
                '/servicos',
                '/quem-somos',
                '/contato',
                '/faq',
                '/como-chegar',
                '/pneus-curitiba',
                '/pneu-aro-13',
                '/pneu-aro-14',
                '/pneu-aro-15',
                '/pneu-aro-16',
                '/pneu-aro-17',
                '/pneu-aro-18',
                '/bairro/portao',
                '/bairro/agua-verde',
                '/bairro/santa-quiteria',
                '/bairro/novo-mundo',
                '/bairro/fazendinha',
                '/bairro/vila-izabel',
                '/bairro/campo-comprido',
                '/bairro/capao-raso',
                '/bairro/xaxim',
                '/bairro/pinheirinho',
                '/bairro/campo-de-santana',
                '/bairro/sao-braz',
                '/bairro/butiatuvinha',
                '/blog',
                '/blog/pneus-para-carro-eletrico-o-que-muda-quanto-duram-como-escolher',
                '/blog/posso-usar-pneu-comum-no-meu-carro-eletrico-ou-hibrido',
                '/blog/duvidas-sobre-pneus-quando-trocar-twi-validade-calibragem-rodizio',
                '/blog/auto-center-em-curitiba-como-escolher-oficina-de-pneus-de-confianca',
                '/blog/pneus-em-curitiba-guia-completo-comprar-pneus-novos-com-instalacao'
              ],
              renderer: '@prerenderer/renderer-puppeteer'
            })
          ]
        : [])
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
