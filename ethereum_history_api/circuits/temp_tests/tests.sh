
#!/bin/bash
TIMEFORMAT=%S
for i in {1..20}
do
    echo "\n$i"
    OUTPUT=$( { time (nargo test --package temp_tests --exact test_set_fragment_"$i" > /dev/null); } 2>&1 )
    TIME=$(echo "$OUTPUT" | grep -oE '[0-9]+$')
    echo $(echo "scale=2; $TIME / $i" | bc)
done

time nargo test --package temp_tests --exact test_set_fragment_40