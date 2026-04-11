# Codex Magna

> *A modular thinking system — designed to structure, express, and move thought.*

## v0.1 — The Foundation

This is the rock-solid, strictly logical foundation of Codex Magna. No animations, no 3D interfaces yet. Just clean architecture.

---

## The Four Pillars

| Module | Role | Status |
|---|---|---|
| **Ambitus** | Environment & layout / workspace state | 🔜 Planned |
| **Intellectus** | Hierarchy — tree, folders, page relationships | 🔜 Planned |
| **Pagina** | Thinking engine — component-based page content | ✅ v0.1 Scaffolded |
| **Portus** | Transfer system — move & copy data | 🔜 Planned |

---

## Architecture Rules

- **Backend:** NestJS (TypeScript), PostgreSQL, TypeORM
- **Strict module isolation:** Modules never import another module's Services or Repositories
- **Communication:** Event-Driven via `@nestjs/event-emitter`
- **Pagina blocks:** Stored in a single `jsonb` column, validated with polymorphic DTOs

---

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Copy environment variables
cp .env.example .env
# Fill in your PostgreSQL credentials in .env

# 3. Run in development mode
npm run start:dev
```

---

## Pagina Module — API

### `POST /pagina` — Create a Page

**Request Body:**
```json
{
  "title": "What is Consciousness?",
  "components": [
    {
      "id": "comp-1",
      "order": 0,
      "type": "text",
      "content": "Consciousness is the state of being aware of one's own existence."
    },
    {
      "id": "comp-2",
      "order": 1,
      "type": "question",
      "prompt": "Can a machine be conscious?",
      "answerType": "open"
    },
    {
      "id": "comp-3",
      "order": 2,
      "type": "example",
      "context": "The Chinese Room thought experiment by John Searle."
    }
  ]
}
```

**Response:** `201 Created` — The persisted Pagina entity.

**Internal Event Published:** `pagina.created` → `{ paginaId, title, createdAt }`

---

## File Structure

```
src/
├── main.ts                         # Bootstrap + global ValidationPipe
├── app.module.ts                   # Root module (TypeORM, EventEmitter, modules)
└── pagina/
    ├── pagina.module.ts            # Self-contained module definition
    ├── pagina.controller.ts        # POST /pagina
    ├── pagina.service.ts           # Business logic + event emission
    ├── dto/
    │   └── pagina.dto.ts           # Polymorphic component DTOs
    └── entities/
        └── pagina.entity.ts        # TypeORM entity (JSONB components)
```
