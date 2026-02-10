import * as FileSystem from "expo-file-system/legacy";
import * as IntentLauncher from "expo-intent-launcher";
import { Linking, Platform } from "react-native";

export const RELEASES_LATEST_URL =
  "https://api.github.com/repos/LozanoTH/prueba_react_app/releases/latest";

export type ReleaseInfo = {
  latestVersion: string;
  htmlUrl: string | null;
  apkUrl: string | null;
};

export async function fetchLatestRelease(): Promise<ReleaseInfo | null> {
  const response = await fetch(RELEASES_LATEST_URL, {
    headers: { Accept: "application/vnd.github+json" },
  });
  if (!response.ok) return null;
  const data = await response.json();
  const latestTag = typeof data?.tag_name === "string" ? data.tag_name : "";
  const latestVersion = latestTag.replace(/^v/i, "");
  const asset = Array.isArray(data?.assets)
    ? data.assets.find((a: any) => a?.name === "app-release.apk")
    : null;
  const apkUrl = asset?.browser_download_url ?? null;
  const htmlUrl = data?.html_url ?? null;
  if (!latestVersion) return null;
  return { latestVersion, apkUrl, htmlUrl };
}

export function isNewerVersion(latest: string, current: string) {
  const toNum = (v: string) =>
    v
      .split(".")
      .map((p) => parseInt(p, 10) || 0);
  const [a1, b1, c1] = toNum(latest);
  const [a2, b2, c2] = toNum(current);
  return a1 > a2 || (a1 === a2 && (b1 > b2 || (b1 === b2 && c1 > c2)));
}

export async function downloadAndInstallApk(apkUrl: string) {
  if (Platform.OS !== "android") {
    await Linking.openURL(apkUrl);
    return;
  }
  const fileUri = FileSystem.cacheDirectory + "app-release.apk";
  const result = await FileSystem.downloadAsync(apkUrl, fileUri);
  const contentUri = await FileSystem.getContentUriAsync(result.uri);
  await IntentLauncher.startActivityAsync("android.intent.action.VIEW", {
    data: contentUri,
    flags: 1,
    type: "application/vnd.android.package-archive",
  });
}
