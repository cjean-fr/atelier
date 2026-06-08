/**
 * Shared dataset for the `realworld` benchmark — a port of @kitajs/html's
 * RealWorldPage scenario (a full page: layout, head, header/footer, a list of
 * purchases, user profile, sidebar). Same data across every runner so the
 * rendered HTML is comparable.
 *
 * https://github.com/kitajs/html/tree/next/benchmarks
 */
export interface Purchase {
  name: string;
  price: number;
  quantity: number;
}

export const NAME = "John";

export function generatePurchases(amount = 1000): Purchase[] {
  return Array.from({ length: amount }, (_, i) => ({
    name: `Purchase number ${i + 1}`,
    price: i * 2,
    quantity: i * 5,
  }));
}

export const PURCHASES: Purchase[] = generatePurchases();
