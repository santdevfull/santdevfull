# Portfolio deployment

Repo: https://github.com/santdevfull/santdevfull

## Current publishing state
- Each project is prepared as an independent repository in the local workspace.
- The portfolio in this profile repository is an interim source with automated CI.
- GitHub Pages is not enabled; the manual workflow has to be activated once in repository settings.

## Enable GitHub Pages
1. In the GitHub repository, go to Settings > Pages.
2. Set Source to GitHub Actions.
3. Under Actions, run "Publish portfolio demos (manual activation required)".
4. The website will be available at https://santdevfull.github.io/ after a successful deploy.

The standalone repositories each carry CI and an automatic Pages deployment workflow.
After creating habitflow, budgetlab and pulseops repositories and pushing their sources,
enable Pages/GitHub Actions in each repository as described in its README.
