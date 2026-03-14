# Calvin Ristad Portfolio

This site is structured as a GitHub Pages-compatible Jekyll project. GitHub Pages can build and deploy it directly from this repository without a custom CI pipeline.

## Structure

- `_config.yml`: Jekyll configuration
- `_layouts/default.html`: shared page shell
- `_includes/`: reusable sections and shared partials
- `_data/`: editable site content
- `assets/css/site.css`: centralized site styling
- `assets/documents/`: downloadable documents
- `assets/images/`: local media assets
- `index.html`: home page
- `resume.html`: resume page

## Updating Content

- Edit hero, social links, resume links, and demo settings in `_data/site.yml`
- Edit navigation in `_data/navigation.yml`
- Edit experience entries in `_data/experience.yml`
- Edit project entries in `_data/projects.yml`

## Local Preview

If you have Jekyll installed locally, run:

```bash
jekyll serve
```

Then open `http://127.0.0.1:4000`.

## Deployment

Push to the default branch and configure GitHub Pages to deploy from the repository root using GitHub Pages' standard Jekyll build.
