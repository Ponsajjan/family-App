-- Allow one device (endpoint) to hold a subscription row per family (authId),
-- instead of a single globally-unique endpoint that gets overwritten whenever
-- the active family changes on a shared device.
DROP INDEX "PushSubscription_endpoint_key";

-- CreateIndex
CREATE UNIQUE INDEX "PushSubscription_endpoint_authId_key" ON "PushSubscription"("endpoint", "authId");
