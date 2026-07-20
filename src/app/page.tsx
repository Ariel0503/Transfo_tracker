import { auth, signIn, signOut } from "@/auth";
import Dashboard from "@/components/Dashboard";

export default async function Page() {
  const session = await auth();
  const roles = session?.user.roles ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-card border border-line bg-white p-4 shadow-card">
        <div>
          <h1 className="text-xl font-semibold text-ink">Transformation tracker</h1>
          <p className="text-sm text-ink-soft">Secure evidence and workflow visibility for regional delivery teams.</p>
        </div>
        <div className="flex items-center gap-2">
          {session ? (
            <>
              <span className="text-sm text-ink-soft">Signed in as {session.user.email ?? session.user.name}</span>
              <form action={async () => { "use server"; await signOut(); }}>
                <button type="submit" className="rounded-md border border-line px-3 py-2 text-sm font-medium text-ink">Sign out</button>
              </form>
            </>
          ) : (
            <form action={async () => { "use server"; await signIn("keycloak"); }}>
              <button type="submit" className="rounded-md bg-ink px-3 py-2 text-sm font-semibold text-white">Sign in with Keycloak</button>
            </form>
          )}
        </div>
      </div>

      {session ? (
        <div className="space-y-3">
          <div className="rounded-card border border-line bg-white p-4 shadow-card">
            <h2 className="text-base font-semibold text-ink">Access</h2>
            <p className="text-sm text-ink-soft">Active roles: {roles.length ? roles.join(", ") : "none"}</p>
          </div>
          <Dashboard />
        </div>
      ) : (
        <div className="rounded-card border border-dashed border-line bg-white p-8 text-center shadow-card">
          <h2 className="text-lg font-semibold text-ink">Authenticate to view the programme overview</h2>
          <p className="mt-2 text-sm text-ink-soft">Use your Keycloak account to access the dashboard and role-gated workflows.</p>
        </div>
      )}
    </div>
  );
}
