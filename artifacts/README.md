# Firefox Artifacts

- `gecko-1.4.1.xpi.txt` — Base64 text representation of the signed Firefox package. Decode it with
  `npm run artifacts:decode` to recreate `gecko-1.4.1.xpi` locally. The plain-text extension prevents GitHub from
  hiding the file behind the “Binary files are not supported” banner. Older clones may still contain the
  `.base64` variant, which the decode script continues to accept.
