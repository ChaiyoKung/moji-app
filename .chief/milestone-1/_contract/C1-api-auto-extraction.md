# Contract C1 — Auto-Extraction API

## Endpoint

```
POST /transactions/auto
```

## Request

| Field | Location | Type | Required | Notes |
|---|---|---|---|---|
| `Authorization` | Header | `Bearer <JWT>` | Yes | Supplied by axios interceptor automatically |
| `Content-Type` | Header | `multipart/form-data` | Yes | Set automatically by axios when FormData is used |
| `accountId` | Body | string | Yes | `data[0]._id` from `GET /accounts` |
| `currency` | Body | string | Yes | `data[0].currency` from first account |
| `timezone` | Body | string | Yes | `dayjs.tz.guess()` |
| `text` | Body | string | Conditional | User-typed message; omit if empty |
| `image` | Body | file binary | Conditional | Cropped image; omit if no image selected |

**Constraint:** At least one of `text` or `image` must be present.

## Response — 207 Multi-Status

```ts
interface AutoExtractionResponse {
  created: DraftTransaction[];
  failed: FailedItem[];
}

interface DraftTransaction {
  _id: string;
  userId: string;
  accountId: string;
  categoryId: string;    // ID string — resolve to category name/icon client-side
  type: "income" | "expense";
  amount?: number;       // Rounded integer; may be absent if extraction failed
  currency: string;
  note?: string;         // Optional; absent if AI not confident
  date: string;          // ISO 8601 UTC date string
  status: "draft";       // Always "draft" — balance NOT affected yet
  aiModel: string;
  createdAt: string;
  updatedAt: string;
}

interface FailedItem {
  item: number;   // 1-based index of the line item that failed
  reason: string; // Human-readable failure reason
}
```

## Error Handling

| Condition | Behaviour |
|---|---|
| Network error / 5xx | Show error bubble in chat feed |
| 400 Bad Request | Show error bubble with message from response |
| 401 Unauthorized | Handled by existing axios interceptor (token refresh) |
| `failed` array non-empty | Render one failure bubble per item alongside successful draft cards |
