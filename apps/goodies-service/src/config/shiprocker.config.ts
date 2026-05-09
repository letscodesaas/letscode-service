import { ENV } from "../env/env.js";
export class ShipRocketConfig {
  private url: string;
  private authToken: string;

  constructor() {
    this.url = ENV.SHIPROCKET_URL;
    this.authToken = "";
  }

  public async auth(email: string, password: string) {
    try {
      const response = await fetch(`${this.url}/external/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
      const data = await response.json();
      this.authToken = data;
    } catch (error) {
      throw new Error(String(error));
    }
  }

  public async createOrder(order: object) {
    try {
      if (!this.authToken) return;
      const response = await fetch(`${this.url}/external/orders/create/adhoc`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.authToken}`,
        },
        body: JSON.stringify(order),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error(String(error));
    }
  }
}
