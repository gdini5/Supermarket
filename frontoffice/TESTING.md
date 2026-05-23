# Guião de Testes — Frontoffice Angular

## Pré-requisitos
- Backend Express a correr em `http://localhost:3000`
- MongoDB ligado
- Angular dev server: `cd frontoffice && ng serve` → `http://localhost:4200`

---

## Fluxo completo cliente

1. **Registar** → `/auth/register`
   - Preencher nome, email, password, morada, telefone com role=Cliente
   - Verificar que o indicador de força da password funciona
   - Submeter → confirmar redirecionamento para `/`

2. **Home com supermercados** → `/`
   - Confirmar que a lista de supermercados aparece à esquerda
   - Confirmar que o mapa Leaflet carrega com pins
   - Fazer hover num card → pin correspondente deve abrir popup
   - Clicar "Ver produtos" num supermercado → redireciona para `/shop/:id`

3. **Loja filtrada** → `/shop/:supermarketId`
   - Confirmar o nome do supermercado no cabeçalho
   - Testar pesquisa por texto (debounce de 400ms)
   - Filtrar por categoria
   - Ordenar por preço

4. **Adicionar ao carrinho**
   - Clicar "Adicionar ao carrinho" num produto (deve estar autenticado)
   - Confirmar que o badge da navbar actualiza com +1
   - Confirmar que o botão muda para "✓ Adicionado" por 2 segundos

5. **Carrinho** → `/cart`
   - Confirmar produto presente
   - Alterar quantidade com botões +/- → total actualiza em tempo real
   - Remover produto com ✕
   - Testar "Limpar carrinho" → aparece confirmação

6. **Checkout** → `/checkout`
   - Passo 1: verificar lista de produtos
   - Passo 2: escolher método de entrega → total actualiza
   - Passo 3: confirmar resumo completo
   - Clicar "Confirmar encomenda" → loading no botão → redirecionamento para `/orders/:id`

7. **Detalhe da encomenda** → `/orders/:id`
   - Confirmar badge de estado e timeline visual
   - Se `deliveryMethod=courier` e `status=delivering`: mapa deve aparecer com pins
   - Contagem regressiva deve estar visível

8. **Histórico de encomendas** → `/orders`
   - Confirmar lista ordenada por data decrescente
   - Badges de estado correctas
   - Encomenda `confirmed` criada há menos de 5 minutos → botão "Cancelar" visível

9. **Comparar preços** → `/product/:id?compare=true`
   - Tabela com todos os supermercados que vendem o produto
   - Ordenados por preço crescente
   - Linha mais barata com badge verde

---

## Segurança

| Cenário | Resultado esperado |
|---|---|
| Aceder a `/cart` sem sessão | Redireciona para `/auth/login?returnUrl=/cart` |
| Login → redireciona para returnUrl | Vai para `/cart` automaticamente |
| Token expirado na localStorage | Guard detecta e redireciona para login |
| Botão "Adicionar" sem autenticação | Botão não aparece no product-card |
| Produto sem stock | Botão "Adicionar" desactivado (disabled) |

---

## Edge Cases

| Cenário | Resultado esperado |
|---|---|
| Carrinho vazio | Mensagem + botão "Ir às compras" |
| Encomenda cancelada | Sem botão cancelar |
| OSRM indisponível | Mapa escondido, mensagem "Tracking temporariamente indisponível" |
| Geolocalização negada pelo browser | Mapa mostra supermercado + destino sem pin do utilizador |
| Nominatim sem resultado para morada | Pin não adicionado ao mapa (sem erro visível para o utilizador) |
| Produto sem imagem | Imagem de fallback `assets/no-image.png` |
| API retorna erro 500 | Mensagem genérica de erro visível ao utilizador |
| Stock insuficiente no checkout | Mensagem clara com botão para voltar ao carrinho |

---

## Testes de responsividade

- **Mobile (≤768px):**
  - Navbar hamburger funciona
  - Mapa oculto na home
  - Grelha de produtos com 1 coluna
  - Formulários a full-width

- **Tablet (768px–1024px):**
  - Grelha de produtos com 2 colunas
  - Layout de checkout em coluna única

- **Desktop (≥1024px):**
  - Grelha de produtos com 3-4 colunas
  - Layout home em 2 colunas (lista + mapa)

---

## Teste do ciclo de vida de encomenda

1. Criar encomenda com `deliveryMethod=courier`
2. No backoffice/Postman: mudar estado para `confirmed` → verificar botão cancelar aparece
3. Mudar para `preparing` → botão cancelar desaparece
4. Mudar para `delivering` → mapa deve aparecer em `/orders/:id`
5. Mudar para `delivered` → timeline completa, badge verde
