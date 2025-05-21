import { createApiBuilderFromCtpClient } from "@commercetools/platform-sdk";

import { ctpClient } from "@/api/repositories/build-client";

const apiRoot = createApiBuilderFromCtpClient(ctpClient).withProjectKey({
  projectKey: process.env.CTP_PROJECT_KEY!,
});

export default apiRoot;
