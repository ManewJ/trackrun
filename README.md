# TrackRun

> Plataforma de comunicação entre atletas e treinadores — nascida de uma dor real.

![TrackRun - Fase 1](./trackrun-fase1.png)

---

## O problema

Quem treina com orientação sabe como é: atualizações de treino pelo WhatsApp, feedbacks perdidos no meio de outras mensagens, sem histórico organizado, sem estrutura. O **TrackRun** nasceu dessa frustração — a necessidade de um canal direto, limpo e focado entre atleta e treinador.

---

## Sobre o projeto

O TrackRun é desenvolvido de forma iterativa, evoluindo como um produto real ao longo de três fases:

### ✅ Fase 1 — Interface e registro de treino
Interface de registro de sessões de corrida com identidade visual própria, animações fluidas e foco em UX. Construída inteiramente no front-end.

**Inclui:**
- Layout split-screen com painel visual e formulário
- Barra de progresso dinâmica
- Tags de sensação com ícones interativos
- Animações com Motion (Framer Motion)
- Design responsivo (mobile-first ao final da fase)

### 🔄 Fase 2 — Autenticação e feed do atleta *(em desenvolvimento)*
Integração com banco de dados real, autenticação de usuários e feed de treinos com possibilidade de feedback do treinador.

**Inclui:**
- Autenticação com Supabase Auth
- Banco de dados PostgreSQL via Supabase
- Feed de treinos do atleta
- Sistema de feedback do treinador

### 🔜 Fase 3 — Ecossistema completo *(planejado)*
Visão completa do produto: painel do treinador, histórico de evolução, notificações e comunicação estruturada entre atleta e profissional.

---

## Stack

| Tecnologia | Uso |
|---|---|
| React + Vite | Interface e estrutura do projeto |
| Tailwind CSS | Estilização utilitária |
| Motion | Animações e transições |
| Lucide React | Ícones |
| Supabase | Autenticação, banco de dados (PostgreSQL) e storage |

---

## Como rodar localmente

```bash
# Clone o repositório
git clone https://github.com/ManewJ/trackrun.git

# Entre na pasta
cd trackrun

# Instale as dependências
npm install

# Configure as variáveis de ambiente
# Crie um arquivo .env.local na raiz com:
# VITE_SUPABASE_URL=sua_url_aqui
# VITE_SUPABASE_KEY=sua_chave_aqui

# Rode o projeto
npm run dev
```

> **Nota:** Para rodar a Fase 2 completa, é necessário ter um projeto no [Supabase](https://supabase.com) configurado com as tabelas `profiles`, `treinos` e `feedbacks`.

---

## Workflow de desenvolvimento

Este projeto segue boas práticas de mercado desde o início:

- **Conventional Commits** — mensagens de commit semânticas (`feat`, `fix`, `chore`, `style`)
- **Feature branches** — cada funcionalidade desenvolvida em branch separada
- **Pull Requests** — revisão antes de merge na `main`

---

## Autor

Feito por **Manoel Justino** — Personal Trainer e Desenvolvedor front-end.

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Manoel%20Justino-0077B5?style=flat&logo=linkedin)](https://www.linkedin.com/in/manoel-justino-dev/)