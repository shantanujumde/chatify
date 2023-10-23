export const PLANS = [
  {
    name: "Free",
    slug: "free",
    quota: 10,
    pagesPerPdf: 5,
    price: {
      amount: 0,
      priceIds: {
        test: "",
        production: "",
      },
    },
  },
  {
    name: "Pro",
    slug: "pro",
    quota: 50,
    pagesPerPdf: 25,
    price: {
      amount: 14,
      priceIds: {
        test: "price_1O3apdSBtUgiGZpp52ZjqA5r",
        production: "",
      },
    },
  },
  {
    name: "User",
    slug: "User",
    quota: 50,
    pagesPerPdf: 25,
    price: {
      amount: 14,
      priceIds: {
        test: "price_1NuEwTA19umTXGu8MeS3hN8L",
        production: "",
      },
    },
  },
] as const;
