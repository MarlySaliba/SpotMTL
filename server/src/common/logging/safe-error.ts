function redact(value: string, secrets: Array<string | undefined>): string {
  let redactedValue = value;

  for (const secret of secrets) {
    if (secret) {
      redactedValue = redactedValue.split(secret).join("[REDACTED]");
    }
  }

  return redactedValue.replace(
    /postgres(?:ql)?:\/\/[^@\s]+@/gi,
    "postgresql://[REDACTED]@",
  );
}

export function getSafeErrorDetails(
  error: unknown,
  environment: NodeJS.ProcessEnv = process.env,
): string {
  const message = error instanceof Error ? error.message : String(error);
  const errorWithCode = error as { code?: unknown };
  const code =
    typeof errorWithCode?.code === "string" ? errorWithCode.code : undefined;
  const safeMessage = redact(message || "Unknown error", [
    environment.DATABASE_URL,
    environment.DB_PASSWORD,
  ]);

  return code ? `[${code}] ${safeMessage}` : safeMessage;
}
