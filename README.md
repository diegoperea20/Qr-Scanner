# Qr Scanner

<p align="justify">
Qr Scanner where you can scan with the camera (change camera) and be redirected to the scanned url and shown the url. Or you can also select the file or drag the file and be redirected to the scanned url and shown the url.
</p>


<p align="center">
  <img src="README-images/homeqr.PNG" alt="Step1">
</p>

With Camera
<p align="center">
  <img src="README-images/qrscaned1.PNG" alt="Step2">
</p>

<p align="center">
  <img src="README-images/qrscaned2.PNG" alt="Step3">
</p>

With Select file or Drag files

<p align="center">
  <img src="README-images/fileqronly.PNG" alt="Step4">
</p>

<p align="center">
  <img src="README-images/github-qr.png" alt="Step5">
</p>


-----

Fronted Nextjs Options for do it:

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started
Nodejs version v20.10.0 and Next.js version v14.2.3 

First
```bash
npm install
```
run the development server:

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

## Resolve : Error Nextjs Parsing error: Cannot find module 'next/babel'

Put this code in .eslintrc.json 
```bash
{
  "extends": ["next/babel","next/core-web-vitals"]
}
```


Created by [Diego Ivan Perea Montealegre](https://github.com/diegoperea20)