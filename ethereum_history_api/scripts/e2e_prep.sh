nargo compile --package get_header
nargo compile --package get_account
nargo compile --package get_storage
nargo compile --package get_receipt
nargo compile --package get_transaction

echo "Prove get_header"
nargo prove --package get_header --oracle-resolver=http://localhost:5555
echo "Prove get_account"
nargo prove --package get_account --oracle-resolver=http://localhost:5555
echo "Prove get_storage"
nargo prove --package get_storage --oracle-resolver=http://localhost:5555
echo "Prove get_receipt"
nargo prove --package get_receipt --oracle-resolver=http://localhost:5555
echo "Prove get_transaction"
nargo prove --package get_transaction --oracle-resolver=http://localhost:5555

echo "Codegen get_header"
nargo codegen-verifier --package get_header
echo "Codegen get_account"
nargo codegen-verifier --package get_account
echo "Codegen get_storage"
nargo codegen-verifier --package get_storage
echo "Codegen get_receipt"
nargo codegen-verifier --package get_receipt
echo "Codegen get_transaction"
nargo codegen-verifier --package get_transaction
