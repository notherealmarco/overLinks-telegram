import fetch from "node-fetch";
const BASE_URL = "https://webhook.site";
export const createWebhook = async () => {
    const request = await fetch(`${BASE_URL}/token`, {
        method: "post",
    });
    const { uuid: token } = (await request.json());
    await fetch(`${BASE_URL}/token/${token}/cors/toggle`, {
        method: "put",
    });
    return token;
};
export const getWebhookEndpoint = (token) => `${BASE_URL}/${token}`;
export const getWebhookResults = (token) => `${BASE_URL}/#!/${token}`;
//# sourceMappingURL=utils.js.map