import { db } from "./server/db";

await db.user.create({
  data: {
    emailAddress: "test@test22.com",
    firstName: "Test",
    lastName: "Test"
  },
});

const user = await db.user.findUnique({
  where: {
    emailAddress: "test@test.com"
  }
});

console.log(user);