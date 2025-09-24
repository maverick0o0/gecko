# Firefox Artifacts

- `gecko-1.4.1.xpi.base64` — text representation of the signed Firefox package. Decode it with `npm run artifacts:decode`
  to recreate `gecko-1.4.1.xpi` locally. The repository’s `.gitattributes` marks `*.base64` files as text so the
  contents render inline on GitHub without triggering the “Binary files are not supported” warning.
