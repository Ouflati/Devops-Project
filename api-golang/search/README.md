# 🔎 Global Search API

Cette feature implémente une **recherche globale multi-entités** pour le backend Go
(`api-golang`) en utilisant **Gin** et **SQLite**.

Elle permet de rechercher simultanément dans plusieurs tables de la base de données
via un seul endpoint HTTP.

---

## 📌 Endpoint

GET /api/search

---

## 🔎 Paramètres de requête

| Paramètre | Type   | Obligatoire | Description |
|----------|--------|-------------|-------------|
| `q` | string | ✅ Oui | Terme de recherche |
| `types` | string | ❌ Non | Entités à rechercher (séparées par des virgules) |
| `limit` | int | ❌ Non | Nombre maximum de résultats (défaut: 20, max: 50) |

---

## 🧩 Types supportés

| Type | Table SQLite |
|------|--------------|
| `users` | `users` |
| `tasks` | `tasks` |
| `calendar` | `calendar` |
| `chat` | `chat_messages` |

👉 Si `types` est omis, la recherche s’effectue sur **toutes les entités**.

---

## 📤 Exemples de requêtes

```bash
/api/search?q=test
/api/search?q=test&types=users,tasks
/api/search?q=meeting&types=calendar
/api/search?q=hello&types=chat
/api/search?q=test&limit=10
