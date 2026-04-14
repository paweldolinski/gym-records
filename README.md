This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.




rozdzieliłem warstwy: app/api/... jako transport, lib/services/... jako logika, userService.ts jako DB
rozbiłem jedną dużą trasę api/users na osobne route’y: register, profile, record, image, approval, delete
przeniosłem logikę tokenów i weryfikacji e-mail do token.ts i verificationService.ts
usunąłem przestarzały folder utilities i stare importy serwera w frontendzie
poprawiłem page.tsx, by wywoływał API (/api/verify-email) zamiast bezpośrednio serwerowej funkcji
w page.tsx naprawiłem generowanie next/image src, aby nie przesyłać "?cb=..." jako źródła
dodałem wspólną walidację payloadów w userValidators.ts
przerzuciłem API na ujednolicone odpowiedzi successResponse / errorResponse
poprawiłem listę użytkowników w tabeli, aby zawsze obsługiwać wyniki jako tablicę
naprawiłem usuwanie admina, żeby lista od razu się odświeżała bez reloadu
poprawiłem zatwierdzanie użytkownika, bo klient błędnie oczekiwał statusu 201 zamiast 200