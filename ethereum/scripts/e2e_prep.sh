#!/bin/bash

packages=(get_header get_account get_storage get_receipt get_transaction get_log)

for pkg in "${packages[@]}"; do
  echo "Compiling $pkg"
  nargo compile --package "$pkg"

  echo "Executing $pkg"
  nargo execute --package "$pkg"

  echo "Proving $pkg"
  nargo prove --package "$pkg" --oracle-resolver=http://localhost:5555

  echo "Generating verifier for $pkg"
  nargo codegen-verifier --package "$pkg"

  echo "Done with $pkg"
  echo "-------------------------"
done
