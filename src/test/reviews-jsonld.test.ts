import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  GOOGLE_RATING,
  GOOGLE_REVIEW_COUNT,
  REVIEWS,
  productRatingJsonLd,
  reviewsForCategory,
} from "@/data/reviews";

// El JSON-LD estático de index.html no puede importar src/data/reviews.ts, así
// que se copia a mano. Este test avisa si se descuadran.
const readHomeJsonLd = () => {
  const html = readFileSync(join(process.cwd(), "index.html"), "utf8");
  const m = html.match(/<script type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/);
  if (!m) throw new Error("index.html sin JSON-LD");
  return JSON.parse(m[1]) as { "@graph": Array<Record<string, unknown>> };
};

type Product = {
  name: string;
  aggregateRating: { ratingValue: string; reviewCount: string };
  review: Array<{ author: { name: string }; reviewBody: string }>;
};

describe("JSON-LD de productos", () => {
  const products = (
    readHomeJsonLd()["@graph"].find((n) => n["@type"] === "LocalBusiness")!
      .makesOffer as Array<{ itemOffered: Product }>
  ).map((o) => o.itemOffered);

  it("index.html tiene los 6 productos con aggregateRating y review", () => {
    expect(products).toHaveLength(6);
    for (const p of products) {
      expect(p.aggregateRating.ratingValue, p.name).toBe(GOOGLE_RATING.replace(",", "."));
      expect(p.aggregateRating.reviewCount, p.name).toBe(String(GOOGLE_REVIEW_COUNT));
      expect(p.review.length, p.name).toBeGreaterThan(0);
      for (const r of p.review) {
        const src = REVIEWS.find((x) => x.name === r.author.name);
        expect(src, `${p.name}: reseña de ${r.author.name} no está en src/data/reviews.ts`).toBeDefined();
        expect(r.reviewBody).toBe(src!.text);
      }
    }
  });

  it("los cabeceros llevan reseñas de cabeceros y el resto, generales", () => {
    const cab = products.find((p) => p.name.startsWith("Cabeceros"))!;
    expect(cab.review.map((r) => r.author.name)).toEqual(
      reviewsForCategory("cabeceros").map((r) => r.name),
    );
    const puf = products.find((p) => p.name.startsWith("Pufs"))!;
    expect(puf.review.map((r) => r.author.name)).toEqual(
      reviewsForCategory("pufs").map((r) => r.name),
    );
  });

  it("productRatingJsonLd genera nota y reseñas válidas", () => {
    const j = productRatingJsonLd("bancos");
    expect(j.aggregateRating["@type"]).toBe("AggregateRating");
    expect(j.review.length).toBeGreaterThan(0);
    expect(j.review.every((r) => r.reviewRating.ratingValue === "5")).toBe(true);
  });
});
