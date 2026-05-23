#!/usr/bin/env node
/**
 * Auditoria automática de código — Marketplace API
 * Executar: node scripts/code-audit.js
 *
 * Verificações:
 *  1. Todas as funções async têm try/catch
 *  2. Sem console.log fora de seed.js/scripts/
 *  3. Sem credenciais hardcoded
 *  4. Todos os findById têm validação de ObjectId antes
 *  5. Nenhum res.json() expõe o campo 'password'
 *  6. Endpoints REST têm middleware de auth (ou são explicitamente públicos)
 */

'use strict';

const fs   = require('fs');
const path = require('path');

// ── Configuração ──────────────────────────────────────────────────────────────

const ROOT = path.join(__dirname, '..');

// Directórios a analisar
const SCAN_DIRS = [
  path.join(ROOT, 'routes'),
  path.join(ROOT, 'controllers'),
  path.join(ROOT, 'middleware'),
  path.join(ROOT, 'models'),
  path.join(ROOT, 'config'),
  path.join(ROOT, 'app.js'),
];

// Ficheiros explicitamente excluídos de certas verificações
const EXCLUDE_CONSOLE_LOG = [
  'seed.js',
  path.join(ROOT, 'scripts'),
  path.join(ROOT, 'app.js'), // logs de arranque do servidor são aceitáveis
];

// Endpoints públicos conhecidos (sem autenticação obrigatória)
const PUBLIC_ENDPOINTS = [
  '/health',
  '/auth/register',
  '/auth/login',
  '/products',
  '/products/compare',
  '/supermarkets',
  '/categories',
];

// ── Utilitários ───────────────────────────────────────────────────────────────

const RESET  = '\x1b[0m';
const RED    = '\x1b[31m';
const GREEN  = '\x1b[32m';
const YELLOW = '\x1b[33m';
const BOLD   = '\x1b[1m';

function pass(msg)  { console.log(`  ${GREEN}✅${RESET} ${msg}`); }
function fail(msg)  { console.log(`  ${RED}❌${RESET} ${msg}`); }
function warn(msg)  { console.log(`  ${YELLOW}⚠️ ${RESET} ${msg}`); }
function header(h)  { console.log(`\n${BOLD}${h}${RESET}`); }

/** Recolhe recursivamente todos os ficheiros .js num directório ou ficheiro */
function collectFiles(target, acc = []) {
  if (!fs.existsSync(target)) return acc;
  const stat = fs.statSync(target);
  if (stat.isFile() && target.endsWith('.js')) {
    acc.push(target);
  } else if (stat.isDirectory()) {
    for (const entry of fs.readdirSync(target)) {
      collectFiles(path.join(target, entry), acc);
    }
  }
  return acc;
}

/** Lê um ficheiro e divide por linhas com número */
function readLines(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  return content.split('\n').map((line, i) => ({ num: i + 1, text: line }));
}

/** Caminho relativo ao ROOT para exibição */
function rel(filePath) {
  return path.relative(ROOT, filePath).replace(/\\/g, '/');
}

// ── Verificação 1 — try/catch em funções async ────────────────────────────────

function checkTryCatch(files) {
  header('Verificação 1 — try/catch em todas as funções async de router');

  let issues = 0;

  for (const file of files) {
    // Só rotas e controllers
    if (!file.includes(`${path.sep}routes${path.sep}`) &&
        !file.includes(`${path.sep}controllers${path.sep}`)) continue;

    const content = fs.readFileSync(file, 'utf8');
    const lines   = content.split('\n');

    // Encontrar todos os handlers async (arrow functions e function declarations)
    // Padrão: async (req, res, next) => { ou async function ...
    const asyncHandlerRe = /async\s*(?:\(req|function\s+\w+\s*\(req)/;

    for (let i = 0; i < lines.length; i++) {
      if (!asyncHandlerRe.test(lines[i])) continue;

      // Recolher o bloco da função (até 60 linhas à frente)
      const block = lines.slice(i, Math.min(i + 60, lines.length)).join('\n');

      // Verificar se tem try { ... } catch
      if (!/try\s*\{/.test(block)) {
        fail(`${rel(file)}:${i + 1} — handler async sem try/catch`);
        issues++;
      }
    }
  }

  if (issues === 0) pass('Todos os handlers async têm try/catch');
  return issues;
}

// ── Verificação 2 — sem console.log em produção ───────────────────────────────

function checkConsoleLogs(files) {
  header('Verificação 2 — sem console.log em código de produção');

  let issues = 0;

  for (const file of files) {
    // Excluir ficheiros permitidos
    const isExcluded = EXCLUDE_CONSOLE_LOG.some(ex =>
      typeof ex === 'string' ? file.includes(ex) : false
    );
    if (isExcluded) continue;

    const lines = readLines(file);
    for (const { num, text } of lines) {
      // Ignorar comentários
      if (/^\s*\/\//.test(text)) continue;
      if (/console\.(log|warn|error|info|debug)\(/.test(text)) {
        warn(`${rel(file)}:${num} — console.log encontrado (considerar remover em produção)`);
        issues++;
      }
    }
  }

  if (issues === 0) pass('Sem console.log em código de produção');
  return issues;
}

// ── Verificação 3 — sem credenciais hardcoded ─────────────────────────────────

function checkHardcodedCredentials(files) {
  header('Verificação 3 — sem credenciais hardcoded');

  // Padrões suspeitos (excluir testes, seeds e comentários)
  const patterns = [
    { re: /password\s*[:=]\s*['"`][^'"` ]{4,}['"`]/, label: 'password hardcoded' },
    { re: /secret\s*[:=]\s*['"`][a-zA-Z0-9!@#$%^&*]{8,}['"`]/, label: 'secret hardcoded' },
    { re: /mongodb:\/\/[^'"`\s]*:[^'"`\s]+@/, label: 'MongoDB URI com credenciais' },
    { re: /Bearer\s+ey[A-Za-z0-9._-]{20,}/, label: 'JWT hardcoded' },
  ];

  let issues = 0;

  for (const file of files) {
    if (file.includes('seed.js') || file.includes(`${path.sep}scripts${path.sep}`)) continue;

    const lines = readLines(file);
    for (const { num, text } of lines) {
      if (/^\s*\/\//.test(text) || /^\s*\*/.test(text)) continue;
      for (const { re, label } of patterns) {
        if (re.test(text)) {
          fail(`${rel(file)}:${num} — ${label} possível`);
          issues++;
        }
      }
    }
  }

  if (issues === 0) pass('Sem credenciais hardcoded detectadas');
  return issues;
}

// ── Verificação 4 — findById com validação de ObjectId ───────────────────────

function checkObjectIdValidation(files) {
  header('Verificação 4 — findById com validação de ObjectId antes');

  let issues = 0;

  for (const file of files) {
    if (!file.includes(`${path.sep}routes${path.sep}`)) continue;

    const lines = readLines(file);
    const content = lines.map(l => l.text).join('\n');

    // Encontrar todos os findById
    for (let i = 0; i < lines.length; i++) {
      if (!/findById\s*\(/.test(lines[i].text)) continue;

      // Verificar se há validação de ObjectId nas 10 linhas anteriores
      const prev = lines.slice(Math.max(0, i - 10), i).map(l => l.text).join('\n');
      if (!/ObjectId\.isValid/.test(prev) && !/isValid\(req\.params/.test(prev)) {
        warn(`${rel(file)}:${lines[i].num} — findById sem validação de ObjectId precedente`);
        issues++;
      }
    }
  }

  if (issues === 0) pass('Todos os findById têm validação de ObjectId antes');
  return issues;
}

// ── Verificação 5 — password nunca exposta em res.json ────────────────────────

function checkPasswordExposure(files) {
  header('Verificação 5 — campo password nunca exposto em res.json()');

  let issues = 0;

  for (const file of files) {
    if (!file.includes(`${path.sep}routes${path.sep}`) &&
        !file.includes(`${path.sep}controllers${path.sep}`)) continue;

    const lines = readLines(file);

    for (const { num, text } of lines) {
      // Detectar: res.json com password, ou select que não exclui password
      if (/res\.(json|send)\(/.test(text) && /password/.test(text)) {
        fail(`${rel(file)}:${num} — possível exposição do campo password em resposta`);
        issues++;
      }
      // Detectar: .find() ou .findById() sem .select('-password')
      if (/\.(find|findById|findOne)\(/.test(text) && !/\.select\(/.test(text)) {
        // Verificar nas próximas 5 linhas se há .select
        // (só alerta se o resultado for directamente devolvido — heurística)
      }
    }
  }

  if (issues === 0) pass('Nenhuma exposição directa do campo password detectada');
  return issues;
}

// ── Verificação 6 — endpoints com auth ────────────────────────────────────────

function checkAuthMiddleware(files) {
  header('Verificação 6 — endpoints REST com middleware de autenticação');

  let issues = 0;

  for (const file of files) {
    if (!file.includes(`${path.sep}api${path.sep}`)) continue;
    if (file.endsWith('index.js')) continue;

    const lines = readLines(file);

    for (const { num, text } of lines) {
      // Detectar router.get/post/put/patch/delete sem apiAuth
      const routeMatch = text.match(/router\.(get|post|put|patch|delete)\s*\(\s*['"`]([^'"`]+)['"`]/);
      if (!routeMatch) continue;

      const httpMethod = routeMatch[1].toUpperCase();
      const routePath  = routeMatch[2];

      // Verificar se é público por convenção
      const isPublic = PUBLIC_ENDPOINTS.some(pub => routePath === pub || routePath.startsWith(pub + '/'));

      // Verificar se a linha ou o handler próximo tem apiAuth
      const nearby = lines.slice(num - 1, Math.min(num + 3, lines.length))
        .map(l => l.text).join(' ');

      const hasAuth = /apiAuth/.test(nearby);

      if (!hasAuth && !isPublic) {
        warn(`${rel(file)}:${num} — ${httpMethod} ${routePath} sem apiAuth detectado (verificar manualmente)`);
        issues++;
      }
    }
  }

  if (issues === 0) pass('Todos os endpoints detectados têm auth ou são públicos conhecidos');
  return issues;
}

// ── Verificação 7 — JWT algoritmo explícito ───────────────────────────────────

function checkJwtAlgorithm(files) {
  header('Verificação 7 — jwt.verify() com algoritmo explícito (HS256)');

  let issues = 0;

  for (const file of files) {
    const lines = readLines(file);
    for (const { num, text } of lines) {
      if (!/jwt\.verify\(/.test(text)) continue;

      // Verificar se a chamada (linha actual + próximas 2) tem algorithms
      const block = lines.slice(num - 1, Math.min(num + 2, lines.length))
        .map(l => l.text).join(' ');

      if (!/algorithms\s*:/.test(block)) {
        fail(`${rel(file)}:${num} — jwt.verify() sem { algorithms: ['HS256'] } explícito`);
        issues++;
      }
    }
  }

  if (issues === 0) pass('jwt.verify() usa algoritmo explícito em todos os ficheiros');
  return issues;
}

// ── Verificação 8 — cookie flags de segurança ─────────────────────────────────

function checkCookieFlags() {
  header('Verificação 8 — cookie flags de segurança na sessão');

  const appPath = path.join(ROOT, 'app.js');
  if (!fs.existsSync(appPath)) { warn('app.js não encontrado'); return 1; }

  const content = fs.readFileSync(appPath, 'utf8');
  let issues = 0;

  if (!/httpOnly\s*:\s*true/.test(content)) {
    fail('app.js — cookie.httpOnly: true em falta na configuração de sessão');
    issues++;
  } else {
    pass('cookie.httpOnly: true configurado');
  }

  if (!/sameSite\s*:/.test(content)) {
    fail('app.js — cookie.sameSite em falta (protecção CSRF básica)');
    issues++;
  } else {
    pass('cookie.sameSite configurado');
  }

  if (!/secure\s*:/.test(content)) {
    warn('app.js — cookie.secure não configurado (recomendado para produção)');
  } else {
    pass('cookie.secure configurado');
  }

  return issues;
}

// ── Verificação 9 — payload size limit ────────────────────────────────────────

function checkPayloadLimit() {
  header('Verificação 9 — limite de tamanho no body parser');

  const appPath = path.join(ROOT, 'app.js');
  if (!fs.existsSync(appPath)) { warn('app.js não encontrado'); return 1; }

  const content = fs.readFileSync(appPath, 'utf8');
  let issues = 0;

  if (!/express\.json\s*\(\s*\{[^}]*limit/.test(content)) {
    fail('app.js — express.json() sem limite de payload (vulnerável a ataques de body grande)');
    issues++;
  } else {
    pass('express.json() tem limite de payload configurado');
  }

  if (!/express\.urlencoded\s*\(\s*\{[^}]*limit/.test(content)) {
    fail('app.js — express.urlencoded() sem limite de payload');
    issues++;
  } else {
    pass('express.urlencoded() tem limite de payload configurado');
  }

  return issues;
}

// ── Verificação 10 — mongo-sanitize ──────────────────────────────────────────

function checkMongoSanitize() {
  header('Verificação 10 — express-mongo-sanitize configurado');

  const appPath = path.join(ROOT, 'app.js');
  if (!fs.existsSync(appPath)) { warn('app.js não encontrado'); return 1; }

  const content = fs.readFileSync(appPath, 'utf8');
  let issues = 0;

  if (!/mongo.sanitize|mongoSanitize/.test(content)) {
    fail('app.js — express-mongo-sanitize não está configurado (vulnerável a NoSQL injection)');
    issues++;
  } else {
    pass('express-mongo-sanitize está configurado');
  }

  return issues;
}

// ── Verificação 11 — rate limiting ────────────────────────────────────────────

function checkRateLimit(files) {
  header('Verificação 11 — rate limiting em /auth/login');

  let issues = 0;

  for (const file of files) {
    if (!file.includes('auth.js') || !file.includes(`${path.sep}api${path.sep}`)) continue;

    const content = fs.readFileSync(file, 'utf8');
    if (!/rateLimit|rate.limit/i.test(content)) {
      fail(`${rel(file)} — rate limiting não detectado no endpoint de login`);
      issues++;
    } else {
      pass(`Rate limiting detectado em ${rel(file)}`);
    }
  }

  return issues;
}

// ── Main ──────────────────────────────────────────────────────────────────────

function main() {
  console.log(`${BOLD}\n${'═'.repeat(60)}`);
  console.log('  MARKETPLACE — AUDITORIA DE CÓDIGO');
  console.log(`  ${new Date().toISOString()}`);
  console.log(`${'═'.repeat(60)}${RESET}`);

  // Recolher todos os ficheiros JS a analisar
  const allFiles = [];
  for (const target of SCAN_DIRS) {
    collectFiles(target, allFiles);
  }

  console.log(`\nFicheiros analisados: ${allFiles.length}`);
  allFiles.forEach(f => console.log(`  ${rel(f)}`));

  // Executar verificações
  const results = {
    'try/catch em handlers async':      checkTryCatch(allFiles),
    'Sem console.log em produção':       checkConsoleLogs(allFiles),
    'Sem credenciais hardcoded':         checkHardcodedCredentials(allFiles),
    'ObjectId validado antes findById':  checkObjectIdValidation(allFiles),
    'Password nunca exposta':            checkPasswordExposure(allFiles),
    'Endpoints com auth middleware':     checkAuthMiddleware(allFiles),
    'JWT algoritmo explícito':           checkJwtAlgorithm(allFiles),
    'Cookie flags de segurança':         checkCookieFlags(),
    'Payload size limitado':             checkPayloadLimit(),
    'NoSQL injection prevenido':         checkMongoSanitize(),
    'Rate limiting em /auth/login':      checkRateLimit(allFiles),
  };

  // Resumo final
  console.log(`\n${BOLD}${'═'.repeat(60)}`);
  console.log('  RESUMO DA AUDITORIA');
  console.log(`${'═'.repeat(60)}${RESET}`);

  let totalIssues = 0;
  for (const [check, issueCount] of Object.entries(results)) {
    const icon   = issueCount === 0 ? `${GREEN}✅${RESET}` : `${RED}❌${RESET}`;
    const detail = issueCount > 0 ? ` (${issueCount} problema${issueCount > 1 ? 's' : ''})` : '';
    console.log(`  ${icon} ${check}${detail}`);
    totalIssues += issueCount;
  }

  console.log(`\n${totalIssues === 0
    ? `${GREEN}${BOLD}✅ Auditoria concluída sem problemas críticos!${RESET}`
    : `${RED}${BOLD}❌ Auditoria encontrou ${totalIssues} problema(s) a corrigir.${RESET}`
  }\n`);

  process.exit(totalIssues > 0 ? 1 : 0);
}

main();
