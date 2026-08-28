import { PasswordService } from "../src/auth/password.service";

describe("PasswordService", () => {
  const service = new PasswordService();

  it("creates salted scrypt hashes and verifies only the matching password", async () => {
    const firstHash = await service.hash("correct horse battery staple");
    const secondHash = await service.hash("correct horse battery staple");

    expect(firstHash).toMatch(/^scrypt\$32768\$8\$1\$/);
    expect(secondHash).not.toBe(firstHash);
    await expect(
      service.verify("correct horse battery staple", firstHash),
    ).resolves.toBe(true);
    await expect(service.verify("wrong password", firstHash)).resolves.toBe(
      false,
    );
  });

  it("performs a safe verification path for missing and malformed hashes", async () => {
    await expect(service.verify("password", undefined)).resolves.toBe(false);
    await expect(service.verify("password", "not-a-valid-hash")).resolves.toBe(
      false,
    );
  });
});
