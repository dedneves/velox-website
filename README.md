# Site do Velox — Vercel

Site estático sem npm, framework, dependência externa, API, fonte remota ou build C na Vercel. HTML/CSS/JS estão em `public/`. Os downloads reais são distribuídos junto com o site; não há links de release fictícios. O browser baixa, mas não executa aplicativos Linux: a página oferece comandos de instalação/execução para copiar.

## Publicar

Se importar o projeto completo por Git, defina **Root Directory = `website`**, **Framework Preset = Other**. O `vercel.json` já define build e instalação vazios e output `public`. Basta Deploy. Se enviar somente o ZIP `build/velox-website-vercel.zip`, extraia o ZIP e use a pasta extraída como raiz do projeto. O build distribuído depende de glibc >= 2.38 e libvterm >= 0.3; em versões mais antigas do Linux use o código-fonte para compilar localmente. Preserve `public/downloads` na importação; os pacotes são parte do site preparado.

Com Vercel CLI já instalada e autenticada, na pasta do projeto:

```sh
cd website
vercel --prod
```

Não foi executado deploy nesta sessão: não há CLI/autenticação Vercel aqui. Referências oficiais: https://vercel.com/docs/builds/configure-a-build e https://vercel.com/docs/project-configuration . Não configure CMake como build da Vercel.

## Rodar localmente

```sh
cd website
python3 -m http.server 8080 --directory public
```

Abra http://localhost:8080 . A página é responsiva; pesquisa ignora acentos, categorias filtram comandos, botões copiam com fallback, tabs de instalação têm teclado e a FAQ usa details nativo. As preferências de movimento reduzido são respeitadas.

## Atualizar artefatos

```sh
packaging/build-deb.sh
python3 website/prepare.py
python3 website/tests.py
python3 website/bundle.py
```

A página inclui quatro capturas reais do Velox 0.3.3: terminal com informações do sistema, configurações integradas, paleta de comandos e menu de clique direito. Foram geradas na sessão gráfica do usuário em 2026-10-04, às 03:43:29 UTC, e inspecionadas visualmente. O hash do executável capturado corresponde ao build Release local. Os downloads são da mesma versão, compilados com MinSizeRel, e têm outro hash. Origem, dimensões e hashes estão em `public/assets/current-capture.json`. A imagem Unicode histórica permanece apenas como arquivo de proveniência, fora do destaque e da galeria.

Para renovar as capturas na sua sessão gráfica X11/XWayland, execute:

```sh
cd ~/velox-terminal
python3 website/capture.py
```

O comando abre uma janela nova do binário Release, usa configuração temporária, executa `commands info` num Bash real e captura terminal, configurações, paleta e menu. Não digite nessa janela durante a captura. O próprio script converte os pixels XWD para PNG sem edição, confere a versão, grava hashes, atualiza a página e o ZIP Vercel. Clipboard e sessão pessoal não são alterados. As imagens vêm da versão real com perfil de captura Ubuntu Inspired; revise visualmente antes de publicar.

São necessários Python 3, X11/XWayland, libXtst e xwd (x11-apps); não usa Pillow nem um gerador de imagens. O formato suportado é XWD TrueColor. A execução gráfica pelo agente continua bloqueada (`FAIL XOpenDisplay failed: capture not executed; run in your graphical session`); as capturas atuais vieram da execução pelo usuário. Os testes verificam conversão sem edição, staging, dimensões e integridade das imagens, além da versão dos downloads e do hash do build Release capturado, quando disponível localmente.

Os testes Python verificam links locais, anchors, comandos, integridade de downloads, estrutura dos pacotes, PNG e configuração Vercel. Se libduktape estiver disponível, exercitam o JS real com DOM controlado (busca, categorias, tabs, clipboard sucesso/falha). Isso não substitui a inspeção visual de browser nem um deploy real.
