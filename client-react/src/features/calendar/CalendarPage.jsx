import { useEffect, useMemo, useState } from "react";
import { getCalendar, createEvent, updateEvent, deleteEvent } from "./api/calendar";

const MOCK_USER_ID = 1; // en attendant l'auth

const emptyForm = {
  title: "",
  description: "",
  start_date: "",
  end_date: "",
};

// --- helpers (filtre + tri dates robustes) ---
function normStr(v) {
  return String(v ?? "").trim().toLowerCase();
}

// Retourne une clé ISO "YYYY-MM-DD" si possible, sinon "".
// Supporte "YYYY-MM-DD", "DD/MM/YY", "DD/MM/YYYY".
function dateKey(d) {
  const s = String(d ?? "").trim();
  if (!s) return "";

  // déjà ISO
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;

  // formats avec /
  if (/^\d{1,2}\/\d{1,2}\/\d{2,4}$/.test(s)) {
    const [dd, mm, yy] = s.split("/");
    const day = dd.padStart(2, "0");
    const mon = mm.padStart(2, "0");
    let year = yy;
    if (yy.length === 2) year = `20${yy}`; // 25 -> 2025
    return `${year}-${mon}-${day}`;
  }

  return "";
}

function cmpDateAsc(a, b) {
  const ka = dateKey(a);
  const kb = dateKey(b);
  // si une date est invalide, on la met à la fin
  if (!ka && !kb) return 0;
  if (!ka) return 1;
  if (!kb) return -1;
  return ka.localeCompare(kb);
}

export default function App() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");

  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const isEditing = useMemo(() => editingId !== null, [editingId]);

  const [submitting, setSubmitting] = useState(false);

  // Recherche + tri
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("start_asc"); // start_asc | start_desc | title_asc

  // Modal delete
  const [deleteId, setDeleteId] = useState(null);

  // Erreurs par champ
  const [fieldErr, setFieldErr] = useState({ title: "", start_date: "", end_date: "" });

  function toastOk(msg) {
    setOk(msg);
    window.clearTimeout(window.__ok_toast_timer__);
    window.__ok_toast_timer__ = window.setTimeout(() => setOk(""), 1800);
  }

  async function refresh() {
    setErr("");
    setLoading(true);
    try {
      const data = await getCalendar();
      setEvents(Array.isArray(data) ? data : []);
    } catch (e) {
      setErr(e?.message || "Erreur lors du chargement.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  function onChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (fieldErr[name]) setFieldErr((p) => ({ ...p, [name]: "" }));
  }

  function startEdit(ev) {
    setEditingId(ev.id);
    setForm({
      title: ev.title ?? "",
      description: ev.description ?? "",
      start_date: ev.start_date ?? "",
      end_date: ev.end_date ?? "",
    });
    setErr("");
    setFieldErr({ title: "", start_date: "", end_date: "" });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
    setErr("");
    setFieldErr({ title: "", start_date: "", end_date: "" });
  }

  function validate(p) {
    const fe = { title: "", start_date: "", end_date: "" };
    const title = (p.title || "").trim();

    if (title.length < 3) fe.title = "Minimum 3 caractères.";
    if (!p.start_date) fe.start_date = "Obligatoire.";
    if (!p.end_date) fe.end_date = "Obligatoire.";

    // compare dates (ISO) si possible, sinon compare string
    const ks = dateKey(p.start_date) || String(p.start_date || "");
    const ke = dateKey(p.end_date) || String(p.end_date || "");
    if (p.start_date && p.end_date && ks > ke) fe.end_date = "Doit être ≥ start date.";

    setFieldErr(fe);
    return !Object.values(fe).some(Boolean);
  }

  async function submit(e) {
    e.preventDefault();
    setErr("");

    if (!validate(form)) return;

    const payload = { ...form, user_id: MOCK_USER_ID };

    setSubmitting(true);
    try {
      if (isEditing) {
        await updateEvent(editingId, payload);
        toastOk("Événement modifié.");
      } else {
        await createEvent(payload);
        toastOk("Événement créé.");
      }
      cancelEdit();
      await refresh();
    } catch (e2) {
      setErr(e2?.message || "Erreur.");
    } finally {
      setSubmitting(false);
    }
  }

  async function confirmDelete() {
    const id = deleteId;
    if (!id) return;
    setErr("");
    setSubmitting(true);
    try {
      await deleteEvent(id);
      toastOk("Événement supprimé.");
      setDeleteId(null);
      await refresh();
    } catch (e) {
      setErr(e?.message || "Erreur suppression.");
    } finally {
      setSubmitting(false);
    }
  }

  // ✅ filtre + tri robustes
  const filteredSorted = useMemo(() => {
    const needle = normStr(q);
    let list = [...events];

    if (needle) {
      list = list.filter((ev) => {
        const hay = [
          ev.title,
          ev.description,
          ev.start_date,
          ev.end_date,
          ev.id, // bonus: taper "2" peut aider à retrouver id=2
        ]
          .map(normStr)
          .join(" ");
        return hay.includes(needle);
      });
    }

    if (sort === "start_asc") {
      list.sort((a, b) => cmpDateAsc(a.start_date, b.start_date));
    } else if (sort === "start_desc") {
      list.sort((a, b) => -cmpDateAsc(a.start_date, b.start_date));
    } else if (sort === "title_asc") {
      list.sort((a, b) => normStr(a.title).localeCompare(normStr(b.title)));
    }

    return list;
  }, [events, q, sort]);

  return (
    <div style={styles.app}>
      {/* Top Bar */}
      <div style={styles.topbar}>
        <div>
          <div style={styles.brand}>Calendar</div>
          <div style={styles.subtitle}>Gestion des événements</div>
        </div>

        <div style={styles.topActions}>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Rechercher (titre, desc, date, id)…"
            style={styles.search}
          />

          <select value={sort} onChange={(e) => setSort(e.target.value)} style={styles.select}>
            <option value="start_asc">Date ↑</option>
            <option value="start_desc">Date ↓</option>
            <option value="title_asc">Titre A→Z</option>
          </select>

          <button onClick={refresh} style={styles.btnGhost} disabled={loading || submitting}>
            {loading ? "…" : "Refresh"}
          </button>
        </div>
      </div>

      {/* Alerts */}
      <div style={styles.container}>
        {err && <div style={styles.alertError}>{err}</div>}
        {ok && <div style={styles.alertOk}>{ok}</div>}
      </div>

      {/* Main grid */}
      <div style={styles.grid}>
        {/* LIST */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <div>
              <div style={styles.cardTitle}>Liste</div>
              <div style={styles.cardHint}>
                {filteredSorted.length} événement(s)
                {q.trim() ? " (filtré)" : ""}
              </div>
            </div>
          </div>

          {loading ? (
            <div style={{ display: "grid", gap: 10 }}>
              <SkeletonItem />
              <SkeletonItem />
              <SkeletonItem />
            </div>
          ) : filteredSorted.length === 0 ? (
            <div style={styles.empty}>
              <div style={styles.emptyTitle}>Aucun événement</div>
              <div style={styles.emptyText}>Crée ton premier événement à droite.</div>
            </div>
          ) : (
            <div style={{ display: "grid", gap: 10 }}>
              {filteredSorted.map((ev) => (
                <div key={ev.id} style={styles.eventCard}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                    <div style={{ minWidth: 0 }}>
                      <div style={styles.eventTitle}>{ev.title}</div>
                      <div style={styles.eventMeta}>
                        <span>{ev.start_date}</span>
                        <span style={styles.dot} />
                        <span>{ev.end_date}</span>
                      </div>
                      {ev.description ? <div style={styles.eventDesc}>{ev.description}</div> : null}
                    </div>

                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={() => startEdit(ev)} style={styles.btnSoft} disabled={submitting}>
                        Edit
                      </button>
                      <button onClick={() => setDeleteId(ev.id)} style={styles.btnDanger} disabled={submitting}>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* FORM */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <div>
              <div style={styles.cardTitle}>{isEditing ? "Modifier" : "Créer"}</div>
              <div style={styles.cardHint}>
                {isEditing ? "Met à jour un événement existant." : "Ajoute un nouvel événement."}
              </div>
            </div>
          </div>

          <form onSubmit={submit} style={{ display: "grid", gap: 12 }}>
            <div style={styles.field}>
              <label style={styles.label}>Title</label>
              <input
                name="title"
                value={form.title}
                onChange={onChange}
                style={{ ...styles.input, ...(fieldErr.title ? styles.inputError : null) }}
                placeholder="Ex: Cours DevOps"
                disabled={submitting}
              />
              {fieldErr.title && <div style={styles.helpError}>{fieldErr.title}</div>}
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Description</label>
              <input
                name="description"
                value={form.description}
                onChange={onChange}
                style={styles.input}
                placeholder="Ex: Chapitre Docker"
                disabled={submitting}
              />
            </div>

            <div style={styles.row2}>
              <div style={styles.field}>
                <label style={styles.label}>Start date</label>
                <input
                  name="start_date"
                  type="date"
                  value={form.start_date}
                  onChange={onChange}
                  style={{ ...styles.input, ...(fieldErr.start_date ? styles.inputError : null) }}
                  disabled={submitting}
                />
                {fieldErr.start_date && <div style={styles.helpError}>{fieldErr.start_date}</div>}
              </div>

              <div style={styles.field}>
                <label style={styles.label}>End date</label>
                <input
                  name="end_date"
                  type="date"
                  value={form.end_date}
                  onChange={onChange}
                  style={{ ...styles.input, ...(fieldErr.end_date ? styles.inputError : null) }}
                  disabled={submitting}
                />
                {fieldErr.end_date && <div style={styles.helpError}>{fieldErr.end_date}</div>}
              </div>
            </div>

            <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
              <button type="submit" style={styles.btnPrimary} disabled={submitting}>
                {submitting ? "…" : isEditing ? "Update" : "Create"}
              </button>

              {isEditing && (
                <button type="button" onClick={cancelEdit} style={styles.btnGhost} disabled={submitting}>
                  Cancel
                </button>
              )}
            </div>

            <div style={styles.footerHint}>Règles: title ≥ 3 · start_date ≤ end_date</div>
          </form>
        </div>
      </div>

      {/* Delete modal */}
      {deleteId !== null && (
        <div style={styles.modalOverlay} onMouseDown={() => !submitting && setDeleteId(null)}>
          <div style={styles.modal} onMouseDown={(e) => e.stopPropagation()}>
            <div style={styles.modalTitle}>Supprimer l’événement ?</div>
            <div style={styles.modalText}>Cette action est irréversible.</div>

            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 14 }}>
              <button style={styles.btnGhost} onClick={() => setDeleteId(null)} disabled={submitting}>
                Annuler
              </button>
              <button style={styles.btnDangerSolid} onClick={confirmDelete} disabled={submitting}>
                {submitting ? "…" : "Supprimer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SkeletonItem() {
  return (
    <div style={styles.skeleton}>
      <div style={styles.skeletonLine1} />
      <div style={styles.skeletonLine2} />
      <div style={styles.skeletonLine3} />
    </div>
  );
}

const styles = {
  app: {
    minHeight: "100vh",
    background: "#f6f7fb",
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto",
    color: "#111",
  },
  container: { maxWidth: 1100, margin: "16px auto 0", padding: "0 16px" },

  topbar: {
    position: "sticky",
    top: 0,
    zIndex: 10,
    background: "rgba(246,247,251,0.9)",
    backdropFilter: "blur(8px)",
    borderBottom: "1px solid #e9e9ef",
    padding: "14px 16px",
    display: "flex",
    gap: 12,
    justifyContent: "space-between",
    alignItems: "center",
  },
  brand: { fontSize: 22, fontWeight: 800, letterSpacing: -0.3 },
  subtitle: { fontSize: 12, color: "#666", marginTop: 2 },

  topActions: { display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", justifyContent: "flex-end" },
  search: {
    width: 280,
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid #e3e3ea",
    outline: "none",
    background: "#fff",
    fontSize: 14,
  },
  select: {
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid #e3e3ea",
    background: "#fff",
    fontSize: 14,
    outline: "none",
  },

  grid: {
    maxWidth: 1100,
    margin: "16px auto",
    padding: "0 16px 20px",
    display: "grid",
    gridTemplateColumns: "1.15fr 0.85fr",
    gap: 16,
    alignItems: "start",
  },

  card: {
    background: "#fff",
    border: "1px solid #e9e9ef",
    borderRadius: 16,
    padding: 14,
    boxShadow: "0 8px 30px rgba(20,20,30,0.06)",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "start",
    gap: 10,
    marginBottom: 10,
  },
  cardTitle: { fontSize: 18, fontWeight: 800, letterSpacing: -0.2 },
  cardHint: { fontSize: 12, color: "#666", marginTop: 3 },

  empty: { padding: 14, borderRadius: 14, border: "1px dashed #e0e0ea", background: "#fbfbfe" },
  emptyTitle: { fontWeight: 800, marginBottom: 4 },
  emptyText: { color: "#666", fontSize: 13 },

  eventCard: {
    border: "1px solid #eeeef5",
    borderRadius: 14,
    padding: 12,
    background: "linear-gradient(180deg, #ffffff, #fbfbff)",
  },
  eventTitle: { fontWeight: 800, fontSize: 15, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  eventMeta: { display: "flex", alignItems: "center", gap: 8, color: "#666", fontSize: 12, marginTop: 4 },
  dot: { width: 4, height: 4, borderRadius: 99, background: "#bbb" },
  eventDesc: { marginTop: 8, fontSize: 13, color: "#333", lineHeight: 1.3 },

  field: { display: "grid", gap: 6 },
  label: { fontSize: 12, color: "#444", fontWeight: 700 },
  input: {
    padding: "11px 12px",
    borderRadius: 12,
    border: "1px solid #e3e3ea",
    outline: "none",
    fontSize: 14,
    background: "#fff",
  },
  inputError: { border: "1px solid #ffb3b3", background: "#fff7f7" },
  helpError: { fontSize: 12, color: "#b42318" },

  row2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 },

  footerHint: { marginTop: 4, fontSize: 12, color: "#666" },

  alertError: {
    background: "#fff0f0",
    border: "1px solid #ffcccc",
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    color: "#8a1f1f",
    fontSize: 13,
  },
  alertOk: {
    background: "#effff1",
    border: "1px solid #c7f2cb",
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    color: "#1f6f2a",
    fontSize: 13,
  },

  btnPrimary: {
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid #111",
    background: "#111",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 700,
  },
  btnGhost: {
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid #e3e3ea",
    background: "#fff",
    cursor: "pointer",
    fontWeight: 700,
  },
  btnSoft: {
    padding: "9px 10px",
    borderRadius: 12,
    border: "1px solid #e3e3ea",
    background: "#fff",
    cursor: "pointer",
    fontWeight: 700,
  },
  btnDanger: {
    padding: "9px 10px",
    borderRadius: 12,
    border: "1px solid #ffb3b3",
    background: "#fff5f5",
    cursor: "pointer",
    fontWeight: 700,
    color: "#8a1f1f",
  },
  btnDangerSolid: {
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid #b42318",
    background: "#d92d20",
    cursor: "pointer",
    fontWeight: 800,
    color: "#fff",
  },

  skeleton: { border: "1px solid #eeeef5", borderRadius: 14, padding: 12, background: "#fbfbff" },
  skeletonLine1: { height: 14, width: "45%", borderRadius: 8, background: "#f0f1f6" },
  skeletonLine2: { height: 12, width: "70%", borderRadius: 8, background: "#f0f1f6", marginTop: 10 },
  skeletonLine3: { height: 10, width: "55%", borderRadius: 8, background: "#f0f1f6", marginTop: 10 },

  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(10,10,20,0.35)",
    display: "grid",
    placeItems: "center",
    padding: 16,
    zIndex: 50,
  },
  modal: {
    width: "min(420px, 100%)",
    background: "#fff",
    borderRadius: 16,
    border: "1px solid #e9e9ef",
    boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
    padding: 16,
  },
  modalTitle: { fontSize: 16, fontWeight: 900 },
  modalText: { marginTop: 6, color: "#555", fontSize: 13 },
};
