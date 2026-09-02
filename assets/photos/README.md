# Job photos

Drop your project photos in this folder using these exact filenames:

```
job-01.jpg   job-02.jpg   job-03.jpg   job-04.jpg
job-05.jpg   job-06.jpg   job-07.jpg   job-08.jpg
job-09.jpg   job-10.jpg   job-11.jpg   job-12.jpg
```

They appear automatically on the home page and the gallery page. Any filename
that is missing renders as a branded "photo coming soon" tile rather than a
broken image, so the site always looks finished.

To change the captions, alt text, or add more slots, edit the `gallery` array in
`src/data/site.js` and run `npm run build`.

## Guidance

- **Format:** JPG, landscape, roughly 4:3. 1600×1200 is plenty.
- **Size:** keep each file under ~400 KB. Large photos slow the site down, and
  page speed is a ranking factor.
- **Alt text matters for SEO.** The alt text lives in `src/data/site.js` — edit it
  to describe what is actually in each photo.
