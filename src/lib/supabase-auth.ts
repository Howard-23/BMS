import "server-only"

type SupabaseUser = {
  id: string
  email?: string | null
  user_metadata?: Record<string, unknown> | null
}

type SupabaseAuthResponse = {
  user?: SupabaseUser | null
  session?: {
    access_token: string
    refresh_token: string
  } | null
}

type SupabaseAuthResult = {
  data: SupabaseAuthResponse | null
  error: string | null
}

function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

  if (!url || !publishableKey) {
    throw new Error("Supabase environment variables are not configured.")
  }

  return { url, publishableKey }
}

async function supabaseAuthRequest(
  path: string,
  payload: Record<string, unknown>
): Promise<SupabaseAuthResult> {
  const { url, publishableKey } = getSupabaseConfig()

  const response = await fetch(`${url}/auth/v1${path}`, {
    method: "POST",
    headers: {
      apikey: publishableKey,
      Authorization: `Bearer ${publishableKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  })

  const data = (await response.json().catch(() => null)) as
    | (SupabaseAuthResponse & {
        error_description?: string
        msg?: string
        message?: string
      })
    | null

  if (!response.ok) {
    return {
      data: null,
      error:
        data?.error_description ??
        data?.msg ??
        data?.message ??
        "Supabase authentication request failed.",
    }
  }

  return { data, error: null }
}

export async function signInWithSupabase(email: string, password: string) {
  return supabaseAuthRequest("/token?grant_type=password", {
    email,
    password,
  })
}

export async function signUpWithSupabase(
  email: string,
  password: string,
  metadata: Record<string, unknown>
) {
  return supabaseAuthRequest("/signup", {
    email,
    password,
    data: metadata,
  })
}
