export type Theme = "light" | "dark" | "system";
export type ProfileVisibility = "public" | "private";
export type DigestFrequency = "daily" | "weekly" | "off";

export interface Settings {
  displayName: string;
  email: string;
  bio: string;
  theme: Theme;
  language: string;
  timezone: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  weeklyDigest: DigestFrequency;
  profileVisibility: ProfileVisibility;
  analyticsEnabled: boolean;
}

export const defaultSettings: Settings = {
  displayName: "",
  email: "",
  bio: "",
  theme: "system",
  language: "en",
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  emailNotifications: true,
  pushNotifications: false,
  weeklyDigest: "weekly",
  profileVisibility: "public",
  analyticsEnabled: true,
};

const STORAGE_KEY = "capstone-settings";

export function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...defaultSettings };
    return { ...defaultSettings, ...JSON.parse(raw) };
  } catch {
    return { ...defaultSettings };
  }
}

export function saveSettings(settings: Settings): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

export function validateSettings(settings: Settings): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!settings.displayName.trim()) {
    errors.displayName = "Display name is required.";
  } else if (settings.displayName.length > 50) {
    errors.displayName = "Display name must be 50 characters or fewer.";
  }

  if (!settings.email.trim()) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(settings.email)) {
    errors.email = "Enter a valid email address.";
  }

  if (settings.bio.length > 200) {
    errors.bio = "Bio must be 200 characters or fewer.";
  }

  return errors;
}
