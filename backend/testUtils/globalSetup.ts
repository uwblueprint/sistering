import shell from "shelljs";

export default async (): Promise<void> => {
  shell.exec("npx prisma migrate deploy");
  shell.exec("npx prisma generate");
};
