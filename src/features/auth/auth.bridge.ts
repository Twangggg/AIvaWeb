type AuthBridge = {
  getAccessToken: () => string | undefined;
  refreshSession: () => Promise<boolean>;
  logout: () => Promise<void>;
};

let bridge: AuthBridge | null = null;

export function bindAuthBridge(next: AuthBridge): void {
  bridge = next;
}

export function getAccessToken(): string | undefined {
  return bridge?.getAccessToken();
}

export async function refreshAuthSession(): Promise<boolean> {
  if (!bridge) return false;
  return bridge.refreshSession();
}

export async function logoutAuthSession(): Promise<void> {
  await bridge?.logout();
}
