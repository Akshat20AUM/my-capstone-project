import { useEffect, useState, type FormEvent } from "react";
import {
  defaultSettings,
  loadSettings,
  saveSettings,
  validateSettings,
  type Settings,
} from "../settings";

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
      <div className="mb-5 border-b border-stone-100 pb-4">
        <h2 className="text-lg font-semibold text-stone-900">{title}</h2>
        {description && (
          <p className="mt-1 text-sm text-stone-500">{description}</p>
        )}
      </div>
      <div className="space-y-5">{children}</div>
    </section>
  );
}

function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-1.5 block text-sm font-medium text-stone-700"
      >
        {label}
      </label>
      {children}
      {error && (
        <p id={`${htmlFor}-error`} className="mt-1.5 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

const inputClass =
  "w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 shadow-sm transition focus:border-stone-500 focus:outline-none focus:ring-2 focus:ring-stone-200 disabled:cursor-not-allowed disabled:bg-stone-50";

const selectClass = inputClass;

function Toggle({
  id,
  label,
  description,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <label htmlFor={id} className="text-sm font-medium text-stone-700">
          {label}
        </label>
        {description && (
          <p className="mt-0.5 text-sm text-stone-500">{description}</p>
        )}
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-stone-400 focus:ring-offset-2 ${
          checked ? "bg-stone-900" : "bg-stone-300"
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}

export default function SettingsForm() {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    setSettings(loadSettings());
  }, []);

  function update<K extends keyof Settings>(key: K, value: Settings[K]) {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setDirty(true);
    setSaved(false);
    setErrors((prev) => {
      const next = { ...prev };
      delete next[key as string];
      return next;
    });
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const validationErrors = validateSettings(settings);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    saveSettings(settings);
    setDirty(false);
    setSaved(true);
  }

  function handleReset() {
    setSettings({ ...defaultSettings });
    setErrors({});
    setDirty(true);
    setSaved(false);
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-stone-900">
          Settings
        </h1>
        <p className="mt-2 text-stone-500">
          Manage your profile, preferences, and notifications.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        <Section
          title="Profile"
          description="Your public identity and contact information."
        >
          <Field label="Display name" htmlFor="displayName" error={errors.displayName}>
            <input
              id="displayName"
              type="text"
              value={settings.displayName}
              onChange={(e) => update("displayName", e.target.value)}
              className={inputClass}
              aria-invalid={!!errors.displayName}
              aria-describedby={errors.displayName ? "displayName-error" : undefined}
              placeholder="Jane Doe"
              autoComplete="name"
            />
          </Field>

          <Field label="Email" htmlFor="email" error={errors.email}>
            <input
              id="email"
              type="email"
              value={settings.email}
              onChange={(e) => update("email", e.target.value)}
              className={inputClass}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
              placeholder="jane@example.com"
              autoComplete="email"
            />
          </Field>

          <Field label="Bio" htmlFor="bio" error={errors.bio}>
            <textarea
              id="bio"
              value={settings.bio}
              onChange={(e) => update("bio", e.target.value)}
              rows={3}
              className={inputClass}
              aria-invalid={!!errors.bio}
              placeholder="A short description about yourself"
              maxLength={200}
            />
            <p className="mt-1 text-xs text-stone-400">
              {settings.bio.length}/200 characters
            </p>
          </Field>
        </Section>

        <Section
          title="Preferences"
          description="Customize how the app looks and behaves."
        >
          <Field label="Theme" htmlFor="theme">
            <select
              id="theme"
              value={settings.theme}
              onChange={(e) => update("theme", e.target.value as Settings["theme"])}
              className={selectClass}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System</option>
            </select>
          </Field>

          <Field label="Language" htmlFor="language">
            <select
              id="language"
              value={settings.language}
              onChange={(e) => update("language", e.target.value)}
              className={selectClass}
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
            </select>
          </Field>

          <Field label="Timezone" htmlFor="timezone">
            <select
              id="timezone"
              value={settings.timezone}
              onChange={(e) => update("timezone", e.target.value)}
              className={selectClass}
            >
              <option value="America/New_York">Eastern (US)</option>
              <option value="America/Chicago">Central (US)</option>
              <option value="America/Denver">Mountain (US)</option>
              <option value="America/Los_Angeles">Pacific (US)</option>
              <option value="Europe/London">London</option>
              <option value="Europe/Paris">Paris</option>
              <option value="Asia/Kolkata">India (IST)</option>
              <option value="Asia/Tokyo">Tokyo</option>
              <option value="UTC">UTC</option>
            </select>
          </Field>
        </Section>

        <Section
          title="Notifications"
          description="Choose how and when you want to be notified."
        >
          <Toggle
            id="emailNotifications"
            label="Email notifications"
            description="Receive updates and alerts via email."
            checked={settings.emailNotifications}
            onChange={(v) => update("emailNotifications", v)}
          />

          <Toggle
            id="pushNotifications"
            label="Push notifications"
            description="Get real-time alerts in your browser."
            checked={settings.pushNotifications}
            onChange={(v) => update("pushNotifications", v)}
          />

          <Field label="Weekly digest" htmlFor="weeklyDigest">
            <select
              id="weeklyDigest"
              value={settings.weeklyDigest}
              onChange={(e) =>
                update("weeklyDigest", e.target.value as Settings["weeklyDigest"])
              }
              className={selectClass}
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="off">Off</option>
            </select>
          </Field>
        </Section>

        <Section
          title="Privacy"
          description="Control your data and visibility."
        >
          <Field label="Profile visibility" htmlFor="profileVisibility">
            <select
              id="profileVisibility"
              value={settings.profileVisibility}
              onChange={(e) =>
                update(
                  "profileVisibility",
                  e.target.value as Settings["profileVisibility"],
                )
              }
              className={selectClass}
            >
              <option value="public">Public — visible to everyone</option>
              <option value="private">Private — only you can see</option>
            </select>
          </Field>

          <Toggle
            id="analyticsEnabled"
            label="Usage analytics"
            description="Help improve the app by sharing anonymous usage data."
            checked={settings.analyticsEnabled}
            onChange={(v) => update("analyticsEnabled", v)}
          />
        </Section>

        <div className="flex items-center justify-between rounded-xl border border-stone-200 bg-white px-6 py-4 shadow-sm">
          <div>
            {saved && !dirty && (
              <p className="text-sm font-medium text-green-700" role="status">
                Settings saved successfully.
              </p>
            )}
            {dirty && !saved && (
              <p className="text-sm text-stone-500">You have unsaved changes.</p>
            )}
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 shadow-sm transition hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-stone-400 focus:ring-offset-2"
            >
              Reset
            </button>
            <button
              type="submit"
              className="rounded-lg bg-stone-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!dirty}
            >
              Save changes
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
