function redact(value, secrets) {
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

export function getSafeErrorDetails(error, environment = process.env) {
  const message = error instanceof Error ? error.message : String(error);
  const code = typeof error?.code === "string" ? error.code : undefined;
  const safeMessage = redact(message || "Unknown error", [
    environment.DATABASE_URL,
    environment.DB_PASSWORD,
  ]);

  return code ? `[${code}] ${safeMessage}` : safeMessage;
}

export function logOperationalError(logger, context, error) {
  logger.error(`${context}: ${getSafeErrorDetails(error)}`);
}
