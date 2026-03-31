import { useEffect, useState } from "react";
import { fetchMe, updateReminderSettingsApi } from "../../api/authApi";
import { useAuthStore } from "../../store/authStore";

function ReminderSettings() {
  const token = useAuthStore((s) => s.token);
  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const me = await fetchMe(token);
        setReminderEnabled(me.reminderEnabled);
      } catch (err) {
        console.error(err);
      }
    };

    if (token) load();
  }, [token]);

  const handleSave = async () => {
    try {
      setSaving(true);
      const updated = await updateReminderSettingsApi(token, {
        reminderEnabled,
      });
      setReminderEnabled(updated.reminderEnabled);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="paper-card p-4">
      <div className="mb-4 flex items-center gap-3">
        <h2 className="display-serif text-base font-bold">Email reminders</h2>
        <div className="h-px flex-1" style={{ background: "var(--border)" }} />
      </div>

      <div className="space-y-3 text-[12px]">
        <label className="flex items-center justify-between gap-3">
          <span style={{ color: "var(--muted)" }}>
            Remind me about problems due today
          </span>
          <input
            type="checkbox"
            checked={reminderEnabled}
            onChange={(e) => setReminderEnabled(e.target.checked)}
          />
        </label>

        <button
          onClick={handleSave}
          disabled={saving}
          className="border px-3 py-1.5 text-[11px]"
          style={{
            background: "var(--ink)",
            color: "var(--bg)",
            borderColor: "var(--ink)",
          }}
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
    </section>
  );
}

export default ReminderSettings;